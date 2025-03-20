// routes/serviceCenterRoutes.js
import express from 'express';
import serviceCenterController from '../controllers/serviceCenterController.js';

const router = express.Router();

router.post('/service-centers', serviceCenterController.createServiceCenter);
router.get('/service-centers', serviceCenterController.getAllServiceCenters);
router.put('/service-centers/:id', serviceCenterController.updateServiceCenter);
router.delete('/service-centers/:id', serviceCenterController.deleteServiceCenter);

// New route for service center bookings
router.get('/service-centers/:id/bookings', serviceCenterController.getServiceCenterBookings);

export default router;