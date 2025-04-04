import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  fileId: {
    type: mongoose.Schema.Types.ObjectId,  // This references the file in GridFS
    required: true,
  },
  contentType: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

const File = mongoose.model('File', fileSchema);

export default File;
