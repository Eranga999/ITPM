const mongoose = require('mongoose');

const instantFixSchema = new mongoose.Schema({
  applianceType: String,
  issue: String,
  fileUrl: String,
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('InstantFix', instantFixSchema);
