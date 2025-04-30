import JobService from '../services/JobService.js';

class JobController {
  async createJob(req, res) {
    try {
      console.log('Creating job:', req.body);
      const job = await JobService.createJob(req.body);
      res.status(201).json({ success: true, data: job });
    } catch (error) {
      console.error('Create job error:', error.message, error.stack);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getJobsByTechnician(req, res) {
    try {
      const { technicianId, status } = req.query;
      console.log('Fetching jobs for technician:', technicianId, 'with status:', status);
      const jobs = await JobService.getJobsByTechnician(technicianId, status);
      res.status(200).json({ success: true, data: jobs });
    } catch (error) {
      console.error('Get jobs error:', error.message, error.stack);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getJobStats(req, res) {
    try {
      const { technicianId } = req.query;
      console.log('Fetching job stats for technician:', technicianId);
      const stats = await JobService.getJobStats(technicianId);
      res.status(200).json({ success: true, data: stats });
    } catch (error) {
      console.error('Get job stats error:', error.message, error.stack);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async updateJob(req, res) {
    try {
      console.log('Updating job ID:', req.params.id);
      const job = await JobService.updateJob(req.params.id, req.body);
      res.status(200).json({ success: true, data: job });
    } catch (error) {
      console.error('Update job error:', error.message, error.stack);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async deleteJob(req, res) {
    try {
      console.log('Deleting job ID:', req.params.id);
      const job = await JobService.deleteJob(req.params.id);
      res.status(200).json({ success: true, data: job });
    } catch (error) {
      console.error('Delete job error:', error.message, error.stack);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async assignJobToTechnician(req, res) {
    try {
      const { technicianId } = req.body;
      console.log('Assigning job:', req.params.id, 'to technician:', technicianId);
      const job = await JobService.assignJobToTechnician(req.params.id, technicianId);
      res.status(200).json({ success: true, data: job });
    } catch (error) {
      console.error('Assign job error:', error.message, error.stack);
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

export default new JobController();