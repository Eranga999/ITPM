import express from 'express';
import transportController from '../controllers/transportController.js';

const router = express.Router();

router.post('/request', transportController.createTransportRequest);
router.get('/technician', transportController.getTransportRequestsByTechnician);
router.get('/all', transportController.getAllTransportRequests);
router.put('/request/:id', transportController.updateTransportRequest);

export default router;