import React, { useState, useEffect } from "react";
import "../styles/dashboard.css";
import logo from "../assets/2.png";

import { Home, Upload, FileText, AlertTriangle, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 

const AdminDashboard = () => {
  const [activeMenuItem, setActiveMenuItem] = useState("Home");
  const [stats, setStats] = useState({
    providers: 0,
    contracts: 0,
    vehicles: 0,
    vehicleTypes: 0,
    outdatedContracts: 0,
    //sactiveContracts: 0,
  });

  const navigate = useNavigate();

  const menuItems = [
    { name: "Home", icon: Home },
    { name: "Upload Contract", icon: Upload },
    { name: "View Contracts", icon: FileText },
    { name: "Outdated Contracts", icon: AlertTriangle },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("No token found, redirecting to login...");
          navigate("/login");
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        const [providersRes, contractsRes, vehiclesRes, vehicleTypesRes] =
          await Promise.all([
            axios.get("http://localhost:8080/api/v1/dashboard/providers", { headers }),
            axios.get("http://localhost:8080/api/v1/dashboard/contracts", { headers }),
            axios.get("http://localhost:8080/api/v1/dashboard/vehicles", { headers }),
            axios.get("http://localhost:8080/api/v1/dashboard/vehicleTypes", { headers }),
          ]);

        setStats({
          providers: providersRes.data,
          contracts: contractsRes.data,
          vehicles: vehiclesRes.data,
          vehicleTypes: vehicleTypesRes.data,
          outdatedContracts: 0, //  fetch from backend
          //activeContracts: 0,   //''
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    fetchStats();
  }, [navigate]);

  const handleMenuClick = (menuName) => {
    setActiveMenuItem(menuName);
    switch (menuName) {
      case "Home":
        navigate("/admin-dashboard");
        break;
      case "Upload Contract":
        navigate("/upload-contracts");
        break;
      case "View Contracts":
        navigate("/view-contracts");
        break;
      case "Outdated Contracts":
        navigate("/outdated-contracts");
        break;
      default:
        navigate("/admin-dashboard");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken"); //
    console.log("Logging out...");
    navigate("/login");
  };

  const statsCards = [
    { title: "All Providers", value: stats.providers },
    { title: "All Contracts", value: stats.contracts },
    { title: "All Vehicles", value: stats.vehicles },
    { title: "Vehicle Types", value: stats.vehicleTypes },
    { title: "Outdated Contracts", value: stats.outdatedContracts },
    //{ title: "Active Contracts", value: stats.activeContracts },
  ];

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div>
          {/* Logo */}
          <div className="logo-container">
            <div className="logo-circle">
              <img src={logo} alt="Logo" className="logo-img" />
            </div>
          </div>

          {/* Title */}
          <h1 className="dashboard-title">Admin Dashboard</h1>

          {/* Menu */}
          <div className="menu-list">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenuItem === item.name;
              return (
                <button
                  key={item.name}
                  className={`menu-item ${isActive ? "active" : ""}`}
                  onClick={() => handleMenuClick(item.name)}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Logout */}
        <button className="logout-button" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Log-Out</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="stats-grid">
          {statsCards.map((card, index) => (
            <div key={index} className="card">
              <h3 className="card-title">{card.title}</h3>
              <div className="card-value">{card.value}</div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {/* <div className="footer-new">DriveEase@2025</div> */}
      </div>
    </div>
  );
};

export default AdminDashboard;
