// controllers/instantFixController.js

// Submit Fix Request
export const submitFixRequest = (req, res) => {
    try {
      const { applianceType, issue } = req.body;
      const file = req.file;
  
      console.log('Appliance Type:', applianceType);
      console.log('Issue:', issue);
      console.log('Uploaded file:', file);
  
      res.status(200).json({ message: 'Fix request submitted successfully!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
  };
  
  // Get All Requests
  export const getAllRequests = (req, res) => {
    // Logic to fetch all requests (not implemented here)
    res.status(200).json({ message: 'All requests fetched successfully!' });
  };
  