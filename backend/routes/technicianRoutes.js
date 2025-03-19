import express from 'express';
import technicianController from '../controllers/technicianController.js';

const router = express.Router();

// Add a new technician
router.post('/technicians', technicianController.createTechnician);

// Get all technicians
router.get('/technicians', technicianController.getAllTechnicians);

export default router;