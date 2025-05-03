import staffService from '../services/staffService.js';

class StaffController {
  async signup(req, res) {
    try {
      const { email, password, userType } = req.body;
      
      if (!email || !password || !userType) {
        return res.status(400).json({
          success: false,
          message: 'Email, password, and user type are required'
        });
      }

      const { staff, token } = await staffService.signup({
        email,
        password,
        userType
      });

      res.status(201).json({
        success: true,
        data: {
          staff: {
            id: staff._id,
            email: staff.email,
            userType: staff.userType
          },
          token
        },
        message: 'Staff registered successfully'
      });
    } catch (error) {
      console.error('Error in staff signup:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      const { staff, token } = await staffService.login({
        email,
        password
      });

      res.status(200).json({
        success: true,
        data: {
          staff: {
            id: staff._id,
            email: staff.email,
            userType: staff.userType
          },
          token
        },
        message: 'Login successful'
      });
    } catch (error) {
      console.error('Error in staff login:', error);
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }
}

export default new StaffController();