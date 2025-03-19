import express from 'express';
import adminController from '../controllers/adminController.js';

const router = express.Router();

// Fetch all repair requests
router.get('/repair-requests', adminController.getAllRepairRequests);

// Update booking status
router.put('/repair-requests/:id', adminController.updateBookingStatus);

// New test insert endpoint
router.post('/repair-requests/test-insert', adminController.testInsertBooking);

export default router;