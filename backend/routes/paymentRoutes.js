import express from 'express';
import Payment from '../models/Payment.js';

const router = express.Router();

// Get all payment summaries
router.get('/', async (req, res) => {
  try {
    const payments = await Payment.find();
    res.json({ success: true, data: payments });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch payment summaries' });
  }
});

// Create a new payment summary
router.post('/', async (req, res) => {
  try {
    const { bookingId, transportCost, sparePartsCost, technicianCost, totalCost, description } = req.body;
    const payment = new Payment({
      bookingId,
      transportCost,
      sparePartsCost,
      technicianCost,
      totalCost,
      description,
    });
    await payment.save();
    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ success: false, message: 'Failed to create payment summary' });
  }
});

export default router;