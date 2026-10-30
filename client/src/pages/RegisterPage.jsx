import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('patient'); // 'patient' or 'doctor'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  // Common fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // Patient specific
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [emergencyContact, setEmergencyContact] = useState('');

  // Doctor specific
  const [department, setDepartment] = useState('General Medicine');
  const [specialization, setSpecialization] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [experienceYears, setExperienceYears] = useState(5);
  const [consultationFee, setConsultationFee] = useState(80);
  const [hospitalName, setHospitalName] = useState('PulseCare Clinic');
  const [bio, setBio] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessNotice('');
    setLoading(true);

    try {
      const payload = {
        name,
        email,
        password,
        role,
        phone,
        address
      };

      if (role === 'patient') {
        payload.patientDetails = {
          bloodGroup,
          age: age ? Number(age) : null,
          gender,
          emergencyContact
        };
      } else {
        payload.doctorDetails = {
          department,
          specialization: specialization || 'General Physician',
          qualifications: qualifications || 'MBBS',
          experienceYears: Number(experienceYears) || 3,
          consultationFee: Number(consultationFee) || 60,
          clinicAddress: {
            hospitalName: hospitalName || 'PulseCare Health Center',
            street: address || '100 Medical Blvd',
            city: 'New York',
            state: 'NY',
            zipCode: '10001'
          },
          bio: bio || 'Compassionate physician focused on clinical excellence.'
        };
      }

      const registered = await register(payload);

      if (role === 'doctor') {
        setSuccessNotice('Doctor registration submitted! Your profile has been sent to the Admin for approval.');
        setTimeout(() => {
          navigate('/doctor/dashboard');
        }, 1200);
      } else {
        navigate('/patient/dashboard');
      }
    } catch (err) {
      console.error('Registration failed:', err);
      setError(err.response?.data?.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light py-5 min-vh-100">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">
            <div className="card border-0 shadow-lg rounded-4 p-4 p-sm-5 bg-white">
              <div className="text-center mb-4">
                <div className="bg-primary text-white rounded-3 p-2.5 d-inline-flex align-items-center justify-content-center mb-2 shadow-sm" style={{ width: 48, height: 48 }}>
                  <i className="bi bi-person-plus-fill fs-4"></i>
                </div>
                <h3 className="fw-bold text-dark mb-1">Create PulseCare Account</h3>
                <p className="text-muted small">Register to book appointments or manage patient consultations</p>

                {/* Role Switcher Tabs */}
                <div className="btn-group p-1 bg-light rounded-pill border mx-auto mt-3" role="group">
                  <button
                    type="button"
                    className={`btn btn-sm rounded-pill px-4 py-2 fw-semibold ${role === 'patient' ? 'btn-primary text-white shadow-sm' : 'text-secondary'}`}
                    onClick={() => setRole('patient')}
                  >
                    <i className="bi bi-person me-1"></i> I am a Patient
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm rounded-pill px-4 py-2 fw-semibold ${role === 'doctor' ? 'btn-primary text-white shadow-sm' : 'text-secondary'}`}
                    onClick={() => setRole('doctor')}
                  >
                    <i className="bi bi-heart-pulse me-1"></i> I am a Doctor
                  </button>
                </div>
              </div>

              {error && (
                <div className="alert alert-danger py-2 small d-flex align-items-center gap-2 mb-3">
                  <i className="bi bi-exclamation-triangle-fill"></i>
                  <div>{error}</div>
                </div>
              )}

              {successNotice && (
                <div className="alert alert-success py-2 small d-flex align-items-center gap-2 mb-3">
                  <i className="bi bi-check-circle-fill"></i>
                  <div>{successNotice}</div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <h6 className="fw-bold text-primary mb-3 pb-1 border-bottom">
                  <i className="bi bi-shield-check me-1"></i> Account Credentials
                </h6>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-secondary">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={role === 'doctor' ? 'Dr. John Doe' : 'Jane Doe'}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-secondary">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-secondary">
                      Password (min 6 chars) *
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-secondary">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="+1 (555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-semibold text-secondary">
                      Residential or Clinic Address
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Street, City, State, Zip"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </div>

                {role === 'patient' ? (
                  <>
                    <h6 className="fw-bold text-primary mb-3 pb-1 border-bottom">
                      <i className="bi bi-file-medical me-1"></i> Patient Health Profile
                    </h6>
                    <div className="row g-3 mb-4">
                      <div className="col-md-4">
                        <label className="form-label small fw-semibold text-secondary">Blood Group</label>
                        <select className="form-select" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)}>
                          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Not specified'].map((bg) => (
                            <option key={bg} value={bg}>{bg}</option>
                          ))}
                        </select>
                      </div>

                      <div className="col-md-4">
                        <label className="form-label small fw-semibold text-secondary">Age</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="e.g. 28"
                          min="1"
                          max="120"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                        />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label small fw-semibold text-secondary">Gender</label>
                        <select className="form-select" value={gender} onChange={(e) => setGender(e.target.value)}>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                          <option value="Not specified">Prefer not to say</option>
                        </select>
                      </div>

                      <div className="col-12">
                        <label className="form-label small fw-semibold text-secondary">Emergency Contact Person & Phone</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. Maria (Spouse) +1 (555) 999-0000"
                          value={emergencyContact}
                          onChange={(e) => setEmergencyContact(e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <h6 className="fw-bold text-primary mb-3 pb-1 border-bottom">
                      <i className="bi bi-stethoscope me-1"></i> Clinical & Practice Profile
                    </h6>
                    <div className="row g-3 mb-4">
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold text-secondary">Department *</label>
                        <select className="form-select" value={department} onChange={(e) => setDepartment(e.target.value)}>
                          <option value="Cardiology">Cardiology</option>
                          <option value="Neurology">Neurology</option>
                          <option value="Pediatrics">Pediatrics</option>
                          <option value="Orthopedics">Orthopedics</option>
                          <option value="Dermatology">Dermatology</option>
                          <option value="General Medicine">General Medicine</option>
                          <option value="Ophthalmology">Ophthalmology</option>
                          <option value="Gynecology">Gynecology</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-semibold text-secondary">Specialization Title *</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. Interventional Cardiologist"
                          value={specialization}
                          onChange={(e) => setSpecialization(e.target.value)}
                          required
                        />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label small fw-semibold text-secondary">Qualifications</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="MBBS, MD"
                          value={qualifications}
                          onChange={(e) => setQualifications(e.target.value)}
                        />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label small fw-semibold text-secondary">Experience (Years)</label>
                        <input
                          type="number"
                          className="form-control"
                          min="0"
                          value={experienceYears}
                          onChange={(e) => setExperienceYears(e.target.value)}
                        />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label small fw-semibold text-secondary">Consultation Fee ($)</label>
                        <input
                          type="number"
                          className="form-control"
                          min="10"
                          value={consultationFee}
                          onChange={(e) => setConsultationFee(e.target.value)}
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label small fw-semibold text-secondary">Hospital / Practice Name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. St. Jude Wellness Center"
                          value={hospitalName}
                          onChange={(e) => setHospitalName(e.target.value)}
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label small fw-semibold text-secondary">Professional Bio</label>
                        <textarea
                          className="form-control"
                          rows="2"
                          placeholder="Brief description of your clinical experience and focus areas..."
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                        ></textarea>
                      </div>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2.5 rounded-pill fw-semibold shadow-sm mb-3"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Registering Account...
                    </>
                  ) : (
                    `Complete ${role === 'doctor' ? 'Doctor' : 'Patient'} Registration`
                  )}
                </button>

                <div className="text-center text-muted small">
                  Already registered?{' '}
                  <Link to="/login" className="text-primary fw-semibold text-decoration-none">
                    Sign in to your account
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
