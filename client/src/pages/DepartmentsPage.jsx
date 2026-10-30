import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { data } = await API.get('/departments');
        setDepartments(data || []);
      } catch (err) {
        console.error('Error fetching departments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  return (
    <div className="bg-light py-5 min-vh-100">
      <div className="container">
        <div className="text-center max-w-700 mx-auto mb-5">
          <span className="badge bg-primary-subtle text-primary rounded-pill mb-2 px-3 py-1">Clinical Specialties</span>
          <h2 className="fw-bold text-dark mb-2">Our Healthcare Departments</h2>
          <p className="text-secondary">
            Find certified specialists across our medical facilities equipped with modern diagnostics, clinical care, and specialized therapy.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : (
          <div className="row g-4">
            {departments.map((dept) => (
              <div key={dept._id} className="col-lg-4 col-md-6">
                <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden bg-white department-card transition-all">
                  <div className="position-relative" style={{ height: 160 }}>
                    <img
                      src={dept.image}
                      alt={dept.name}
                      className="w-100 h-100 object-fit-cover"
                    />
                    <div className="position-absolute top-0 end-0 m-3">
                      <span className="badge bg-white text-primary shadow-sm py-1.5 px-3 rounded-pill fw-bold">
                        {dept.doctorCount || 0} Doctor{dept.doctorCount === 1 ? '' : 's'}
                      </span>
                    </div>
                  </div>

                  <div className="card-body p-4 d-flex flex-column">
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div className="bg-primary text-white rounded-3 p-2.5 d-flex align-items-center justify-content-center shadow-sm fs-4" style={{ width: 48, height: 48 }}>
                        <i className={`bi ${dept.icon || 'bi-hospital'}`}></i>
                      </div>
                      <h5 className="fw-bold text-dark mb-0">{dept.name}</h5>
                    </div>

                    <p className="text-secondary small mb-4 flex-grow-1">
                      {dept.description}
                    </p>

                    <Link
                      to={`/doctors?department=${encodeURIComponent(dept.name)}`}
                      className="btn btn-outline-primary rounded-pill w-100 fw-semibold"
                    >
                      Find {dept.name} Doctors <i className="bi bi-arrow-right ms-1"></i>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentsPage;
