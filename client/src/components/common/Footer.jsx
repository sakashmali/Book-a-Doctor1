import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-light pt-5 pb-4 mt-auto">
      <div className="container">
        <div className="row g-4 mb-4">
          {/* Brand & Emergency */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="bg-primary text-white rounded-3 p-2 d-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }}>
                <i className="bi bi-heart-pulse-fill"></i>
              </div>
              <span className="fw-bold fs-4 text-white">Pulse<span className="text-primary">Care</span></span>
            </div>
            <p className="text-secondary small mb-3">
              Modern digital healthcare infrastructure connecting certified physicians, hospitals, and patients for safe and seamless medical consultations.
            </p>
            <div className="p-3 bg-secondary bg-opacity-10 rounded-3 border border-secondary border-opacity-25">
              <div className="d-flex align-items-center gap-2 text-danger fw-bold mb-1">
                <i className="bi bi-telephone-fill"></i>
                <span>24/7 Medical Emergency Helpline</span>
              </div>
              <span className="fs-5 fw-bold text-white tracking-wide">+1 (800) 785-7322</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-3 col-6">
            <h6 className="text-white fw-bold mb-3">Explore</h6>
            <ul className="list-unstyled text-secondary small d-flex flex-column gap-2 mb-0">
              <li><Link to="/" className="text-secondary text-decoration-none hover-white">Home</Link></li>
              <li><Link to="/doctors" className="text-secondary text-decoration-none hover-white">Find Doctors</Link></li>
              <li><Link to="/departments" className="text-secondary text-decoration-none hover-white">Departments</Link></li>
              <li><Link to="/login" className="text-secondary text-decoration-none hover-white">Patient Portal</Link></li>
              <li><Link to="/register" className="text-secondary text-decoration-none hover-white">Join as Doctor</Link></li>
            </ul>
          </div>

          {/* Medical Specialties */}
          <div className="col-lg-3 col-md-3 col-6">
            <h6 className="text-white fw-bold mb-3">Departments</h6>
            <ul className="list-unstyled text-secondary small d-flex flex-column gap-2 mb-0">
              <li><Link to="/doctors?department=Cardiology" className="text-secondary text-decoration-none hover-white">Cardiology & Heart Care</Link></li>
              <li><Link to="/doctors?department=Neurology" className="text-secondary text-decoration-none hover-white">Neurology & Spine</Link></li>
              <li><Link to="/doctors?department=Pediatrics" className="text-secondary text-decoration-none hover-white">Pediatrics & Neonatology</Link></li>
              <li><Link to="/doctors?department=Orthopedics" className="text-secondary text-decoration-none hover-white">Orthopedics & Joint Care</Link></li>
              <li><Link to="/doctors?department=Dermatology" className="text-secondary text-decoration-none hover-white">Dermatology & Skin</Link></li>
            </ul>
          </div>

          {/* Working Hours & Hospital Info */}
          <div className="col-lg-3 col-md-12">
            <h6 className="text-white fw-bold mb-3">Clinical Operations</h6>
            <ul className="list-unstyled text-secondary small d-flex flex-column gap-2 mb-3">
              <li className="d-flex justify-content-between">
                <span>Mon – Fri:</span>
                <span className="text-light">08:00 AM – 08:00 PM</span>
              </li>
              <li className="d-flex justify-content-between">
                <span>Saturday:</span>
                <span className="text-light">09:00 AM – 06:00 PM</span>
              </li>
              <li className="d-flex justify-content-between">
                <span>Sunday (Emergency):</span>
                <span className="text-light">24 Hours On-Call</span>
              </li>
            </ul>
            <div className="d-flex gap-2">
              <span className="badge bg-success-subtle text-success py-1.5 px-2.5">
                <i className="bi bi-shield-check me-1"></i> HIPAA Compliant
              </span>
              <span className="badge bg-info-subtle text-info py-1.5 px-2.5">
                <i className="bi bi-lock-fill me-1"></i> 256-bit Encrypted
              </span>
            </div>
          </div>
        </div>

        <hr className="border-secondary border-opacity-25 my-3" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 text-secondary small">
          <div>
            &copy; {new Date().getFullYear()} PulseCare Health Technologies. All rights reserved. Realistic demo application.
          </div>
          <div className="d-flex gap-3">
            <span className="text-secondary">Designed for Excellence</span>
            <span>&bull;</span>
            <span className="text-secondary">MERN Stack Certified</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
