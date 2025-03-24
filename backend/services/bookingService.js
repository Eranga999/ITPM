// services/bookingService.js
import Booking from '../models/Booking.js';

class BookingService {
  async createBooking(bookingData) {
    try {
      console.log('Processing booking:', bookingData);

      bookingData.preferredDate = new Date(bookingData.preferredDate);
      if (bookingData.preferredDate < new Date().setHours(0, 0, 0, 0)) {
        throw new Error('Preferred date cannot be in the past.');
      }

      if (!['morning', 'afternoon', 'evening'].includes(bookingData.preferredTime)) {
        bookingData.preferredTime = null;
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
      // Populate technicianAssigned with firstName and lastName
      const bookings = await Booking.find().populate('technicianAssigned', 'firstName lastName');
      console.log('Fetched bookings (backend):', JSON.stringify(bookings, null, 2)); // Add debugging
      return bookings;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw new Error('Failed to fetch bookings');
    }
  }

  async getBookingById(id) {
    try {
      const booking = await Booking.findById(id).populate('technicianAssigned', 'firstName lastName');
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
      const booking = await Booking.findByIdAndUpdate(id, updatedData, { new: true }).populate('technicianAssigned', 'firstName lastName');
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