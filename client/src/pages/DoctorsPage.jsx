import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import DoctorCard from '../components/doctor/DoctorCard';
import DoctorFilterBar from '../components/doctor/DoctorFilterBar';
import BookingModal from '../components/booking/BookingModal';

const DoctorsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state initialized from query params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [department, setDepartment] = useState(searchParams.get('department') || 'All');
  const [experience, setExperience] = useState(searchParams.get('experience') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'rating');

  // Booking modal state
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load departments once
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { data } = await API.get('/departments');
        setDepartments(data || []);
      } catch (err) {
        console.error('Error fetching departments:', err);
      }
    };
    fetchDepartments();
  }, []);

  // Fetch doctors based on filters
  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search.trim()) params.append('search', search.trim());
        if (department && department !== 'All') params.append('department', department);
        if (experience) params.append('experience', experience);
        if (sort) params.append('sort', sort);

        // Update URL query string
        setSearchParams(params, { replace: true });

        const { data } = await API.get(`/doctors?${params.toString()}`);
        setDoctors(data || []);
      } catch (err) {
        console.error('Error fetching doctors:', err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchDoctors();
    }, 250);

    return () => clearTimeout(debounceTimer);
  }, [search, department, experience, sort]);

  const handleReset = () => {
    setSearch('');
    setDepartment('All');
    setExperience('');
    setSort('rating');
  };

  const handleOpenBooking = (doc) => {
    setSelectedDoctor(doc);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-light py-5 min-vh-100">
      <div className="container">
        {/* Header */}
        <div className="mb-4">
          <span className="badge bg-primary-subtle text-primary rounded-pill mb-2 px-3 py-1">Find Specialists</span>
          <h2 className="fw-bold text-dark mb-1">Browse Our Certified Doctors</h2>
          <p className="text-secondary mb-0">
            Compare qualifications, fees, clinic locations, and book your consultation slot instantly.
          </p>
        </div>

        {/* Filter Bar */}
        <DoctorFilterBar
          search={search}
          setSearch={setSearch}
          department={department}
          setDepartment={setDepartment}
          departments={departments}
          experience={experience}
          setExperience={setExperience}
          sort={sort}
          setSort={setSort}
          onReset={handleReset}
        />

        {/* Results Counter */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="text-muted small">
            Showing <strong className="text-dark">{doctors.length}</strong> available doctor{doctors.length === 1 ? '' : 's'}
          </span>
          {(search || department !== 'All' || experience) && (
            <span className="badge bg-info-subtle text-info">
              Filters Active
            </span>
          )}
        </div>

        {/* Doctor Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading doctors...</span>
            </div>
            <p className="text-muted mt-2 small">Loading specialists...</p>
          </div>
        ) : doctors.length === 0 ? (
          <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white my-4">
            <div className="text-muted mb-3">
              <i className="bi bi-person-slash display-3"></i>
            </div>
            <h4 className="fw-bold">No Doctors Found</h4>
            <p className="text-secondary mb-4">
              We couldn't find any doctors matching your search filters. Try clearing the filters or searching with different keywords.
            </p>
            <div>
              <button onClick={handleReset} className="btn btn-primary rounded-pill px-4">
                Reset All Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {doctors.map((doctor) => (
              <div key={doctor._id} className="col-lg-4 col-md-6">
                <DoctorCard doctor={doctor} onBookClick={handleOpenBooking} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <BookingModal
        doctor={selectedDoctor}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default DoctorsPage;
