import Booking from '../models/Booking.js';

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
}

export default new AdminBookingService();