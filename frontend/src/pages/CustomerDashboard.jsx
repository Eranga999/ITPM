import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
const CustomerDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  // Fetch all bookings data
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/bookings');
        console.log('Bookings fetched:', response.data); // Log fetched bookings
        setBookings(response.data.data); // Assuming response.data.data contains the bookings
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  // Handle booking cancellation
  const cancelBooking = async (id) => {
    try {
      console.log("Cancel booking triggered for id:", id); // Debugging log
      const confirmation = window.confirm("Are you sure you want to cancel this booking?");
      if (confirmation) {
        const response = await axios.delete(`http://localhost:5000/api/bookings/${id}`);
        console.log('Cancel booking response:', response); // Debugging log
        if (response.status === 200) {
          // Remove canceled booking from the state
          setBookings((prevBookings) => prevBookings.filter((booking) => booking._id !== id));
          alert("Booking canceled successfully!");
        } else {
          alert("Failed to cancel the booking.");
        }
      }
    } catch (error) {
      console.error('Error canceling booking:', error);
      alert("Error canceling the booking.");
    }
  };

  return (
    <header className="bg-white shadow-md py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="flex items-center space-x-2">
          <img src={logo}  alt="EasyFix Logo" className="h-8" />
          <span className="text-xl font-bold text-gray-800">EasyFix</span>
        </div>
        <nav className="space-x-6">
          <a href="#" className="text-gray-600 hover:text-blue-600">Home</a>
          <a href="#" className="text-gray-600 hover:text-blue-600">Track</a>
          <a href="#" className="text-gray-600 hover:text-blue-600">Support</a>
       
        </nav>
      </div>
    </header>
    
  );
};

export default CustomerDashboard;
