import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bookingRoutes from "./routes/bookingRoutes.js"; // Customer booking routes (unchanged)
import adminRoutes from "./routes/adminRoutes.js";    // Admin repair request routes

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173", // Matches Vite frontend
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
}));
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("MongoDB Connection Failed:", err.message);
    process.exit(1);
  });

// Routes
app.use("/api", bookingRoutes);         // Customer booking endpoints (e.g., /api/bookings)
app.use("/admin/api", adminRoutes);     // Admin repair request endpoints (e.g., /admin/api/repair-requests)

// Root route
app.get("/", (req, res) => {
  res.send("Easy Fix Backend Running!");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));