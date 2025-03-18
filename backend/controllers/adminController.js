import Booking from "../models/Booking.js";

// Get all repair requests (admin view)
export const getAllRepairRequests = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("technicianAssigned", "name");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update repair request status (e.g., send to center or cancel)
export const updateRepairRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
    if (!booking) return res.status(404).json({ message: "Repair request not found" });
    res.status(200).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a repair request (cancel)
export const deleteRepairRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) return res.status(404).json({ message: "Repair request not found" });
    res.status(200).json({ message: "Repair request cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Temporary function to add a test booking
export const addTestBooking = async (req, res) => {
  try {
    const testBooking = new Booking({
      name: "Test User",
      email: "test@example.com",
      phone: "1234567890",
      address: "Test Address",
      serviceType: "refrigerator",
      preferredDate: new Date(),
      description: "Test issue",
      status: "pending",
    });
    const savedBooking = await testBooking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};