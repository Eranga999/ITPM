import authService from '../services/authService.js';

class AuthController {
  async register(req, res) {
    try {
      const { firstName, lastName, email, password, phone, address } = req.body;

      console.log('Customer registration request data:', req.body);

      const result = await authService.registerCustomer({
        firstName,
        lastName,
        email,
        password,
        phone,
        address,
      });

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Registration error:', error.message);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      console.log('Customer login request data:', req.body);

      const result = await authService.loginCustomer(email, password);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Customer login error:', error.message);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async loginStaff(req, res) {
    try {
      const { email, password, userType } = req.body;

      console.log('Staff login request data:', req.body);

      const result = await authService.loginStaff({ email, password, userType });

      console.log('Staff login successful, result:', result);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Staff login error:', error.message);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new AuthController();