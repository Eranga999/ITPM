import express from 'express';
import multer from 'multer';
import { submitFixRequest } from '../controllers/instantFixController.js';

const router = express.Router();

// Set up memory storage for multer directly in the route file
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Use the 'upload' middleware directly in the route
router.post('/submit', upload.single('file'), submitFixRequest);

export default router;
