import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import DoctorCard from '../components/doctor/DoctorCard';
import BookingModal from '../components/booking/BookingModal';

const Home = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroSearch, setHeroSearch] = useState('');
  const [heroDept, setHeroDept] = useState('');

  // Booking modal
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptRes, docsRes] = await Promise.all([
          API.get('/departments'),
          API.get('/doctors?sort=rating')
        ]);
        setDepartments(deptRes.data || []);
        setFeaturedDoctors(docsRes.data?.slice(0, 6) || []);
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleHeroSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (heroSearch.trim()) params.append('search', heroSearch.trim());
    if (heroDept && heroDept !== 'All') params.append('department', heroDept);
    navigate(`/doctors?${params.toString()}`);
  };

  const handleOpenBooking = (doc) => {
    setSelectedDoctor(doc);
    setIsModalOpen(true);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-primary-subtle py-5 position-relative overflow-hidden">
        <div className="container py-lg-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <div className="d-inline-flex align-items-center gap-2 bg-primary-subtle text-primary fw-semibold px-3 py-1.5 rounded-pill mb-3">
                <i className="bi bi-shield-fill-check"></i>
                <span className="small">Trusted Healthcare Network &bull; 100% Certified Physicians</span>
              </div>
              <h1 className="display-4 fw-extrabold text-dark mb-3 tracking-tight">
                Healthcare at Your Fingertips. <br />
                <span className="text-primary">Book Top Doctors</span> Instantly.
              </h1>
              <p className="lead text-secondary mb-4" style={{ maxWidth: '600px' }}>
                Connect with leading cardiologists, neurologists, pediatricians, and specialists. Real-time availability, secure medical records, and digital prescriptions.
              </p>

              {/* Quick Search Bar Card */}
              <div className="card border-0 shadow-lg rounded-4 p-3 mb-4 bg-white">
                <form onSubmit={handleHeroSearchSubmit} className="row g-2 align-items-center">
                  <div className="col-md-5">
                    <div className="input-group">
                      <span className="input-group-text bg-transparent border-0 text-primary">
                        <i className="bi bi-search fs-5"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control border-0 shadow-none ps-0"
                        placeholder="Doctor name or condition..."
                        value={heroSearch}
                        onChange={(e) => setHeroSearch(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 border-start-md">
                    <div className="input-group">
                      <span className="input-group-text bg-transparent border-0 text-primary">
                        <i className="bi bi-hospital fs-5"></i>
                      </span>
                      <select
                        className="form-select border-0 shadow-none ps-0"
                        value={heroDept}
                        onChange={(e) => setHeroDept(e.target.value)}
                      >
                        <option value="">Any Department</option>
                        {departments.map((d) => (
                          <option key={d._id} value={d.name}>{d.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <button type="submit" className="btn btn-primary w-100 rounded-pill py-2.5 fw-semibold shadow-sm">
                      Find Doctors
                    </button>
                  </div>
                </form>
              </div>

              {/* Fast Stats Row */}
              <div className="row g-3 pt-2">
                <div className="col-4">
                  <div className="fw-bold fs-4 text-dark">10+</div>
                  <small className="text-secondary">Specialist Doctors</small>
                </div>
                <div className="col-4">
                  <div className="fw-bold fs-4 text-dark">8</div>
                  <small className="text-secondary">Clinical Departments</small>
                </div>
                <div className="col-4">
                  <div className="fw-bold fs-4 text-dark">99.4%</div>
                  <small className="text-secondary">Satisfied Patients</small>
                </div>
              </div>
            </div>

            {/* Hero Visual Card */}
            <div className="col-lg-5">
              <div className="position-relative">
                <img
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=700&q=80"
                  alt="Modern Clinical Care"
                  className="img-fluid rounded-5 shadow-lg object-fit-cover w-100"
                  style={{ maxHeight: '480px' }}
                />

                {/* Floating Doctor Badge */}
                <div className="position-absolute bottom-0 start-0 m-3 p-3 bg-white bg-opacity-95 rounded-4 shadow-lg border d-flex align-items-center gap-3 backdrop-blur" style={{ maxWidth: '280px' }}>
                  <div className="bg-success-subtle text-success rounded-circle p-2.5 d-flex align-items-center justify-content-center">
                    <i className="bi bi-clock-history fs-4"></i>
                  </div>
                  <div>
                    <span className="fw-bold text-dark d-block" style={{ fontSize: '13px' }}>Instant Slots</span>
                    <span className="text-muted" style={{ fontSize: '11px' }}>Book in under 60 seconds with live slot validation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Departments Grid */}
      <section className="py-5 bg-white">
        <div className="container py-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 gap-2">
            <div>
              <span className="badge bg-primary-subtle text-primary rounded-pill mb-2 px-3 py-1">Medical Centers</span>
              <h2 className="fw-bold text-dark mb-1">Browse by Department</h2>
              <p className="text-muted mb-0">Select a specialty to view certified practitioners and schedules</p>
            </div>
            <Link to="/departments" className="btn btn-outline-primary rounded-pill px-3 fw-semibold">
              View All Departments <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>

          <div className="row g-3">
            {departments.slice(0, 8).map((dept) => (
              <div key={dept._id} className="col-lg-3 col-md-4 col-sm-6">
                <Link
                  to={`/doctors?department=${encodeURIComponent(dept.name)}`}
                  className="card h-100 text-decoration-none border-0 shadow-sm rounded-4 p-3.5 department-card transition-all"
                >
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <div className="bg-primary-subtle text-primary rounded-3 p-3 d-flex align-items-center justify-content-center fs-4">
                      <i className={`bi ${dept.icon || 'bi-hospital'}`}></i>
                    </div>
                    <div>
                      <h6 className="fw-bold text-dark mb-0">{dept.name}</h6>
                      <small className="text-primary fw-semibold">{dept.doctorCount || 0} Doctors Available</small>
                    </div>
                  </div>
                  <p className="text-secondary small mb-0 line-clamp-2">
                    {dept.description}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Doctors Section */}
      <section className="py-5 bg-light">
        <div className="container py-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 gap-2">
            <div>
              <span className="badge bg-success-subtle text-success rounded-pill mb-2 px-3 py-1">Top Rated</span>
              <h2 className="fw-bold text-dark mb-1">Featured Doctors</h2>
              <p className="text-muted mb-0">Book appointments with our highest-rated medical professionals</p>
            </div>
            <Link to="/doctors" className="btn btn-primary rounded-pill px-4 shadow-sm fw-semibold">
              Explore All 10+ Doctors <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : (
            <div className="row g-4">
              {featuredDoctors.map((doc) => (
                <div key={doc._id} className="col-lg-4 col-md-6">
                  <DoctorCard doctor={doc} onBookClick={handleOpenBooking} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How PulseCare Works Flowchart */}
      <section className="py-5 bg-white">
        <div className="container py-4">
          <div className="text-center max-w-700 mx-auto mb-5">
            <span className="badge bg-primary-subtle text-primary rounded-pill mb-2 px-3 py-1">Simple & Fast</span>
            <h2 className="fw-bold text-dark mb-2">How to Book Your Appointment</h2>
            <p className="text-muted">Follow four easy steps to consult with leading medical practitioners</p>
          </div>

          <div className="row g-4 text-center">
            <div className="col-lg-3 col-md-6">
              <div className="card h-100 border-0 p-4 rounded-4 shadow-sm bg-light">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 shadow-sm" style={{ width: 60, height: 60 }}>
                  <i className="bi bi-search fs-4"></i>
                </div>
                <h5 className="fw-bold mb-2">1. Find Your Doctor</h5>
                <p className="text-muted small mb-0">
                  Search by specialty, department, hospital, or consultation fee to find the right physician.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="card h-100 border-0 p-4 rounded-4 shadow-sm bg-light">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 shadow-sm" style={{ width: 60, height: 60 }}>
                  <i className="bi bi-calendar2-week fs-4"></i>
                </div>
                <h5 className="fw-bold mb-2">2. Pick a Slot</h5>
                <p className="text-muted small mb-0">
                  Select your preferred appointment date and an available real-time time slot without conflicts.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="card h-100 border-0 p-4 rounded-4 shadow-sm bg-light">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 shadow-sm" style={{ width: 60, height: 60 }}>
                  <i className="bi bi-cloud-arrow-up fs-4"></i>
                </div>
                <h5 className="fw-bold mb-2">3. Upload Reports</h5>
                <p className="text-muted small mb-0">
                  Attach previous prescriptions, test scans, or lab reports securely for the doctor to review.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="card h-100 border-0 p-4 rounded-4 shadow-sm bg-light">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 shadow-sm" style={{ width: 60, height: 60 }}>
                  <i className="bi bi-file-earmark-medical fs-4"></i>
                </div>
                <h5 className="fw-bold mb-2">4. Digital Care</h5>
                <p className="text-muted small mb-0">
                  Attend your visit, receive diagnosis and digital prescription with medicine dosages directly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Hotline Banner */}
      <section className="py-4 bg-danger text-white">
        <div className="container">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
            <div className="d-flex align-items-center gap-3 text-center text-md-start">
              <div className="bg-white text-danger rounded-circle p-3 d-flex align-items-center justify-content-center shadow" style={{ width: 54, height: 54 }}>
                <i className="bi bi-telephone-outbound-fill fs-4"></i>
              </div>
              <div>
                <h5 className="fw-bold mb-0">Experiencing a Medical Emergency?</h5>
                <span className="small text-white-50">PulseCare Rapid Response Emergency Dispatchers are on standby 24/7.</span>
              </div>
            </div>
            <a href="tel:18007857322" className="btn btn-light text-danger fw-bold rounded-pill px-4 py-2 shadow">
              <i className="bi bi-phone-vibrate me-1"></i> Call Emergency: 1-800-PULSECARE
            </a>
          </div>
        </div>
      </section>

      {/* Booking Modal Instance */}
      <BookingModal
        doctor={selectedDoctor}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Home;
