import transportService from '../services/transportService.js';
import mongoose from 'mongoose';

class TransportController {
  async createTransportRequest(req, res) {
    try {
      console.log('POST /api/transport/request called');
      const transportData = req.body;
      const newRequest = await transportService.createTransportRequest(transportData);
      res.status(201).json({ success: true, data: newRequest, message: 'Transport request created successfully' });
    } catch (error) {
      console.error('Controller error creating transport request:', error.message, error.stack);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getTransportRequestsByTechnician(req, res) {
    try {
      console.log('GET /api/transport/technician called');
      const { technicianId } = req.query;
      if (!mongoose.Types.ObjectId.isValid(technicianId)) {
        return res.status(400).json({ success: false, message: 'Invalid technician ID' });
      }
      const requests = await transportService.getTransportRequestsByTechnician(technicianId);
      res.status(200).json({ success: true, data: requests });
    } catch (error) {
      console.error('Controller error fetching transport requests:', error.message, error.stack);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getAllTransportRequests(req, res) {
    try {
      console.log('GET /api/transport/all called');
      const requests = await transportService.getAllTransportRequests();
      res.status(200).json({ success: true, data: requests });
    } catch (error) {
      console.error('Controller error fetching all transport requests:', error.message, error.stack);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateTransportRequest(req, res) {
    try {
      console.log('PUT /api/transport/request/:id called');
      const { id } = req.params;
      const updateData = req.body;
      const updatedRequest = await transportService.updateTransportRequest(id, updateData);
      res.status(200).json({ success: true, data: updatedRequest, message: 'Transport request updated successfully' });
    } catch (error) {
      console.error('Controller error updating transport request:', error.message, error.stack);
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export default new TransportController();