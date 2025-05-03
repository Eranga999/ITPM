import mongoose from 'mongoose';

const technicianSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
}, { timestamps: true });

const Technician = mongoose.model('Technician', technicianSchema);

export default Technician;
