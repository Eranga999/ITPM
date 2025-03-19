import mongoose from 'mongoose';

const transportRequestSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  technician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Technician',
    required: true,
  },
  serviceCenter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceCenter',
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'In Transit', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  requestDate: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
    trim: true,
  },
}, { timestamps: true });

export default mongoose.model('TransportRequest', transportRequestSchema);