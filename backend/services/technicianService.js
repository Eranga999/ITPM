import Technician from '../models/Technician.js';
import ServiceCenterBooking from '../models/ServiceCenterBooking.js';
import Booking from '../models/Booking.js';
import mongoose from 'mongoose';

class TechnicianService {
  async createTechnician(technicianData) {
    try {
      const technician = new Technician(technicianData);
      const savedTechnician = await technician.save();
      return savedTechnician;
    } catch (error) {
      throw error;
    }
  }

  async getAllTechnicians() {
    try {
      const technicians = await Technician.find();
      return technicians;
    } catch (error) {
      throw error;
    }
  }
  
  async getAssignedBookings(technicianId) {
    try {
      // Validate ID
      if (!mongoose.Types.ObjectId.isValid(technicianId)) {
        throw new Error('Invalid technician ID');
      }
      
      // Check if technician exists
      const technician = await Technician.findById(technicianId);
      if (!technician) {
        return []; // Return empty array if technician not found
      }
      
      // Find all bookings assigned to this technician
      const bookings = await Booking.find({
        technicianAssigned: technicianId,
        status: { $in: ['confirmed', 'in-progress'] }
      });
      
      return bookings;
    } catch (error) {
      throw error;
    }
  }
  
  async updateBookingStatus(bookingId, technicianId, status) {
    try {
      // Validate IDs
      if (!mongoose.Types.ObjectId.isValid(bookingId) || !mongoose.Types.ObjectId.isValid(technicianId)) {
        throw new Error('Invalid booking ID or technician ID');
      }
      
      // Update the booking status
      const updatedBooking = await Booking.findOneAndUpdate(
        { _id: bookingId, technicianAssigned: technicianId },
        { status },
        { new: true }
      );
      
      if (!updatedBooking) {
        throw new Error('Booking not found or not assigned to this technician');
      }
      
      return updatedBooking;
    } catch (error) {
      throw error;
    }
  }
  
  async assignTechnicianToBooking(bookingId, technicianId) {
    try {
      // Validate IDs
      if (!mongoose.Types.ObjectId.isValid(bookingId) || !mongoose.Types.ObjectId.isValid(technicianId)) {
        throw new Error('Invalid booking ID or technician ID');
      }
      
      // Check if technician exists
      const technician = await Technician.findById(technicianId);
      if (!technician) {
        throw new Error('Technician not found');
      }
      
      // Get the booking entry to find the original booking ID
      const serviceCenterBooking = await ServiceCenterBooking.findById(bookingId);
      if (!serviceCenterBooking) {
        throw new Error('Service center booking not found');
      }
      
      // Check if original booking exists
      const originalBooking = await Booking.findById(serviceCenterBooking.bookingId);
      if (!originalBooking) {
        throw new Error('Original booking not found');
      }
      
      // Update the original booking with technician information
      const updatedBooking = await Booking.findByIdAndUpdate(
        serviceCenterBooking.bookingId,
        { 
          technicianAssigned: technicianId, 
          status: 'confirmed' 
        },
        { 
          new: true,
          runValidators: true 
        }
      );
      
      if (!updatedBooking) {
        throw new Error('Failed to update original booking');
      }
      
      // Update the service center booking status
      const updatedServiceCenterBooking = await ServiceCenterBooking.findByIdAndUpdate(
        bookingId,
        { status: 'in-progress' },
        { 
          new: true,
          runValidators: true 
        }
      );
      
      if (!updatedServiceCenterBooking) {
        throw new Error('Failed to update service center booking');
      }
      
      // Get the complete updated booking with populated technician
      const completeBooking = await Booking.findById(serviceCenterBooking.bookingId)
        .populate('technicianAssigned');
      
      return {
        booking: completeBooking,
        serviceCenterBooking: updatedServiceCenterBooking
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new TechnicianService();