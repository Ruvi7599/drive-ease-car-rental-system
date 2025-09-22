import React, { useState } from "react";
import "../styles/home.css";
import { FaSearch, FaCalendarAlt, FaChevronDown, FaMoon, FaSun } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; 
import CarImage from "../assets/Car.png";
import whatsapp from "../assets/wp.png";
import gmail from "../assets/gmail_.png";
import map from "../assets/map.png";
import logo from "../assets/2.png";

function Home() {
  const navigate = useNavigate();
  const [pickupDate, setPickupDate] = useState("");
  const [rentalDays, setRentalDays] = useState(""); 
  const [vehicleRequired, setVehicleRequired] = useState(""); 
  const [vehicleType, setVehicleType] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const days = rentalDays ? Number(rentalDays) : 1;
    const vehicles = vehicleRequired ? Number(vehicleRequired) : 1;

    navigate(
      `/vehicle-booking?vehicleType=${vehicleType}&rentalDays=${days}&numVehicles=${vehicles}`
    );
  };

  return (
    <div className={`container ${darkMode ? "dark" : ""}`}>
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-links">
          <a href="#">Home</a>
          <a href="#about-us">About us</a>
          <a href="#contact-us">Contact us</a>
        </div>
        <div className="nav-actions">
          <button 
            className="dark-toggle" 
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </nav>

      {/* Two Column Layout */}
      <div className="content-wrapper">
        {/* Left Column */}
        <div className="left-column">
          <img src={CarImage} alt="Car" className="car-image" />

          <div className="about-us" id="about-us">
            <h2>About us</h2>
            <p>
              DriveEase offers fast, reliable car rentals with flexible plans and a wide range of vehicles. Whether it’s a short city trip or a weekend getaway, we provide modern SUVs, sedans, and hatchbacks, all maintained for comfort and safety.
              <br /><br />
              With easy online booking, competitive pricing, and a friendly support team, we make renting a car simple and stress-free. At DriveEase, your journey, comfort, and safety are our top priority.
            </p>
          </div>

          <div className="contact-us" id="contact-us">
            <h2>Contact us</h2>
            <p><img src={whatsapp} alt="wp" /> 011 2123456</p>
            <p><img src={gmail} alt="gmail" /> drive.ease@example.com</p>
            <p><img src={map} alt="map" /> Colombo - 07</p>
          </div>
        </div>

        {/* Right Column - Booking Form */}
        <div className="right-column">
          <div className="form-frame">
            <div className="booking-form modern-form">
              <img src={logo} alt="DriveEase Logo" className="logo" />
              <h2>BOOK YOUR CAR</h2>
              <form onSubmit={handleSubmit}>
                <div className="input-wrapper">
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    required
                  />
                  <FaCalendarAlt className="input-icon" />
                </div>

                <div className="input-wrapper">
                  <input
                    type="number"
                    placeholder="No of Rental Days"
                    min="1"
                    value={rentalDays}
                    onChange={(e) => setRentalDays(e.target.value)}
                    required
                  />
                </div>

                <div className="input-wrapper">
                  <input
                    type="number"
                    placeholder="No of Vehicle Required"
                    min="1"
                    value={vehicleRequired}
                    onChange={(e) => setVehicleRequired(e.target.value)}
                    required
                  />
                </div>

                <div className="input-wrapper">
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    required
                  >
                    <option value="">Vehicle Type</option>
                    <option value="suv">SUV</option>
                    <option value="sedan">Sedan</option>
                    <option value="hatchback">Hatchback</option>
                  </select>
                  <FaChevronDown className="input-icon" />
                </div>

                <button type="submit" className="search-button">
                  Search <FaSearch style={{ marginLeft: "8px" }} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={`site-footer ${darkMode ? "dark" : ""}`}>
        <p>© 2025 DriveEase. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
