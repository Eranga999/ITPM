import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
  },
  appliance: {
    type: String,
    required: [true, 'Appliance type is required'],
    trim: true,
  },
  issue: {
    type: String,
    required: [true, 'Issue description is required'],
    trim: true,
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
  },
  urgency: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Pending',
  },
  technician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Technician',
    required: [true, 'Technician is required'],
  },
}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);

export default Job;