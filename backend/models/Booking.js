import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email address is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^\d{10,15}$/, 'Please enter a valid phone number']
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  serviceType: {
    type: String,
    required: [true, 'Service type is required'],
    enum: [
      'refrigerator',
      'washing-machine',
      'dryer',
      'dishwasher',
      'oven',
      'microwave',
      'air-conditioner',
      'heater',
      'water-heater',
      'vacuum-cleaner'
    ]
  },
  preferredDate: {
    type: Date,
    required: [true, 'Preferred date is required'],
    validate: {
      validator: function (value) {
        return value >= new Date().setHours(0, 0, 0, 0);
      },
      message: 'Preferred date must be today or a future date'
    }
  },
  preferredTime: {
    type: String,
    enum: ['morning', 'afternoon', 'evening'],
    default: null // Set default to null
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  technicianAssigned: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, { timestamps: true });

bookingSchema.index({ email: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ preferredDate: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
