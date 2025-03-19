import mongoose from 'mongoose';
import TransportRequest from '../models/TransportRequest.js';

class TransportService {
  async createTransportRequest(transportData) {
    try {
      console.log('Creating transport request:', transportData);
      const transportRequest = new TransportRequest(transportData);
      const savedRequest = await transportRequest.save();
      console.log('Transport request saved:', savedRequest);
      return savedRequest;
    } catch (error) {
      console.error('Error creating transport request:', error.message, error.stack);
      throw error;
    }
  }

  async getTransportRequestsByTechnician(technicianId) {
    try {
      console.log('Fetching transport requests for technician:', technicianId);
      if (!mongoose.Types.ObjectId.isValid(technicianId)) {
        throw new Error('Invalid technician ID');
      }
      const requests = await TransportRequest.find({ technician: technicianId })
        .populate('job')
        .populate('technician', 'firstName lastName')
        .populate('serviceCenter', 'name location');
      console.log('Transport requests retrieved:', requests);
      return requests;
    } catch (error) {
      console.error('Error fetching transport requests:', error.message, error.stack);
      throw error;
    }
  }

  async getAllTransportRequests() {
    try {
      console.log('Fetching all transport requests');
      const requests = await TransportRequest.find()
        .populate('job')
        .populate('technician', 'firstName lastName')
        .populate('serviceCenter', 'name location');
      console.log('All transport requests retrieved:', requests);
      return requests;
    } catch (error) {
      console.error('Error fetching all transport requests:', error.message, error.stack);
      throw error;
    }
  }

  async updateTransportRequest(id, updateData) {
    try {
      console.log('Updating transport request ID:', id);
      const updatedRequest = await TransportRequest.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      })
        .populate('job')
        .populate('technician', 'firstName lastName')
        .populate('serviceCenter', 'name location');
      if (!updatedRequest) throw new Error('Transport request not found');
      console.log('Transport request updated:', updatedRequest);
      return updatedRequest;
    } catch (error) {
      console.error('Error updating transport request:', error.message, error.stack);
      throw error;
    }
  }
}

export default new TransportService();