import express from 'express';
import authController from '../controllers/authController.js';
import Staff from '../models/Staff.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

console.log('Imported authController:', authController); // Add this log

router.get('/test', (req, res) => {
  res.json({ message: 'Auth routes are working!' });
});

router.post('/customer/register', authController.register);
router.post('/customer/login', authController.login);
router.post('/staff/login', authController.loginStaff);
router.post('/staff/add', async (req, res) => {
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