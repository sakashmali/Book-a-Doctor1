const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Department = require('../models/Department');

// @desc    Get overall system statistics for Admin Dashboard
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getAdminStats = async (req, res) => {
  try {
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalDoctors = await Doctor.countDocuments({});
    const approvedDoctors = await Doctor.countDocuments({ isApproved: true });
    const pendingDoctors = await Doctor.countDocuments({ isApproved: false });
    const totalDepartments = await Department.countDocuments({});
    
    const totalAppointments = await Appointment.countDocuments({});
    const confirmedAppointments = await Appointment.countDocuments({ status: 'confirmed' });
    const completedAppointments = await Appointment.countDocuments({ status: 'completed' });
    const cancelledAppointments = await Appointment.countDocuments({ status: 'cancelled' });

    // Revenue calculation
    const completedList = await Appointment.find({ status: 'completed' }).select('fee');
    const totalRevenue = completedList.reduce((acc, curr) => acc + (curr.fee || 0), 0);

    // Recent 5 appointments
    const recentAppointments = await Appointment.find({})
      .populate('doctor', 'name specialization department')
      .populate('patient', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent 5 registered users
    const recentUsers = await User.find({ role: { $ne: 'admin' } })
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    return res.json({
      counts: {
        patients: totalPatients,
        doctors: totalDoctors,
        approvedDoctors,
        pendingDoctors,
        departments: totalDepartments,
        appointments: totalAppointments,
        confirmedAppointments,
        completedAppointments,
        cancelledAppointments,
        totalRevenue
      },
      recentAppointments,
      recentUsers
    });
  } catch (error) {
    console.error('getAdminStats error:', error);
    return res.status(500).json({ message: error.message || 'Error fetching admin stats' });
  }
};

// @desc    Get all doctors (Admin view, can see pending approval)
// @route   GET /api/admin/doctors
// @access  Private (Admin)
const getAdminDoctors = async (req, res) => {
  try {
    const { status, approval } = req.query;
    const filter = {};

    if (approval === 'pending') {
      filter.isApproved = false;
    } else if (approval === 'approved') {
      filter.isApproved = true;
    }

    if (status === 'active') {
      filter.isActive = true;
    } else if (status === 'inactive') {
      filter.isActive = false;
    }

    const doctors = await Doctor.find(filter)
      .populate('user', 'name email phone avatar createdAt isActive')
      .sort({ createdAt: -1 });

    return res.json(doctors);
  } catch (error) {
    console.error('getAdminDoctors error:', error);
    return res.status(500).json({ message: error.message || 'Error fetching doctors' });
  }
};

// @desc    Approve or reject doctor profile
// @route   PUT /api/admin/doctors/:id/approval
// @access  Private (Admin)
const setDoctorApproval = async (req, res) => {
  try {
    const { isApproved } = req.body;
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    doctor.isApproved = Boolean(isApproved);
    await doctor.save();

    return res.json({
      message: `Doctor ${doctor.name} ${doctor.isApproved ? 'approved' : 'approval revoked'} successfully`,
      doctor
    });
  } catch (error) {
    console.error('setDoctorApproval error:', error);
    return res.status(500).json({ message: error.message || 'Error updating approval' });
  }
};

// @desc    Toggle doctor active status
// @route   PUT /api/admin/doctors/:id/toggle-status
// @access  Private (Admin)
const toggleDoctorActive = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    doctor.isActive = !doctor.isActive;
    await doctor.save();

    return res.json({
      message: `Doctor ${doctor.name} status updated to ${doctor.isActive ? 'Active' : 'Inactive'}`,
      doctor
    });
  } catch (error) {
    console.error('toggleDoctorActive error:', error);
    return res.status(500).json({ message: error.message || 'Error updating status' });
  }
};

// @desc    Get all patients
// @route   GET /api/admin/patients
// @access  Private (Admin)
const getAdminPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: 'patient' })
      .select('-password')
      .sort({ createdAt: -1 });

    // Enrich with appointment count
    const enriched = await Promise.all(
      patients.map(async (p) => {
        const appointmentCount = await Appointment.countDocuments({ patient: p._id });
        return {
          ...p.toObject(),
          appointmentCount
        };
      })
    );

    return res.json(enriched);
  } catch (error) {
    console.error('getAdminPatients error:', error);
    return res.status(500).json({ message: error.message || 'Error fetching patients' });
  }
};

// @desc    Toggle patient active status
// @route   PUT /api/admin/patients/:id/toggle-status
// @access  Private (Admin)
const togglePatientActive = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.role !== 'patient') {
      return res.status(404).json({ message: 'Patient not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    return res.json({
      message: `Patient ${user.name} status changed to ${user.isActive ? 'Active' : 'Deactivated'}`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('togglePatientActive error:', error);
    return res.status(500).json({ message: error.message || 'Error toggling patient status' });
  }
};

// @desc    Get all system appointments (Admin)
// @route   GET /api/admin/appointments
// @access  Private (Admin)
const getAdminAppointments = async (req, res) => {
  try {
    const { status, date, doctorId } = req.query;
    const filter = {};

    if (status && status !== 'all') {
      filter.status = status;
    }
    if (date) {
      filter.appointmentDate = date;
    }
    if (doctorId && doctorId !== 'all') {
      filter.doctor = doctorId;
    }

    const appointments = await Appointment.find(filter)
      .populate('doctor', 'name specialization department consultationFee')
      .populate('patient', 'name email phone')
      .sort({ appointmentDate: -1, createdAt: -1 });

    return res.json(appointments);
  } catch (error) {
    console.error('getAdminAppointments error:', error);
    return res.status(500).json({ message: error.message || 'Error fetching appointments' });
  }
};

module.exports = {
  getAdminStats,
  getAdminDoctors,
  setDoctorApproval,
  toggleDoctorActive,
  getAdminPatients,
  togglePatientActive,
  getAdminAppointments
};
