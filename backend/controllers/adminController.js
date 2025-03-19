import adminBookingService from '../services/adminBookingService.js';

class AdminController {
  async getAllRepairRequests(req, res) {
    try {
      console.log('Fetching repair requests'); // Debug log
      const repairRequests = await adminBookingService.getAllRepairRequests();
      res.status(200).json({ success: true, data: repairRequests });
    } catch (error) {
      console.error('Error fetching repair requests:', error); // Debug log
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateBookingStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, technicianAssigned } = req.body;
      const updatedBooking = await adminBookingService.updateBookingStatus(id, { status, technicianAssigned });
      res.status(200).json({ success: true, data: updatedBooking, message: 'Booking status updated' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // New test insert method
  async testInsertBooking(req, res) {
    try {
      const testBooking = {
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        address: '123 Test St, Test City',
        serviceType: 'refrigerator',
        preferredDate: new Date(),
        preferredTime: 'morning',
        description: 'Test booking for admin panel',
        status: 'pending',
        technicianAssigned: null,
      };
      const newBooking = await adminBookingService.insertTestBooking(testBooking);
      res.status(201).json({ success: true, data: newBooking, message: 'Test booking inserted' });
    } catch (error) {
      console.error('Error inserting test booking:', error); // Debug log
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export default new AdminController();
