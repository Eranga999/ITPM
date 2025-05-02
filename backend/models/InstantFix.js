import mongoose from 'mongoose';

const instantFixSchema = new mongoose.Schema({
  applianceType: String,
  issue: String,
  fileUrl: String,
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

// Create and export the model using the schema
const InstantFix = mongoose.model('InstantFix', instantFixSchema);

export default InstantFix;
