// controllers/instantFixController.js
import FileModel from '../models/FileModel.js';  // Import your MongoDB model to store file metadata
import path from 'path';

// Submit Fix Request
export const submitFixRequest = async (req, res) => {
    try {
        const { applianceType, issue } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        console.log('Appliance Type:', applianceType);
        console.log('Issue:', issue);
        console.log('Uploaded file:', file);

        // Save file metadata to MongoDB
        const fileData = {
            originalName: file.originalname,
            filePath: path.join('uploads', file.filename),  
            fileType: file.mimetype,  // File type (e.g., image/jpeg, audio/mpeg)
            size: file.size,  // File size
            applianceType,  // Appliance type from the request
            issue, 
        };

        // Create and save the file metadata in MongoDB
        const newFile = new FileModel(fileData);
        await newFile.save();

        res.status(200).json({ message: 'Fix request submitted successfully!', fileData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
};

// Get All Requests
export const getAllRequests = async (req, res) => {
    try {
        // Fetch all requests from MongoDB
        const requests = await FileModel.find();  // Assuming FileModel is your MongoDB model
        res.status(200).json({ message: 'All requests fetched successfully!', requests });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching requests. Please try again later.' });
    }
};
