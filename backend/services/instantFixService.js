const InstantFix = require('../models/InstantFix');

exports.createFixRequest = async (data) => {
  const newRequest = new InstantFix(data);
  return await newRequest.save();
};

exports.fetchAllRequests = async () => {
  return await InstantFix.find().sort({ createdAt: -1 });
};
