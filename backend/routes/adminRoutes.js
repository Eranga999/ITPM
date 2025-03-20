import express from 'express';
import adminController from '../controllers/adminController.js';

const router = express.Router();

router.get('/repair-requests', adminController.getAllRepairRequests);
router.put('/repair-requests/:id', adminController.updateBookingStatus);
router.post('/repair-requests/test-insert', adminController.testInsertBooking);

// New route for assigning service center
router.put('/repair-requests/:id/assign-service-center', adminController.assignServiceCenter);

export default router;