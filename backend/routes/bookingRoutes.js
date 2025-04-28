import express from 'express';
import bookingController from '../controllers/bookingController.js';
import { authenticateToken } from '../routes/authRoutes.js'; // Import from authRoutes


const router = express.Router();

router.post('/bookings', authenticateToken, bookingController.createBooking);
router.get('/bookings', authenticateToken, bookingController.getAllBookings);
router.get('/bookings/:id', authenticateToken, bookingController.getBookingById);
router.put('/bookings/:id', authenticateToken, bookingController.updateBooking);
router.delete('/bookings/:id', authenticateToken, bookingController.deleteBooking);

export default router;