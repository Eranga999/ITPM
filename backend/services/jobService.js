import mongoose from 'mongoose';
import Job from '../models/Job.js';

class JobService {
  async createJob(jobData) {
    try {
      console.log('Creating job:', jobData);
      const job = new Job(jobData);
      const savedJob = await job.save();
      console.log('Job saved:', savedJob);
      return savedJob;
    } catch (error) {
      console.error('Error creating job:', error.message, error.stack);
      throw error;
    }
  }

  async getJobsByTechnician(technicianId, status = null) {
    try {
      console.log('Fetching jobs for technician:', technicianId);
      // Validate technicianId
      if (!mongoose.Types.ObjectId.isValid(technicianId)) {
        throw new Error('Invalid technician ID');
      }
      const query = { technician: technicianId };
      if (status) query.status = status;
      const jobs = await Job.find(query).populate('technician', 'firstName lastName');
      console.log('Jobs retrieved:', jobs);
      return jobs;
    } catch (error) {
      console.error('Error fetching jobs:', error.message, error.stack);
      throw error;
    }
  }

  async getJobStats(technicianId) {
    try {
      console.log('Fetching job stats for technician:', technicianId);
      // Validate technicianId
      if (!mongoose.Types.ObjectId.isValid(technicianId)) {
        throw new Error('Invalid technician ID');
      }
      const stats = await Job.aggregate([
        { $match: { technician: new mongoose.Types.ObjectId(technicianId) } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]);

      const urgentCount = await Job.countDocuments({
        technician: technicianId,
        urgency: 'High',
        status: { $ne: 'Completed' },
      });

      const result = {
        pending: 0,
        inProgress: 0,
        completed: 0,
        urgent: urgentCount,
      };

      stats.forEach((stat) => {
        if (stat._id === 'Pending') result.pending = stat.count;
        if (stat._id === 'In Progress') result.inProgress = stat.count;
        if (stat._id === 'Completed') result.completed = stat.count;
      });

      console.log('Job stats:', result);
      return result;
    } catch (error) {
      console.error('Error fetching job stats:', error.message, error.stack);
      throw error;
    }
  }

  async updateJob(id, updateData) {
    try {
      console.log('Updating job ID:', id);
      const updatedJob = await Job.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      }).populate('technician', 'firstName lastName');
      if (!updatedJob) throw new Error('Job not found');
      console.log('Job updated:', updatedJob);
      return updatedJob;
    } catch (error) {
      console.error('Error updating job:', error.message, error.stack);
      throw error;
    }
  }

  async deleteJob(id) {
    try {
      console.log('Deleting job ID:', id);
      const deletedJob = await Job.findByIdAndDelete(id);
      if (!deletedJob) throw new Error('Job not found');
      console.log('Job deleted:', deletedJob);
      return deletedJob;
    } catch (error) {
      console.error('Error deleting job:', error.message, error.stack);
      throw error;
    }
  }
}

export default new JobService();