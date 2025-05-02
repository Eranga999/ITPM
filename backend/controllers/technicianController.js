import technicianService from '../services/technicianService.js';

class TechnicianController {
  async createTechnician(req, res) {
    try {
      console.log('POST /api/admin/technicians called');
      const technicianData = req.body;
      const newTechnician = await technicianService.createTechnician(technicianData);
      res.status(201).json({ success: true, data: newTechnician, message: 'Technician added successfully' });
    } catch (error) {
      console.error('Controller error creating technician:', error.message, error.stack);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getAllTechnicians(req, res) {
    try {
      console.log('GET /api/admin/technicians called');
      const technicians = await technicianService.getAllTechnicians();
      res.status(200).json({ success: true, data: technicians });
    } catch (error) {
      console.error('Controller error fetching technicians:', error.message, error.stack);
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export default new TechnicianController();