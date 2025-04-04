import express from 'express';
import multer from 'multer';
import path from 'path';
import { submitFixRequest, getAllRequests } from '../controllers/instantFixController.js';  // ES module import

const router = express.Router();

// Set up file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// Routes
router.post('/submit', upload.single('file'), submitFixRequest);
router.get('/all', getAllRequests);

export default router;
