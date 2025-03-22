import mongoose from 'mongoose';

// Define the schema for technicians
const technicianSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^\d{10,15}$/, 'Please enter a valid phone number'],
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
  },
}, { timestamps: true });

// Create the model
const Technician = mongoose.model('Technician', technicianSchema);

export default Technician;