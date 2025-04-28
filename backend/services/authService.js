import Customer from '../models/Customer.js';
import Staff from '../models/Staff.js';
import jwt from 'jsonwebtoken';

class AuthService {
  async registerCustomer(customerData) {
    const { firstName, lastName, email, password, phone, address } = customerData;

    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      throw new Error('Email already registered');
    }

    const customer = new Customer({
      firstName,
      lastName,
      email,
      password,
      phone,
      address,
    });

    await customer.save();

    const token = this.generateToken(customer._id, 'customer');
    return {
      user: {
        id: customer._id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        role: 'customer',
      },
      token,
    };
  }

  async loginCustomer(email, password) {
    const customer = await Customer.findOne({ email });
    if (!customer) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await customer.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(customer._id, 'customer');
    return {
      user: {
        id: customer._id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        role: 'customer',
      },
      token,
    };
  }

  async loginStaff(email, password, userType) {
    const staff = await Staff.findOne({ email, userType });
    if (!staff) {
      throw new Error('Invalid credentials or user type');
    }

    const isMatch = await staff.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(staff._id, staff.userType);
    return {
      user: {
        id: staff._id,
        email: staff.email,
        role: staff.userType,
      },
      token,
    };
  }

  generateToken(id, role) {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });
  }
}

export default new AuthService();