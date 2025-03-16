import bookingService from '../services/bookingService.js';

class BookingController {
  async createBooking(req, res) {
    try {
      console.log('Received request body:', req.body); // Log the received data
      const newBooking = await bookingService.createBooking(req.body);
      res.status(201).json({ success: true, data: newBooking, message: 'Booking created successfully' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
  

  async getAllBookings(req, res) {
    try {
      const bookings = await bookingService.getAllBookings();
      res.status(200).json({ success: true, data: bookings });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getBookingById(req, res) {
    try {
      const booking = await bookingService.getBookingById(req.params.id);
      res.status(200).json({ success: true, data: booking });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  async updateBooking(req, res) {
    try {
      const updatedBooking = await bookingService.updateBooking(req.params.id, req.body);
      res.status(200).json({ success: true, data: updatedBooking, message: 'Booking updated successfully' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async deleteBooking(req, res) {
    try {
      const response = await bookingService.deleteBooking(req.params.id);
      res.status(200).json({ success: true, message: response.message });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

export default new BookingController();
