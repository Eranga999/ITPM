import { MongoClient, GridFSBucket } from 'mongodb';
import FixRequest from '../models/InstantFix.js';
import File from '../models/FileModel.js';  // Import the new File model

const mongoURI = process.env.MONGODB_URL;  // Make sure to set your MongoDB URI in the environment file

// Submit Fix Request
export const submitFixRequest = async (req, res) => {
  try {
    const { applianceType, issue } = req.body;
    const file = req.file;  // The file uploaded from the client
    
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    // Connect to MongoDB
    const client = await MongoClient.connect(mongoURI);
    const db = client.db();  // Get the MongoDB database
    const bucket = new GridFSBucket(db, { bucketName: 'uploads' });

    // Create a stream to upload the file to MongoDB
    const uploadStream = bucket.openUploadStream(file.originalname);
    uploadStream.end(file.buffer); // Upload the file's buffer to GridFS

    // Create metadata for the file
    const newFile = new File({
      fileName: file.originalname,
      fileId: uploadStream.id,  // Store the fileId (reference to the uploaded file in GridFS)
      contentType: file.mimetype,
      size: file.size,
    });

    // Save the file metadata
    await newFile.save();

    // Save the metadata of the fix request along with the fileId
    const newRequest = new FixRequest({
      applianceType,
      issue,
      fileId: uploadStream.id  // Store the fileId in the fix request
    });

    await newRequest.save();  // Save the new request to the database

    res.status(200).json({ message: 'Fix request submitted successfully!' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong. Please try again later.' });
  }
};
