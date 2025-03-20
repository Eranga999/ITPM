// models/ServiceCenterBooking.js
import mongoose from 'mongoose';

const serviceCenterBookingSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: [true, 'Booking ID is required'],
  },
  serviceCenterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceCenter',
    required: [true, 'Service Center ID is required'],
  },
  assignedDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['assigned', 'in-progress', 'completed'],
    default: 'assigned',
  },
}, { timestamps: true });

const ServiceCenterBooking = mongoose.model('ServiceCenterBooking', serviceCenterBookingSchema);

export default ServiceCenterBooking;