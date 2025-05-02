import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bookingRoutes from './routes/bookingRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import technicianRoutes from './routes/technicianRoutes.js'; // New import
import serviceCenterRoutes from './routes/serviceCenterRoutes.js'
import jobRoutes from './routes/jobRoutes.js';
import transportRoutes from './routes/transportRoutes.js'; // New import
import authRoutes from './routes/authRoutes.js';
import instantFixRoutes from './routes/instantFixRoutes.js'; 
dotenv.config();

const app = express();

app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
});

app.use(cors({ origin: '*' }));
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch((err) => {
    console.error('MongoDB Connection Failed:', err.message);
    process.exit(1);
  });
app.use('/api/auth', authRoutes);
app.use('/api', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', technicianRoutes);
app.use('/api/admin', serviceCenterRoutes); // Mount technician routes under /api/admin
app.use('/api/technician', jobRoutes);
app.use('/api/transport', transportRoutes);
app.use('/api', serviceCenterRoutes);
app.use('/api/instant-fix', instantFixRoutes);
app.get('/', (req, res) => {
  res.send('Easy Fix Backend Running!');
});

app.use((err, req, res, next) => {
  console.error('Global error handler:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));