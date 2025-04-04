import express from 'express';
import authController from '../controllers/authController.js';
import Staff from '../models/Staff.js';
import Customer from '../models/Customer.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: error.message === 'jwt expired' ? 'Token expired. Please log in again.' : 'Invalid token.',
    });
  }
};

// Customer routes
router.post('/customer/register', authController.register);
router.post('/customer/login', authController.login);

router.get('/customer/profile', authenticateToken, async (req, res) => {
  console.log('GET /customer/profile called');
  try {
    const customer = await Customer.findById(req.user.id).select('-password');
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        firstName: customer.firstName,
        lastName: customer.lastName || '',
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
      },
    });
  } catch (error) {
    console.error('Error fetching profile:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
    });
  }
});

router.put('/customer/profile', authenticateToken, async (req, res) => {
  console.log('PUT /customer/profile called');
  try {
    const { firstName, lastName, email, phone, address } = req.body;

    const updatedData = {
      firstName,
      lastName,
      email,
      phone,
      address,
    };

    const customer = await Customer.findByIdAndUpdate(
      req.user.id,
      updatedData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        firstName: customer.firstName,
        lastName: customer.lastName || '',
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
      },
    });
  } catch (error) {
    console.error('Error updating profile:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
    });
  }
});

router.put('/customer/password', authenticateToken, async (req, res) => {
  console.log('PUT /customer/password called');
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Old and new passwords are required',
      });
    }

    const customer = await Customer.findById(req.user.id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, customer.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Old password is incorrect',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await Customer.updateOne(
      { _id: req.user.id },
      { $set: { password: hashedPassword } }
    );

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    console.error('Error updating password:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update password',
    });
  }
});
router.delete('/customer/profile', authenticateToken, async (req, res) => {
  console.log('DELETE /customer/profile called');
  console.log('Token:', req.headers['authorization']);
  console.log('User ID:', req.user?.id);
  try {
    const customer = await Customer.findByIdAndDelete(req.user.id);
    if (!customer) {
      console.log('Customer not found for ID:', req.user.id);
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }

    console.log('Customer deleted:', customer);
    res.status(200).json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting account:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete account',
    });
  }
});

// Staff routes
router.post('/staff/login', authController.loginStaff);
router.post('/staff/add', async (req, res) => {
  console.log('POST /staff/add called');
  try {
    const { email, password, userType } = req.body;

    const validUserTypes = ['admin', 'technician', 'serviceCenter'];
    if (!validUserTypes.includes(userType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid userType. Must be admin, technician, or serviceCenter',
      });
    }

    const existingStaff = await Staff.findOne({ email });
    if (existingStaff) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const staff = new Staff({
      email,
      password: hashedPassword,
      userType,
    });

    await staff.save();

    res.status(201).json({
      success: true,
      message: `${userType} user added successfully`,
      data: {
        email,
        userType,
      },
    });
  } catch (error) {
    console.error('Error adding staff:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to add staff user',
    });
  }
});

export default router;