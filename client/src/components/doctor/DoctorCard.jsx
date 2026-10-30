import React from 'react';
import { Link } from 'react-router-dom';

const DoctorCard = ({ doctor, onBookClick }) => {
  return (
    <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden doctor-card transition-all">
      <div className="card-body p-4 d-flex flex-column">
        {/* Top Header: Image, Name, Badges */}
        <div className="d-flex gap-3 mb-3">
          <div className="position-relative flex-shrink-0">
            <img
              src={doctor.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80'}
              alt={doctor.name}
              className="rounded-4 object-fit-cover shadow-sm"
              style={{ width: 85, height: 85 }}
            />
            <span
              className="position-absolute bottom-0 end-0 bg-success border border-2 border-white rounded-circle p-1"
              title="Verified Practitioner"
            ></span>
          </div>

          <div className="flex-grow-1 overflow-hidden">
            <div className="d-flex align-items-center justify-content-between mb-1">
              <span className="badge bg-primary-subtle text-primary text-uppercase px-2 py-1 rounded-pill" style={{ fontSize: '11px', letterSpacing: '0.3px' }}>
                {doctor.department}
              </span>
              <div className="d-flex align-items-center gap-1 text-warning small fw-bold">
                <i className="bi bi-star-fill"></i>
                <span className="text-dark">{doctor.rating || 4.9}</span>
                <span className="text-muted fw-normal" style={{ fontSize: '11px' }}>({doctor.reviewCount || 24})</span>
              </div>
            </div>

            <h5 className="fw-bold mb-1 text-truncate text-dark" title={doctor.name}>
              {doctor.name}
            </h5>
            <div className="text-muted small text-truncate fw-medium mb-1" title={doctor.specialization}>
              {doctor.specialization}
            </div>
            <div className="text-secondary small" style={{ fontSize: '12px' }}>
              <i className="bi bi-mortarboard-fill text-primary me-1"></i>
              {doctor.qualifications}
            </div>
          </div>
        </div>

        {/* Middle: Experience & Clinic */}
        <div className="bg-light rounded-3 p-2.5 mb-3 small d-flex flex-column gap-1.5 border border-light-subtle">
          <div className="d-flex justify-content-between text-secondary">
            <span><i className="bi bi-award-fill text-warning me-1"></i> Experience:</span>
            <span className="fw-semibold text-dark">{doctor.experienceYears}+ Years</span>
          </div>
          <div className="d-flex justify-content-between text-secondary">
            <span><i className="bi bi-hospital text-danger me-1"></i> Clinic:</span>
            <span className="fw-semibold text-dark text-truncate ps-2" style={{ maxWidth: 180 }} title={doctor.clinicAddress?.hospitalName}>
              {doctor.clinicAddress?.hospitalName || 'PulseCare Health Hub'}
            </span>
          </div>
          <div className="d-flex justify-content-between text-secondary">
            <span><i className="bi bi-geo-alt-fill text-info me-1"></i> Location:</span>
            <span className="fw-semibold text-dark">
              {doctor.clinicAddress?.city}, {doctor.clinicAddress?.state}
            </span>
          </div>
        </div>

        {/* Working Days Badges */}
        <div className="mb-3">
          <small className="text-muted d-block mb-1" style={{ fontSize: '11px' }}>Available on:</small>
          <div className="d-flex flex-wrap gap-1">
            {doctor.workingDays?.slice(0, 4).map((day, i) => (
              <span key={i} className="badge bg-secondary-subtle text-secondary fw-normal px-2 py-0.5 rounded-pill" style={{ fontSize: '10px' }}>
                {day.slice(0, 3)}
              </span>
            ))}
            {doctor.workingDays?.length > 4 && (
              <span className="badge bg-secondary-subtle text-secondary fw-normal px-1.5 py-0.5 rounded-pill" style={{ fontSize: '10px' }}>
                +{doctor.workingDays.length - 4} days
              </span>
            )}
          </div>
        </div>

        {/* Footer: Fee & Buttons */}
        <div className="mt-auto pt-3 border-top d-flex align-items-center justify-content-between gap-2">
          <div>
            <span className="text-muted d-block" style={{ fontSize: '11px' }}>Consultation</span>
            <span className="fs-5 fw-bold text-success">${doctor.consultationFee}</span>
          </div>

          <div className="d-flex gap-2">
            <Link
              to={`/doctors/${doctor._id}`}
              className="btn btn-outline-secondary btn-sm rounded-pill px-3 fw-semibold"
            >
              Profile
            </Link>
            <button
              onClick={() => onBookClick(doctor)}
              className="btn btn-primary btn-sm rounded-pill px-3 fw-semibold shadow-sm"
            >
              <i className="bi bi-calendar2-plus me-1"></i>
              Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
