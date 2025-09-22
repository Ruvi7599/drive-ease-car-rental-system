import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/VehicleBooking.css';

const VehicleBooking = () => {
  const location = useLocation();

  // States
  const [vehicleType, setVehicleType] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rentalDays, setRentalDays] = useState(1);
  const [numVehicles, setNumVehicles] = useState(1);
  const [darkMode, setDarkMode] = useState(() => {
    // Initialize from localStorage or default to false
    return localStorage.getItem('darkMode') === 'true' || false;
  });

  // Alert states
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertStatus, setAlertStatus] = useState('processing'); // 'processing' | 'success'

  // Get query parameters from Home.jsx booking form
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setVehicleType(params.get('vehicleType') || '');
    setRentalDays(Number(params.get('rentalDays') || 1));
    setNumVehicles(Number(params.get('numVehicles') || 1));
  }, [location]);

  // Save dark mode preference to localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    // Add smooth transition class to body for theme switching
    document.body.style.transition = 'background-color 0.4s ease, color 0.4s ease';
  }, [darkMode]);

  // Fetch vehicles from backend API
  useEffect(() => {
    if (!vehicleType) return;

    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/admins/contracts/available-public/${vehicleType}`
        );
        setVehicles(response.data);
      } catch (error) {
        console.error('Error fetching vehicle contracts:', error);
        setVehicles([]);
        // Show error alert
        setAlertStatus('error');
        setAlertMessage('Failed to load vehicles. Please try again.');
        setAlertVisible(true);
        setTimeout(() => setAlertVisible(false), 3000);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [vehicleType]);

  // Calculate total price
  const calculatePrice = (vehicle) => {
    const markup = 0.10;
    const baseRate = vehicle.basicDailyRate || 0;
    return baseRate * (1 + markup) * rentalDays * numVehicles;
  };

  // Handle Booking with enhanced UX
  const handleBookNow = (vehicle) => {
    setAlertStatus('processing');
    setAlertMessage('Processing your booking request...');
    setAlertVisible(true);

    // Simulate API call with realistic timing
    setTimeout(() => {
      setAlertStatus('success');
      setAlertMessage(`Booking confirmed for ${vehicle.vehicleType}! Check your email for details.`);
      setTimeout(() => setAlertVisible(false), 3500);
    }, 2500);
  };

  // Toggle dark mode with animation
  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  // Loading component
  const LoadingSpinner = () => (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p className="loading-text">Loading available vehicles...</p>
    </div>
  );

  return (
    <div className={`booking-container ${darkMode ? 'dark' : ''}`}>
      {/* Modern Dark Mode Toggle - Fixed Position */}
      <button
        className="theme-toggle"
        onClick={toggleDarkMode}
        title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        {darkMode ? '☀️' : '🌙'}
      </button>

      <div className="booking-form">
        <h2 className="form-title">
          {vehicleType ? `Available ${vehicleType.toUpperCase()}` : 'Available Vehicles'}
        </h2>

        {/* Enhanced Booking Info Display */}
        {vehicleType && (
          <div className="booking-summary">
            <div className="summary-item">
              <span className="summary-label">Rental Period:</span>
              <span className="summary-value">{rentalDays} day{rentalDays > 1 ? 's' : ''}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Number of Vehicles:</span>
              <span className="summary-value">{numVehicles}</span>
            </div>
          </div>
        )}

        {loading ? (
          <LoadingSpinner />
        ) : vehicles.length > 0 ? (
          <div className="vehicles-grid">
            {vehicles.map((vehicle) => {
              const customerDailyRate = (vehicle.basicDailyRate || 0) * 1.1;
              const totalPrice = calculatePrice(vehicle);

              return (
                <div key={vehicle.contractId} className="vehicle-card">
                  <div className="vehicle-header">
                    <h3 className="vehicle-title">{vehicle.vehicleType}</h3>
                    <span className={`availability-badge ${vehicle.availability === 'Available' ? 'available' : 'unavailable'}`}>
                      {vehicle.availability}
                    </span>
                  </div>
                  
                  <div className="vehicle-info">
                    <div className="info-row">
                      <span className="label">Provider</span>
                      <span className="value">{vehicle.providerName}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Base Daily Rate</span>
                      <span className="value">Rs {vehicle.basicDailyRate?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="info-row highlight">
                      <span className="label">Your Rate (+10%)</span>
                      <span className="value">Rs {customerDailyRate.toFixed(2)}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Allowed Mileage</span>
                      <span className="value">{vehicle.allowedMileage || 'N/A'} km</span>
                    </div>
                    <div className="info-row total-price">
                      <span className="label">
                        Total Cost ({rentalDays} day{rentalDays > 1 ? 's' : ''} × {numVehicles} vehicle{numVehicles > 1 ? 's' : ''})
                      </span>
                      <span className="value price">Rs {totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <button
                    className={`book-btn ${vehicle.availability !== 'Available' ? 'disabled' : ''}`}
                    onClick={() => handleBookNow(vehicle)}
                    disabled={vehicle.availability !== 'Available'}
                  >
                    {vehicle.availability === 'Available' ? 'Book Now' : 'Not Available'}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="no-vehicles">
            <div className="no-vehicles-icon">🚗</div>
            <h3>No Vehicles Available</h3>
            <p>Sorry, no {vehicleType || ''} vehicles are available at the moment.</p>
            <p>Please try a different vehicle type or check back later.</p>
          </div>
        )}
      </div>

      {/* Enhanced Alert System */}
      {alertVisible && (
        <div className={`custom-alert ${alertStatus}`}>
          {alertStatus === 'processing' && <div className="spinner" />}
          {alertStatus === 'success' && <span className="alert-icon">✅</span>}
          {alertStatus === 'error' && <span className="alert-icon">❌</span>}
          <span className="alert-text">{alertMessage}</span>
        </div>
      )}

      {/* Footer */}
      <div className="footer">
        <p>© 2025 DriveEase - Your Premium Vehicle Rental Service</p>
      </div>
    </div>
  );
};

export default VehicleBooking;