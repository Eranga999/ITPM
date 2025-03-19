import mongoose from 'mongoose';

const serviceCenterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Service center name is required'],
    trim: true,
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^\d{10,15}$/, 'Please enter a valid phone number'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  },
  services: {
    type: [String], // Array of services (e.g., ['AC', 'Refrigerator'])
    required: [true, 'At least one service is required'],
    enum: ['AC', 'Refrigerator', 'TV', 'Washing Machine', 'Microwave'], // Match your screenshot
  },
}, { timestamps: true });

const ServiceCenter = mongoose.model('ServiceCenter', serviceCenterSchema);

export default ServiceCenter;