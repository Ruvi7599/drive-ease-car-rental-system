import React, { useState } from 'react';
import {
  Home,
  Upload,
  FileText,
  AlertTriangle,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Alert, Snackbar } from '@mui/material';
import axios from 'axios';
import logo from '../assets/2.png';
import '../styles/upload_contract.css';

const UploadContracts = () => {
  const [activeMenuItem, setActiveMenuItem] = useState('Upload Contract');
  const [formData, setFormData] = useState({
    providerName: '',
    vehicleType: '',
    basicDailyRate: '',
    availability: '',
    allowedMileage: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  const navigate = useNavigate();

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const menuItems = [
    { name: 'Home', icon: Home },
    { name: 'Upload Contract', icon: Upload },
    { name: 'View Contracts', icon: FileText },
    { name: 'Outdated Contracts', icon: AlertTriangle },
  ];

  const handleMenuClick = (menuName) => {
    setActiveMenuItem(menuName);
    const routes = {
      Home: '/admin-dashboard',
      'Upload Contract': '/upload-contracts',
      'View Contracts': '/view-contracts',
      'Outdated Contracts': '/outdated-contracts',
    };
    navigate(routes[menuName]);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const handleInputChange = (field, value) => {
    if (field === 'basicDailyRate') {
      const rate = parseFloat(value);
      setFormData((prev) => ({
        ...prev,
        [field]: isNaN(rate) ? '' : rate,
      }));
    } else if (field === 'allowedMileage') {
      const mileage = parseInt(value, 10);
      setFormData((prev) => ({
        ...prev,
        [field]: isNaN(mileage) ? '' : mileage,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleUpload = async () => {
    const token = localStorage.getItem('authToken');
    const adminId = 9;

    if (!token) {
      showSnackbar('Authentication token missing. Please log in again.', 'error');
      navigate('/login');
      return;
    }

    const { providerName, vehicleType, basicDailyRate, availability, allowedMileage } = formData;

    if (
      !providerName ||
      !vehicleType ||
      basicDailyRate === '' ||
      basicDailyRate <= 0 ||
      !availability ||
      allowedMileage === '' ||
      allowedMileage <= 0
    ) {
      showSnackbar('Please fill all fields correctly.', 'warning');
      return;
    }

    setIsLoading(true);

    try {
      await axios.post(
        `http://localhost:8080/api/v1/admins/contracts/save/${adminId}`,
        {
          providerName,
          vehicleType,
          basicDailyRate,
          availability,
          allowedMileage,
        },
        {
          headers: {
            Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      showSnackbar('Contract uploaded successfully.', 'success');

      setFormData({
        providerName: '',
        vehicleType: '',
        basicDailyRate: '',
        availability: '',
        allowedMileage: '',
      });
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to upload contract.';
      showSnackbar(`Error: ${msg}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="upload-contracts-container">
      <aside className="sidebar">
        <div>
          <div className="sidebar-logo-box">
            <div className="sidebar-logo-circle">
              <img src={logo} alt="Logo" className="logo-img" />
            </div>
          </div>
          <h1 className="sidebar-title">Admin Dashboard</h1>
          <nav className="sidebar-menu">
            {menuItems.map(({ name, icon: Icon }) => (
              <button
                key={name}
                className={`sidebar-menu-btn${activeMenuItem === name ? ' active' : ''}`}
                onClick={() => handleMenuClick(name)}
              >
                <Icon size={20} />
                <span>{name}</span>
              </button>
            ))}
          </nav>
        </div>
        <button className="sidebar-logout-btn" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Log-Out</span>
        </button>
      </aside>

      <main className="main-content">
        <h2 className="main-title">UPLOAD CONTRACTS</h2>

        {isLoading && <div className="loading-spinner"></div>}

        <form
          className="contract-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleUpload();
          }}
        >
          <div className="form-group">
            <label className="form-label">Provider Name</label>
            <input
              type="text"
              value={formData.providerName}
              onChange={(e) => handleInputChange('providerName', e.target.value)}
              className="form-input"
              placeholder="Enter provider name"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Vehicle Type</label>
            <div className="form-select-wrapper">
              <select
                value={formData.vehicleType}
                onChange={(e) => handleInputChange('vehicleType', e.target.value)}
                className="form-select"
                required
              >
                <option value="">Select vehicle type</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Hatchback">Hatchback</option>
              </select>
              <div className="form-select-icon">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Basic Daily Rate</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.basicDailyRate}
              onChange={(e) => handleInputChange('basicDailyRate', e.target.value)}
              className="form-input"
              placeholder="Enter basic daily rate"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Availability</label>
            <div className="form-select-wrapper">
              <select
                value={formData.availability}
                onChange={(e) => handleInputChange('availability', e.target.value)}
                className="form-select"
                required
              >
                <option value="">Select availability</option>
                <option value="Available">Available</option>
                <option value="Not_Available">Unavailable</option>
              </select>
              <div className="form-select-icon">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Allowed Mileage</label>
            <input
              type="number"
              min="1"
              value={formData.allowedMileage}
              onChange={(e) => handleInputChange('allowedMileage', e.target.value)}
              className="form-input"
              placeholder="Enter allowed mileage"
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="form-upload-btn" disabled={isLoading}>
              {isLoading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>

        {/* <footer className="main-footer">DriveEase©2025</footer> */}
      </main>

      {/* Snackbar for Alerts */}
      <Snackbar
  open={snackbar.open}
  autoHideDuration={5000}
  onClose={handleCloseSnackbar}
  anchorOrigin={{ vertical: 'top', horizontal: 'right' }} 
      >
  <Alert
    severity={snackbar.severity}
    onClose={handleCloseSnackbar}
    sx={{ width: '100%' }}
    variant="filled"
  >
    {snackbar.message}
  </Alert>
</Snackbar>

    </div>
  );
};

export default UploadContracts;
