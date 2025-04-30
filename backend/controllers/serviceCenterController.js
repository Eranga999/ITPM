// controllers/serviceCenterController.js
import serviceCenterService from '../services/serviceCenterService.js';

class ServiceCenterController {
  async createServiceCenter(req, res) {
    try {
      console.log('POST /api/admin/service-centers called');
      const centerData = req.body;
      const newCenter = await serviceCenterService.createServiceCenter(centerData);
      res.status(201).json({ success: true, data: newCenter, message: 'Service center added successfully' });
    } catch (error) {
      console.error('Controller error creating service center:', error.message, error.stack);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getAllServiceCenters(req, res) {
    try {
      console.log('GET /api/admin/service-centers called');
      const centers = await serviceCenterService.getAllServiceCenters();
      res.status(200).json({ success: true, data: centers });
    } catch (error) {
      console.error('Controller error fetching service centers:', error.message, error.stack);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateServiceCenter(req, res) {
    try {
      console.log('PUT /api/admin/service-centers/:id called');
      const { id } = req.params;
      const updateData = req.body;
      const updatedCenter = await serviceCenterService.updateServiceCenter(id, updateData);
      res.status(200).json({ success: true, data: updatedCenter, message: 'Service center updated successfully' });
    } catch (error) {
      console.error('Controller error updating service center:', error.message, error.stack);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async deleteServiceCenter(req, res) {
    try {
      console.log('DELETE /api/admin/service-centers/:id called');
      const { id } = req.params;
      const deletedCenter = await serviceCenterService.deleteServiceCenter(id);
      res.status(200).json({ success: true, data: deletedCenter, message: 'Service center deleted successfully' });
    } catch (error) {
      console.error('Controller error deleting service center:', error.message, error.stack);
      res.status(500).json({ success: false, message: error.message });
    }
  }
  async assignBookingToTechnician(req, res) {
    try {
      console.log('POST /api/service-centers/bookings/:bookingId/assign called');
      const { bookingId } = req.params;
      const { technicianId } = req.body;
      const result = await serviceCenterService.assignBookingToTechnician(bookingId, technicianId);
      res.status(200).json({
        success: true,
        data: result,
        message: 'Technician assigned and job created successfully',
      });
    } catch (error) {
      console.error('Controller error assigning technician:', error.message, error.stack);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // New endpoint for service center dashboard
  async getServiceCenterBookings(req, res) {
    try {
      const { id } = req.params;
      console.log('GET /api/service-centers/:id/bookings called');
      const bookings = await serviceCenterService.getServiceCenterBookings(id);
      res.status(200).json({ success: true, data: bookings });
    } catch (error) {
      console.error('Controller error fetching service center bookings:', error.message, error.stack);
      res.status(500).json({ success: false, message: error.message });
    }
  }
  
}

export default new ServiceCenterController();