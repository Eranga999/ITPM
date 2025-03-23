import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters'],
    match: [/^[a-zA-Z\s-]+$/, 'Name can only contain letters, spaces, and hyphens'],
  },
  email: {
    type: String,
    required: [true, 'Email address is required'],
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'],
    index: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^\+?\d{10,15}$/, 'Phone must be 10-15 digits and can only start with an optional "+" followed by numbers'],
    validate: {
      validator: function (value) {
        // Ensure only numbers and optional "+" at start, no other characters
        return /^\+?\d+$/.test(value);
      },
      message: 'Phone number must contain only digits and an optional "+" prefix (no letters or special characters)',
    },
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
    minlength: [10, 'Address must be at least 10 characters'],
    maxlength: [200, 'Address cannot exceed 200 characters'],
    validate: {
      validator: function (value) {
        // Basic check to prevent malicious input
        return !/[<>{}]/g.test(value);
      },
      message: 'Address cannot contain special characters like <, >, {, or }',
    },
  },
  serviceType: {
    type: String,
    required: [true, 'Service type is required'],
    enum: {
      values: [
        'refrigerator',
        'washing-machine',
        'dryer',
        'dishwasher',
        'oven',
        'microwave',
        'air-conditioner',
        'heater',
        'water-heater',
        'vacuum-cleaner',
      ],
      message: 'Invalid appliance type',
    },
  },
  preferredDate: {
    type: Date,
    required: [true, 'Preferred date is required'],
    validate: [
      {
        validator: function (value) {
          const today = new Date().setHours(0, 0, 0, 0);
          return value >= today;
        },
        message: 'Preferred date must be today or in the future',
      },
      {
        validator: function (value) {
          const maxDate = new Date();
          maxDate.setMonth(maxDate.getMonth() + 3);
          return value <= maxDate;
        },
        message: 'Preferred date cannot be more than 3 months in the future',
      },
  
    ],
  },
  preferredTime: {
    type: String,
    enum: {
      values: ['morning', 'afternoon', 'evening', ''],
      message: 'Invalid time slot (must be morning, afternoon, or evening)',
    },
    default: '',
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
    validate: {
      validator: function (value) {
        return !value || !/[<>{}]/g.test(value); // Prevent basic HTML/script injection
      },
      message: 'Description cannot contain special characters like <, >, {, or }',
    },
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'confirmed', 'completed', 'cancelled'],
      message: 'Invalid status (must be pending, confirmed, completed, or cancelled)',
    },
    default: 'pending',
    index: true,
  },
  technicianAssigned: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    validate: {
      validator: async function (value) {
        if (!value) return true; // Allow null
        const User = mongoose.model('User');
        const user = await User.findById(value);
        return user && user.role === 'technician'; // Ensure it's a technician
      },
      message: 'Assigned technician must be a valid user with technician role',
    },
  },
  bookingReference: {
    type: String,
    unique: true,
    default: function () {
      return `BR${Date.now().toString(36)}${Math.random().toString(36).substr(2, 5)}`.toUpperCase();
    },
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes for better query performance
bookingSchema.index({ email: 1, preferredDate: 1 }, { 
  unique: true,
  partialFilterExpression: { status: { $ne: 'cancelled' } } // Allow cancelled bookings to be reused
});
bookingSchema.index({ status: 1, preferredDate: 1 });
bookingSchema.index({ technicianAssigned: 1 }, { sparse: true });

// Virtual to check if booking is within business hours (8 AM - 6 PM)
bookingSchema.virtual('isDuringBusinessHours').get(function () {
  const date = this.preferredDate;
  const day = date.getDay();
  return day !== 0 && day !== 6; // Exclude weekends
});

// Pre-save hook to normalize phone number
bookingSchema.pre('save', function (next) {
  if (this.phone && !this.phone.startsWith('+')) {
    this.phone = `+${this.phone.replace(/\D/g, '')}`; // Ensure + prefix and remove non-digits
  }
  next();
});

// Static method to check availability
bookingSchema.statics.checkAvailability = async function (date, time) {
  const startOfDay = new Date(date).setHours(0, 0, 0, 0);
  const endOfDay = new Date(date).setHours(23, 59, 59, 999);
  
  const bookings = await this.countDocuments({
    preferredDate: { $gte: startOfDay, $lte: endOfDay },
    preferredTime: time || { $ne: null },
    status: { $in: ['pending', 'confirmed'] },
  });
  
  return bookings < 10; // Example: max 10 bookings per time slot
};

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;