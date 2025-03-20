// services/adminBookingService.js
import Booking from '../models/Booking.js';
import ServiceCenterBooking from '../models/ServiceCenterBooking.js';

class AdminBookingService {
  async getAllRepairRequests() {
    try {
      console.log('Fetching all repair requests');
      const bookings = await Booking.find()
        .select('name serviceType description status technicianAssigned preferredDate');
      console.log('Bookings retrieved:', bookings);
      return bookings;
    } catch (error) {
      console.error('Error fetching repair requests:', error.message, error.stack);
      throw error;
    }
  }

  async updateBookingStatus(id, updateData) {
    try {
      console.log('Updating booking status for ID:', id);
      const booking = await Booking.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
      if (!booking) throw new Error('Booking not found');
      console.log('Booking updated:', booking);
      return booking;
    } catch (error) {
      console.error('Error updating status:', error.message, error.stack);
      throw error;
    }
  }

  async insertTestBooking(bookingData) {
    try {
      console.log('Inserting test booking:', bookingData);
      const booking = new Booking(bookingData);
      const savedBooking = await booking.save();
      console.log('Test booking saved:', savedBooking);
      return savedBooking;
    } catch (error) {
      console.error('Error inserting test booking:', error.message, error.stack);
      throw error;
    }
  }

  // Updated assignServiceCenter method
  async assignServiceCenter(bookingId, serviceCenterId) {
    try {
      console.log('Assigning service center:', { bookingId, serviceCenterId });
      const booking = await Booking.findById(bookingId);
      if (!booking) throw new Error('Booking not found');

      // Create a new ServiceCenterBooking entry
      const serviceCenterBooking = new ServiceCenterBooking({
        bookingId,
        serviceCenterId,
      });
      const savedServiceCenterBooking = await serviceCenterBooking.save();

      // Optionally update the booking status
      booking.status = 'confirmed';
      await booking.save();

      console.log('Service center assigned and booking updated:', savedServiceCenterBooking);
      return savedServiceCenterBooking;
    } catch (error) {
      console.error('Error assigning service center:', error.message, error.stack);
      throw error;
    }
  }
}

export default new AdminBookingService();