import express from 'express';
import jobController from '../controllers/jobController.js';

const router = express.Router();

// Add a new job
router.post('/jobs', jobController.createJob);

// Get jobs for a technician
router.get('/jobs', jobController.getJobsByTechnician);

// Get job stats for a technician
router.get('/job-stats', jobController.getJobStats);

// Update a job
router.put('/jobs/:id', jobController.updateJob);

// Delete a job
router.delete('/jobs/:id', jobController.deleteJob);

// Assign a job to a technician
router.post('/jobs/:id/assign', jobController.assignJobToTechnician);

export default router;