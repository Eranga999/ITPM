// services/bookingService.js
import Booking from '../models/Booking.js';

class BookingService {
  async createBooking(bookingData, customerId) {
    try {
      console.log('Processing booking:', bookingData, 'for customer:', customerId);

      bookingData.preferredDate = new Date(bookingData.preferredDate);
      if (bookingData.preferredDate < new Date().setHours(0, 0, 0, 0)) {
        throw new Error('Preferred date cannot be in the past.');
      }

      if (!['morning', 'afternoon', 'evening'].includes(bookingData.preferredTime)) {
        bookingData.preferredTime = null;
      }

      // Add customerId to bookingData
      const booking = new Booking({ ...bookingData, customerId });
      const savedBooking = await booking.save();
      console.log('Booking created successfully:', savedBooking);
      return savedBooking;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw new Error(error.message);
    }
  }

  async getAllBookings(customerId) {
    try {
      const bookings = await Booking.find({ customerId })
        .populate('technicianAssigned', 'firstName lastName')
        .sort({ preferredDate: 1 });
      console.log('Fetched bookings for customer:', customerId, JSON.stringify(bookings, null, 2));
      return bookings;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw new Error('Failed to fetch bookings');
    }
  }

  async getBookingById(id, customerId) {
    try {
      const booking = await Booking.findOne({ _id: id, customerId })
        .populate('technicianAssigned', 'firstName lastName');
      if (!booking) throw new Error('Booking not found or you do not have access');
      return booking;
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw new Error(error.message || 'Failed to get booking');
    }
  }

  async updateBooking(id, updatedData, customerId) {
    try {
      updatedData.preferredDate = new Date(updatedData.preferredDate);
      const booking = await Booking.findOneAndUpdate(
        { _id: id, customerId },
        updatedData,
        { new: true }
      ).populate('technicianAssigned', 'firstName lastName');
      if (!booking) throw new Error('Booking not found or you do not have access');
      return booking;
    } catch (error) {
      console.error('Error updating booking:', error);
      throw new Error(error.message || 'Failed to update booking');
    }
  }

  async deleteBooking(id, customerId) {
    try {
      const result = await Booking.findOneAndDelete({ _id: id, customerId });
      if (!result) throw new Error('Booking not found or you do not have access');
      return { message: 'Booking deleted successfully' };
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw new Error(error.message || 'Failed to delete booking');
    }
  }
}

export default new BookingService();