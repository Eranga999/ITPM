// services/serviceCenterService.js
import ServiceCenter from '../models/ServiceCenter.js';
import ServiceCenterBooking from '../models/ServiceCenterBooking.js';
import Job from '../models/Job.js';

class ServiceCenterService {
  // ... existing methods ...

  async assignBookingToTechnician(bookingId, technicianId) {
    try {
      console.log('Assigning booking:', bookingId, 'to technician:', technicianId);
      // Update the ServiceCenterBooking with technicianId
      const booking = await ServiceCenterBooking.findById(bookingId)
        .populate('bookingId')
        .populate('serviceCenterId');
      if (!booking) throw new Error('Booking not found');

      booking.technicianId = technicianId;
      await booking.save();

      // Create a new Job for the technician
      const jobData = {
        customerName: booking.bookingId.name,
        appliance: booking.bookingId.serviceType,
        issue: booking.bookingId.description,
        address: booking.serviceCenterId.address, // Use service center address or booking address
        urgency: 'Medium', // Default or derive from booking
        date: new Date(),
        status: 'Pending',
        technician: technicianId,
      };

      const job = new Job(jobData);
      const savedJob = await job.save();
      console.log('Job created for technician:', savedJob);

      return { booking, job };
    } catch (error) {
      console.error('Error assigning booking to technician:', error.message, error.stack);
      throw error;
    }
  }
}

export default new ServiceCenterService();