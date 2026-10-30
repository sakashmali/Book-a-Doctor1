import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import BookingModal from '../components/booking/BookingModal';

const DoctorDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(`/doctors/${id}`);
        setDoctor(data);
      } catch (err) {
        console.error('Error fetching doctor details:', err);
        setError('Doctor details could not be loaded.');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-5 min-vh-60 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="container py-5 text-center">
        <div className="card p-5 border-0 shadow-sm max-w-500 mx-auto">
          <i className="bi bi-exclamation-circle text-danger display-4 mb-3"></i>
          <h4>Doctor Not Found</h4>
          <p className="text-muted">{error || 'The requested doctor profile does not exist.'}</p>
          <Link to="/doctors" className="btn btn-primary rounded-pill px-4 mx-auto">
            Back to Doctors List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light py-5 min-vh-100">
      <div className="container">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb small">
            <li className="breadcrumb-item"><Link to="/" className="text-decoration-none">Home</Link></li>
            <li className="breadcrumb-item"><Link to="/doctors" className="text-decoration-none">Doctors</Link></li>
            <li className="breadcrumb-item active" aria-current="page">{doctor.name}</li>
          </ol>
        </nav>

        <div className="row g-4">
          {/* Main Info Column */}
          <div className="col-lg-8">
            {/* Header Profile Card */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
              <div className="d-flex flex-column flex-sm-row gap-4 align-items-sm-center">
                <div className="position-relative">
                  <img
                    src={doctor.avatar}
                    alt={doctor.name}
                    className="rounded-4 object-fit-cover shadow-sm"
                    style={{ width: 130, height: 130 }}
                  />
                  <span className="position-absolute bottom-0 end-0 bg-success border border-3 border-white rounded-circle p-1.5" title="Available"></span>
                </div>

                <div className="flex-grow-1">
                  <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                    <span className="badge bg-primary-subtle text-primary text-uppercase px-2.5 py-1 rounded-pill">
                      {doctor.department}
                    </span>
                    <span className="badge bg-success-subtle text-success px-2.5 py-1 rounded-pill">
                      <i className="bi bi-patch-check-fill me-1"></i> Verified Practitioner
                    </span>
                  </div>

                  <h3 className="fw-bold text-dark mb-1">{doctor.name}</h3>
                  <div className="lead fs-6 text-primary fw-semibold mb-2">{doctor.specialization}</div>

                  <div className="d-flex flex-wrap gap-3 text-secondary small">
                    <div>
                      <i className="bi bi-mortarboard-fill text-muted me-1"></i>
                      <span>{doctor.qualifications}</span>
                    </div>
                    <div>
                      <i className="bi bi-award-fill text-warning me-1"></i>
                      <span>{doctor.experienceYears} Years Experience</span>
                    </div>
                    <div>
                      <i className="bi bi-star-fill text-warning me-1"></i>
                      <strong className="text-dark">{doctor.rating}</strong> ({doctor.reviewCount} Reviews)
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* About / Bio Card */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
              <h5 className="fw-bold text-dark mb-3">About Doctor</h5>
              <p className="text-secondary leading-relaxed mb-0">
                {doctor.bio || 'Dr. ' + doctor.name + ' is a certified medical practitioner committed to clinical excellence, evidence-based therapies, and compassionate patient healthcare.'}
              </p>
            </div>

            {/* Clinic Address & Working Hours */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
              <h5 className="fw-bold text-dark mb-3">Practice & Hospital Location</h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="p-3 bg-light rounded-3 h-100">
                    <h6 className="fw-bold text-dark mb-2">
                      <i className="bi bi-hospital text-danger me-1"></i> {doctor.clinicAddress?.hospitalName || 'PulseCare Clinic'}
                    </h6>
                    <p className="text-muted small mb-1">
                      {doctor.clinicAddress?.street}
                    </p>
                    <p className="text-muted small mb-2">
                      {doctor.clinicAddress?.city}, {doctor.clinicAddress?.state} {doctor.clinicAddress?.zipCode}
                    </p>
                    <div className="small text-secondary">
                      <i className="bi bi-telephone text-primary me-1"></i> {doctor.phone || '+1 (555) 785-0000'}
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="p-3 bg-light rounded-3 h-100">
                    <h6 className="fw-bold text-dark mb-2">
                      <i className="bi bi-clock-history text-primary me-1"></i> Consulting Hours
                    </h6>
                    <div className="d-flex justify-content-between small text-secondary mb-1">
                      <span>Working Hours:</span>
                      <strong className="text-dark">{doctor.timeSlots?.startTime || '09:00'} – {doctor.timeSlots?.endTime || '17:00'}</strong>
                    </div>
                    <div className="d-flex justify-content-between small text-secondary mb-2">
                      <span>Slot Duration:</span>
                      <strong className="text-dark">{doctor.timeSlots?.slotDurationMinutes || 30} Minutes</strong>
                    </div>
                    <div>
                      <span className="small text-muted d-block mb-1">Days Available:</span>
                      <div className="d-flex flex-wrap gap-1">
                        {doctor.workingDays?.map((day, i) => (
                          <span key={i} className="badge bg-white border text-dark py-1 px-2">
                            {day}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Patient Feedback & Reviews */}
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold text-dark mb-0">Patient Testimonials</h5>
                <span className="text-muted small">Based on {doctor.reviewCount} verified visits</span>
              </div>

              <div className="d-flex flex-column gap-3">
                <div className="p-3 border rounded-3 bg-light">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <strong className="text-dark">David K.</strong>
                    <div className="text-warning small">
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                    </div>
                  </div>
                  <p className="text-secondary small mb-0">
                    "Dr. {doctor.name} listened carefully to all my concerns, diagnosed my issue accurately, and explained the medication routine in full detail. Highly recommended!"
                  </p>
                </div>

                <div className="p-3 border rounded-3 bg-light">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <strong className="text-dark">Elena R.</strong>
                    <div className="text-warning small">
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-half"></i>
                    </div>
                  </div>
                  <p className="text-secondary small mb-0">
                    "Extremely professional hospital clinic and very smooth booking experience. The digital prescription and report uploads in the portal are a game changer."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Appointment Booking Card */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white sticky-top" style={{ top: '90px' }}>
              <div className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-3">
                <div>
                  <small className="text-muted d-block">Consultation Fee</small>
                  <span className="fs-3 fw-bold text-success">${doctor.consultationFee}</span>
                </div>
                <div className="text-end">
                  <span className="badge bg-success-subtle text-success py-1.5 px-2.5">
                    <i className="bi bi-lightning-charge-fill me-1"></i> Instant Booking
                  </span>
                </div>
              </div>

              <ul className="list-unstyled small text-secondary d-flex flex-column gap-2 mb-4">
                <li className="d-flex align-items-center gap-2">
                  <i className="bi bi-check-circle-fill text-success"></i>
                  <span>Zero booking or hidden convenience fee</span>
                </li>
                <li className="d-flex align-items-center gap-2">
                  <i className="bi bi-check-circle-fill text-success"></i>
                  <span>Instant slot confirmation with slip</span>
                </li>
                <li className="d-flex align-items-center gap-2">
                  <i className="bi bi-check-circle-fill text-success"></i>
                  <span>Direct digital prescription access</span>
                </li>
                <li className="d-flex align-items-center gap-2">
                  <i className="bi bi-check-circle-fill text-success"></i>
                  <span>Secure health reports upload</span>
                </li>
              </ul>

              <button
                onClick={() => setIsBookingOpen(true)}
                className="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
              >
                <i className="bi bi-calendar2-check-fill fs-5"></i>
                Book Appointment Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        doctor={doctor}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
};

export default DoctorDetailPage;
