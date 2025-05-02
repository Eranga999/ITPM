// services/serviceCenterService.js
import ServiceCenter from '../models/ServiceCenter.js';
import ServiceCenterBooking from '../models/ServiceCenterBooking.js';

class ServiceCenterService {
  async createServiceCenter(centerData) {
    try {
      console.log('Creating service center:', centerData);
      const serviceCenter = new ServiceCenter(centerData);
      const savedCenter = await serviceCenter.save();
      console.log('Service center saved:', savedCenter);
      return savedCenter;
    } catch (error) {
      console.error('Error creating service center:', error.message, error.stack);
      throw error;
    }
  }

  async getAllServiceCenters() {
    try {
      console.log('Fetching all service centers');
      const centers = await ServiceCenter.find();
      console.log('Service centers retrieved:', centers);
      return centers;
    } catch (error) {
      console.error('Error fetching service centers:', error.message, error.stack);
      throw error;
    }
  }

  async updateServiceCenter(id, updateData) {
    try {
      console.log('Updating service center ID:', id);
      const updatedCenter = await ServiceCenter.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });
      if (!updatedCenter) throw new Error('Service center not found');
      console.log('Service center updated:', updatedCenter);
      return updatedCenter;
    } catch (error) {
      console.error('Error updating service center:', error.message, error.stack);
      throw error;
    }
  }

  async deleteServiceCenter(id) {
    try {
      console.log('Deleting service center ID:', id);
      const deletedCenter = await ServiceCenter.findByIdAndDelete(id);
      if (!deletedCenter) throw new Error('Service center not found');
      console.log('Service center deleted:', deletedCenter);
      return deletedCenter;
    } catch (error) {
      console.error('Error deleting service center:', error.message, error.stack);
      throw error;
    }
  }

  // New method to get bookings for a service center
  async getServiceCenterBookings(serviceCenterId) {
    try {
      console.log('Fetching bookings for service center:', serviceCenterId);
      const bookings = await ServiceCenterBooking.find({ serviceCenterId })
        .populate('bookingId', 'name serviceType description status preferredDate')
        .populate('serviceCenterId', 'name location');
      console.log('Service center bookings retrieved:', bookings);
      return bookings;
    } catch (error) {
      console.error('Error fetching service center bookings:', error.message, error.stack);
      throw error;
    }
  }
}

export default new ServiceCenterService();