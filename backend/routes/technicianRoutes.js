import express from 'express';
import technicianController from '../controllers/technicianController.js';
import jobController from '../controllers/jobController.js';

const router = express.Router();

// Add a new technician
router.post('/technicians', technicianController.createTechnician);

// Get all technicians
router.get('/technicians', technicianController.getAllTechnicians);

// Assign technician to booking
router.post('/assign', technicianController.assignTechnicianToBooking);

// Routes for jobs
router.get('/jobs', jobController.getJobsByTechnician);
router.get('/job-stats', jobController.getJobStats);

// Booking assignments
router.get('/assigned-bookings', technicianController.getAssignedBookings);
router.put('/bookings/:id/start', technicianController.startBooking);
router.put('/bookings/:id/complete', technicianController.completeBooking);

export default router;