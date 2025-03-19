import express from 'express';
import serviceCenterController from '../controllers/serviceCenterController.js';

const router = express.Router();

// Add a new service center
router.post('/service-centers', serviceCenterController.createServiceCenter);

// Get all service centers
router.get('/service-centers', serviceCenterController.getAllServiceCenters);

// Update a service center
router.put('/service-centers/:id', serviceCenterController.updateServiceCenter);

// Delete a service center
router.delete('/service-centers/:id', serviceCenterController.deleteServiceCenter);

export default router;