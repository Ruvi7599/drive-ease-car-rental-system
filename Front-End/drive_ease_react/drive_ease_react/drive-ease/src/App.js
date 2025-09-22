import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginUI from './admin/loginUI';
import AdminDashboard from './admin/dashboard';
import UploadContracts from './admin/upload_contract';
import ViewContracts from './admin/view_contract';
import OutdatedContracts from './admin/outdated_contracts';
import Home from './client_side/home';
import VehicleBooking from './client_side/vehicleBooking';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vehicle-booking" element={<VehicleBooking />} />
        <Route path="/login" element={<LoginUI />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/upload-contracts" element={<UploadContracts />} />
        <Route path="/view-contracts" element={<ViewContracts />} />
        <Route path="/outdated-contracts" element={<OutdatedContracts />} />
      </Routes>
    </Router>   
  );
}

export default App;
