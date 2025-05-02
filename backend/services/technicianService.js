import Technician from '../models/Technician.js';

class TechnicianService {
  async createTechnician(technicianData) {
    try {
      console.log('Creating technician:', technicianData);
      const technician = new Technician(technicianData);
      const savedTechnician = await technician.save();
      console.log('Technician saved:', savedTechnician);
      return savedTechnician;
    } catch (error) {
      console.error('Error creating technician:', error.message, error.stack);
      throw error;
    }
  }

  async getAllTechnicians() {
    try {
      console.log('Fetching all technicians');
      const technicians = await Technician.find();
      console.log('Technicians retrieved:', technicians);
      return technicians;
    } catch (error) {
      console.error('Error fetching technicians:', error.message, error.stack);
      throw error;
    }
  }
}

export default new TechnicianService();