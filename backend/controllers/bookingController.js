// controllers/bookingController.js
import bookingService from '../services/bookingService.js';

class BookingController {
  async createBooking(req, res) {
    try {
      if (req.user.role !== 'customer') {
        return res.status(403).json({ success: false, message: 'Only customers can create bookings' });
      }
      console.log('Received request body:', req.body);
      const newBooking = await bookingService.createBooking(req.body, req.user.id);
      res.status(201).json({ success: true, data: newBooking, message: 'Booking created successfully' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getAllBookings(req, res) {
    try {
      if (req.user.role !== 'customer') {
        return res.status(403).json({ success: false, message: 'Only customers can view their bookings' });
      }
      const bookings = await bookingService.getAllBookings(req.user.id);
      res.status(200).json({ success: true, data: bookings });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getBookingById(req, res) {
    try {
      const booking = await bookingService.getBookingById(req.params.id, req.user.id);
      res.status(200).json({ success: true, data: booking });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  async updateBooking(req, res) {
    try {
      const updatedBooking = await bookingService.updateBooking(req.params.id, req.body, req.user.id);
      res.status(200).json({ success: true, data: updatedBooking, message: 'Booking updated successfully' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async deleteBooking(req, res) {
    try {
      const response = await bookingService.deleteBooking(req.params.id, req.user.id);
      res.status(200).json({ success: true, message: response.message });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

export default new BookingController();