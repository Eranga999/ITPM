import express from "express";
import {
  getAllRepairRequests,
  updateRepairRequestStatus,
  deleteRepairRequest,
  addTestBooking,
} from "../controllers/adminController.js";

const router = express.Router();

// Get all repair requests
router.get("/repair-requests", getAllRepairRequests);

// Update repair request status
router.patch("/repair-requests/:id", updateRepairRequestStatus);

// Delete a repair request
router.delete("/repair-requests/:id", deleteRepairRequest);

// Temporary route to add a test booking
router.post("/add-booking", addTestBooking);

export default router;