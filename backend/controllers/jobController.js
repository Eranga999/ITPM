import jobService from '../services/jobService.js';

class JobController {
  async createJob(req, res) {
    try {
      console.log('POST /api/technician/jobs called');
      const jobData = req.body;
      const newJob = await jobService.createJob(jobData);
      res.status(201).json({ success: true, data: newJob, message: 'Job added successfully' });
    } catch (error) {
      console.error('Controller error creating job:', error.message, error.stack);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getJobsByTechnician(req, res) {
    try {
      console.log('GET /api/technician/jobs called');
      const { technicianId, status } = req.query;
      const jobs = await jobService.getJobsByTechnician(technicianId, status);
      res.status(200).json({ success: true, data: jobs });
    } catch (error) {
      console.error('Controller error fetching jobs:', error.message, error.stack);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getJobStats(req, res) {
    try {
      console.log('GET /api/technician/job-stats called');
      const { technicianId } = req.query;
      const stats = await jobService.getJobStats(technicianId);
      res.status(200).json({ success: true, data: stats });
    } catch (error) {
      console.error('Controller error fetching job stats:', error.message, error.stack);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateJob(req, res) {
    try {
      console.log('PUT /api/technician/jobs/:id called');
      const { id } = req.params;
      const updateData = req.body;
      const updatedJob = await jobService.updateJob(id, updateData);
      res.status(200).json({ success: true, data: updatedJob, message: 'Job updated successfully' });
    } catch (error) {
      console.error('Controller error updating job:', error.message, error.stack);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async deleteJob(req, res) {
    try {
      console.log('DELETE /api/technician/jobs/:id called');
      const { id } = req.params;
      const deletedJob = await jobService.deleteJob(id);
      res.status(200).json({ success: true, data: deletedJob, message: 'Job deleted successfully' });
    } catch (error) {
      console.error('Controller error deleting job:', error.message, error.stack);
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export default new JobController();