import React from 'react';

const DoctorFilterBar = ({
  search,
  setSearch,
  department,
  setDepartment,
  departments,
  experience,
  setExperience,
  sort,
  setSort,
  onReset
}) => {
  return (
    <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-white">
      <div className="row g-2 align-items-center">
        {/* Search Input */}
        <div className="col-lg-4 col-md-6">
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0 text-muted">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control bg-light border-start-0"
              placeholder="Search doctor, specialty, hospital..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Department Filter */}
        <div className="col-lg-3 col-md-6">
          <select
            className="form-select bg-light"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value="All">All Specialties & Departments</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept.name}>
                {dept.name} ({dept.doctorCount || 0})
              </option>
            ))}
          </select>
        </div>

        {/* Experience Filter */}
        <div className="col-lg-2 col-md-4 col-6">
          <select
            className="form-select bg-light"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          >
            <option value="">Any Experience</option>
            <option value="5">5+ Years</option>
            <option value="10">10+ Years</option>
            <option value="15">15+ Years</option>
          </select>
        </div>

        {/* Sort Filter */}
        <div className="col-lg-2 col-md-4 col-6">
          <select
            className="form-select bg-light"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="rating">Top Rated</option>
            <option value="experience">Most Experienced</option>
            <option value="fee_low">Fee: Low to High</option>
            <option value="fee_high">Fee: High to Low</option>
          </select>
        </div>

        {/* Reset Button */}
        <div className="col-lg-1 col-md-4 col-12 text-end">
          <button
            className="btn btn-outline-secondary w-100"
            onClick={onReset}
            title="Reset Filters"
          >
            <i className="bi bi-arrow-counterclockwise"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorFilterBar;
