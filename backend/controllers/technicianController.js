import technicianService from '../services/technicianService.js';

class TechnicianController {
  async createTechnician(req, res) {
    try {
      console.log('POST /api/admin/technicians called');
      const technicianData = req.body;
      const newTechnician = await technicianService.createTechnician(technicianData);
      res.status(201).json({ success: true, data: newTechnician, message: 'Technician added successfully' });
    } catch (error) {
      console.error('Controller error creating technician:', error.message, error.stack);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getAllTechnicians(req, res) {
    try {
      console.log('GET /api/admin/technicians called');
      const technicians = await technicianService.getAllTechnicians();
      res.status(200).json({ success: true, data: technicians });
    } catch (error) {
      console.error('Controller error fetching technicians:', error.message, error.stack);
      res.status(500).json({ success: false, message: error.message });
    }
  }
  
  async getAssignedBookings(req, res) {
    try {
      console.log('GET /api/technician/assigned-bookings called');
      const { technicianId } = req.query;
      
      if (!technicianId) {
        return res.status(400).json({ 
          success: false, 
          message: 'Technician ID is required' 
        });
      }
      
      const bookings = await technicianService.getAssignedBookings(technicianId);
      res.status(200).json({ success: true, data: bookings });
    } catch (error) {
      console.error('Controller error fetching assigned bookings:', error.message, error.stack);
      res.status(500).json({ success: false, message: error.message });
    }
  }
  
  async startBooking(req, res) {
    try {
      console.log('PUT /api/technician/bookings/:id/start called');
      const { id } = req.params;
      const { technicianId } = req.body;
      
      if (!technicianId) {
        return res.status(400).json({ 
          success: false, 
          message: 'Technician ID is required' 
        });
      }
      
      const updatedBooking = await technicianService.updateBookingStatus(id, technicianId, 'in-progress');
      res.status(200).json({ 
        success: true, 
        data: updatedBooking, 
        message: 'Booking started successfully' 
      });
    } catch (error) {
      console.error('Controller error starting booking:', error.message, error.stack);
      res.status(500).json({ success: false, message: error.message });
    }
  }
  
  async completeBooking(req, res) {
    try {
      console.log('PUT /api/technician/bookings/:id/complete called');
      const { id } = req.params;
      const { technicianId } = req.body;
      
      if (!technicianId) {
        return res.status(400).json({ 
          success: false, 
          message: 'Technician ID is required' 
        });
      }
      
      const updatedBooking = await technicianService.updateBookingStatus(id, technicianId, 'completed');
      res.status(200).json({ 
        success: true, 
        data: updatedBooking, 
        message: 'Booking completed successfully' 
      });
    } catch (error) {
      console.error('Controller error completing booking:', error.message, error.stack);
      res.status(500).json({ success: false, message: error.message });
    }
  }
  
  async assignTechnicianToBooking(req, res) {
    try {
      console.log('POST /api/technician/assign called');
      const { bookingId, technicianId } = req.body;
      
      if (!bookingId || !technicianId) {
        return res.status(400).json({ 
          success: false, 
          message: 'Booking ID and Technician ID are required' 
        });
      }
      
      const result = await technicianService.assignTechnicianToBooking(bookingId, technicianId);
      res.status(200).json({ 
        success: true, 
        data: result, 
        message: 'Technician assigned successfully' 
      });
    } catch (error) {
      console.error('Controller error assigning technician:', error.message, error.stack);
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export default new TechnicianController();