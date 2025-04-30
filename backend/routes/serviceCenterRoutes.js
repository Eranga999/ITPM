import express from 'express';
import serviceCenterController from '../controllers/serviceCenterController.js';

const router = express.Router();

// Create a new service center
router.post('/', serviceCenterController.createServiceCenter);

// Get all service centers
router.get('/', serviceCenterController.getAllServiceCenters);

// Update a service center
router.put('/:id', serviceCenterController.updateServiceCenter);

// Delete a service center
router.delete('/:id', serviceCenterController.deleteServiceCenter);

// Get bookings for a service center
router.get('/:id/bookings', serviceCenterController.getServiceCenterBookings);

// Assign a technician to a booking
router.post('/bookings/:bookingId/assign', serviceCenterController.assignBookingToTechnician);

export default router;