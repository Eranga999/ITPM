import Booking from '../models/Booking.js';

class BookingService {
  async createBooking(bookingData) {
    try {
      console.log('Processing booking:', bookingData);

      bookingData.preferredDate = new Date(bookingData.preferredDate);
      if (bookingData.preferredDate < new Date().setHours(0, 0, 0, 0)) {
        throw new Error('Preferred date cannot be in the past.');
      }

      // Check preferredTime value and assign if valid
      if (!['morning', 'afternoon', 'evening'].includes(bookingData.preferredTime)) {
        bookingData.preferredTime = null;  // Set to null if invalid
      }

      const booking = new Booking(bookingData);
      const savedBooking = await booking.save();
      console.log('Booking created successfully:', savedBooking);
      return savedBooking;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw new Error(error.message);
    }
  }

  async getAllBookings() {
    try {
      return await Booking.find();
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw new Error('Failed to fetch bookings');
    }
  }

  async getBookingById(id) {
    try {
      const booking = await Booking.findById(id);
      if (!booking) throw new Error('Booking not found');
      return booking;
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw new Error('Failed to get booking');
    }
  }

  async updateBooking(id, updatedData) {
    try {
      updatedData.preferredDate = new Date(updatedData.preferredDate);
      const booking = await Booking.findByIdAndUpdate(id, updatedData, { new: true });
      if (!booking) throw new Error('Booking not found');
      return booking;
    } catch (error) {
      console.error('Error updating booking:', error);
      throw new Error('Failed to update booking');
    }
  }

  async deleteBooking(id) {
    try {
      const result = await Booking.findByIdAndDelete(id);
      if (!result) throw new Error('Booking not found');
      return { message: 'Booking deleted successfully' };
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw new Error('Failed to delete booking');
    }
  }
}

export default new BookingService();
