import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/view_contract.css';
import logo from '../assets/2.png';
import { useNavigate } from 'react-router-dom';
import { Home, Upload, FileText, AlertTriangle, LogOut } from 'lucide-react';
import {
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

const ViewContracts = () => {
  const [activeMenuItem, setActiveMenuItem] = useState('View Contracts');
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [contractToDelete, setContractToDelete] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/admins/contracts/all', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        if (response.data) {
          setContracts(response.data);
        }
      } catch (error) {
        console.error('Error fetching contracts:', error);
        setError('Failed to load contracts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, []);

  const menuItems = [
    { name: 'Home', icon: Home },
    { name: 'Upload Contract', icon: Upload },
    { name: 'View Contracts', icon: FileText },
    { name: 'Outdated Contracts', icon: AlertTriangle },
  ];

  const handleMenuClick = (menuName) => {
    setActiveMenuItem(menuName);
    switch (menuName) {
      case 'Home':
        navigate('/admin-dashboard');
        break;
      case 'Upload Contract':
        navigate('/upload-contracts');
        break;
      case 'View Contracts':
        navigate('/view-contracts');
        break;
      case 'Outdated Contracts':
        navigate('/outdated-contracts');
        break;
      default:
        break;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const handleDeleteClick = (contractId) => {
    setContractToDelete(contractId);
    setOpenConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/admins/contracts/${contractToDelete}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      setContracts((prev) =>
        prev.filter((contract) => contract.contractId !== contractToDelete)
      );
      setSnackbar({
        open: true,
        message: 'Contract deleted successfully',
        severity: 'success',
      });
    } catch (err) {
      console.error('Error deleting contract:', err);
      setSnackbar({
        open: true,
        message: 'Failed to delete the contract',
        severity: 'error',
      });
    } finally {
      setOpenConfirmDialog(false);
      setContractToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setOpenConfirmDialog(false);
    setContractToDelete(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <div className="view-contracts-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div>
          <div className="logo-container">
            <div className="logo-circle">
              <img src={logo} alt="Logo" className="logo-img" />
            </div>
          </div>
          <h1 className="sidebar-title">Admin Dashboard</h1>
          <div className="sidebar-nav">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenuItem === item.name;
              return (
                <button
                  key={item.name}
                  className={`nav-btn ${isActive ? 'active' : ''}`}
                  onClick={() => handleMenuClick(item.name)}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Log-Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="contracts-table-container">
          <h2 className="table-title">VIEW CONTRACTS</h2>
          {error && <p className="error-message">{error}</p>}
          {loading ? (
            <p>Loading contracts...</p>
          ) : (
            <div className="table-wrapper">
              <table className="contracts-table">
                <thead>
                  <tr>
                    <th>Contract ID</th>
                    <th>Admin ID</th>
                    <th>Provider</th>
                    <th>Vehicle Type</th>
                    <th>Daily Rate</th>
                    <th>Status</th>
                    <th>Allowed Mileage</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {contracts.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center' }}>
                        No contracts found.
                      </td>
                    </tr>
                  ) : (
                    contracts.map((contract) => (
                      <tr key={contract.contractId}>
                        <td>{contract.contractId}</td>
                        <td>{contract.adminId}</td>
                        <td>{contract.providerName}</td>
                        <td>{contract.vehicleType}</td>
                        <td>
                          Rs.
                          {typeof contract.basicDailyRate === 'number'
                            ? contract.basicDailyRate.toFixed(2)
                            : 'N/A'}
                        </td>
                        <td>
                          <span
                            className={`status ${
                              contract.availability === 'Available'
                                ? 'available'
                                : 'unavailable'
                            }`}
                          >
                            {contract.availability}
                          </span>
                        </td>
                        <td>{contract.allowedMileage} km</td>
                        <td>
                          <button
                            className="delete-btn"
                            onClick={() => handleDeleteClick(contract.contractId)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {/* <div className="main-footer">DriveEase@2025</div> */}
      </div>

      {/* ✅ Snackbar Alert */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* ✅ MUI Confirmation Dialog */}
      <Dialog
        open={openConfirmDialog}
        onClose={handleCancelDelete}
        aria-labelledby="confirm-delete-dialog"
      >
        <DialogTitle id="confirm-delete-dialog">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this contract?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ViewContracts;
