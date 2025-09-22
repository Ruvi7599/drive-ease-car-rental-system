import React, { useState, useEffect } from 'react';
import { User, Lock, LogIn, Sun, Moon } from 'lucide-react';
import axios from 'axios';
import '../styles/loginUI.css';
import logo from '../assets/2.png';
import { Alert, Snackbar } from '@mui/material';

const LoginUI = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Dark mode state
  const [darkMode, setDarkMode] = useState(false);

  // Load saved preference
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedMode);
  }, []);

  // Save preference
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleLogin = async () => {
    if (!username || !password) {
      showSnackbar('Both username and password are required!', 'warning');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/v1/auth/login', {
        userName: username,
        password: password
      });

      const { token } = response.data;
      localStorage.setItem('authToken', token);

      showSnackbar('Login successful!', 'success');

      setTimeout(() => {
        window.location.href = '/admin-dashboard';
      }, 1500);

    } catch (err) {
      console.error('Login error:', err);
      showSnackbar('Invalid username or password!', 'error');
    }
  };

  return (
    <div className={`login-container ${darkMode ? 'dark-mode' : ''}`}>
      
      
      <button
        className="dark-mode-toggle"
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      {/* Login Card */}
      <div className="login-card">
        {/* Logo */}
        <div className="logo-box">
          <img src={logo} alt="Logo" className="logo-img" />
        </div>

        {/* Username Input */}
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Enter admin username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-box"
          />
          <User className="input-icon" />
        </div>

        {/* Password Input */}
        <div className="input-wrapper">
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-box"
          />
          <Lock className="input-icon" />
        </div>

        {/* Login Button */}
        <button onClick={handleLogin} className="login-button">
          <span>Login</span>
          <LogIn className="w-5 h-5" />
        </button>
      </div>

      {/* Snackbar Alert */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default LoginUI;
