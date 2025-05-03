import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  bookingId: { type: String, required: true },
  transportCost: { type: Number, required: true },
  sparePartsCost: { type: Number, required: true },
  technicianCost: { type: Number, required: true },
  totalCost: { type: Number, required: true },
  description: { type: String, default: 'None' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Payment', paymentSchema);