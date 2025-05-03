import Staff from '../models/Staff.js';
import jwt from 'jsonwebtoken';

class StaffService {
  async signup(staffData) {
    try {
      const { email, password, userType } = staffData;
      
      // Check if email already exists
      const existingStaff = await Staff.findOne({ email });
      if (existingStaff) {
        throw new Error('Email already in use');
      }

      // Create new staff with plain text password
      const staff = new Staff({
        email,
        password, // Store password as plain text
        userType
      });

      const savedStaff = await staff.save();
      
      // Generate JWT token
      const token = jwt.sign(
        { id: savedStaff._id, userType: savedStaff.userType },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      return { staff: savedStaff, token };
    } catch (error) {
      console.error('Error in staff signup:', error.message);
      throw error;
    }
  }

  async login(credentials) {
    try {
      const { email, password } = credentials;
      console.log('Login attempt for email:', email);
      
      // Find staff by email
      const staff = await Staff.findOne({ email });
      if (!staff) {
        console.log('Staff not found for email:', email);
        throw new Error('Invalid email or password');
      }

      // Compare plain text password
      console.log('Stored password:', staff.password);
      console.log('Provided password:', password);
      const isMatch = staff.password === password;
      console.log('Password match:', isMatch);
      if (!isMatch) {
        throw new Error('Invalid email or password');
      }

      // Generate JWT token
      console.log('JWT_SECRET:', process.env.JWT_SECRET);
      const token = jwt.sign(
        { id: staff._id, userType: staff.userType },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      return { staff, token };
    } catch (error) {
      console.error('Error in staff login:', error.message);
      throw error;
    }
  }
}

export default new StaffService();