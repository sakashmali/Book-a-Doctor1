const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const User = require('../models/User');

// Helper: Convert "09:00" or 9:00 into minutes from midnight
const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + (minutes || 0);
};

// Helper: Convert minutes from midnight to "09:30 AM" format
const minutesToDisplayTime = (totalMinutes) => {
  const hours24 = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const ampm = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const formattedHours = hours12 < 10 ? `0${hours12}` : `${hours12}`;
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

// @desc    Get all doctors with filtering & search
// @route   GET /api/doctors
// @access  Public
const getAllDoctors = async (req, res) => {
  try {
    const {
      search,
      department,
      specialization,
      maxFee,
      experience,
      sort,
      includeUnapproved
    } = req.query;

    const query = {};

    // Only return approved and active doctors to general users unless admin requests all
    if (includeUnapproved !== 'true') {
      query.isApproved = true;
      query.isActive = true;
    }

    if (department && department !== 'All') {
      query.department = new RegExp(`^${department}$`, 'i');
    }

    if (specialization && specialization !== 'All') {
      query.specialization = new RegExp(specialization, 'i');
    }

    if (maxFee) {
      query.consultationFee = { $lte: Number(maxFee) };
    }

    if (experience) {
      query.experienceYears = { $gte: Number(experience) };
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { department: searchRegex },
        { specialization: searchRegex },
        { bio: searchRegex },
        { 'clinicAddress.hospitalName': searchRegex },
        { 'clinicAddress.city': searchRegex }
      ];
    }

    let doctorQuery = Doctor.find(query).populate('user', 'name email avatar phone');

    // Sorting
    if (sort === 'fee_low') {
      doctorQuery = doctorQuery.sort({ consultationFee: 1 });
    } else if (sort === 'fee_high') {
      doctorQuery = doctorQuery.sort({ consultationFee: -1 });
    } else if (sort === 'experience') {
      doctorQuery = doctorQuery.sort({ experienceYears: -1 });
    } else if (sort === 'rating') {
      doctorQuery = doctorQuery.sort({ rating: -1 });
    } else {
      doctorQuery = doctorQuery.sort({ rating: -1, createdAt: -1 });
    }

    const doctors = await doctorQuery.exec();
    return res.json(doctors);
  } catch (error) {
    console.error('getAllDoctors error:', error);
    return res.status(500).json({ message: error.message || 'Server error retrieving doctors' });
  }
};

// @desc    Get doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('user', 'name email avatar phone address');
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    return res.json(doctor);
  } catch (error) {
    console.error('getDoctorById error:', error);
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Get available slots for a doctor on a specific date
// @route   GET /api/doctors/:id/available-slots
// @access  Public
const getDoctorAvailableSlots = async (req, res) => {
  try {
    const { date } = req.query; // YYYY-MM-DD
    if (!date) {
      return res.status(400).json({ message: 'Date parameter (YYYY-MM-DD) is required' });
    }

    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Determine Day of week from YYYY-MM-DD (e.g. "Monday")
    const [year, month, day] = date.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const targetDayName = dayNames[dateObj.getDay()];

    const isWorkingDay = doctor.workingDays.some(
      (d) => d.toLowerCase() === targetDayName.toLowerCase()
    );

    if (!isWorkingDay) {
      return res.json({
        date,
        dayOfWeek: targetDayName,
        isWorkingDay: false,
        message: `${doctor.name} is not available on ${targetDayName}s`,
        slots: []
      });
    }

    // Generate intervals
    const startMin = timeToMinutes(doctor.timeSlots?.startTime || '09:00');
    const endMin = timeToMinutes(doctor.timeSlots?.endTime || '17:00');
    const duration = doctor.timeSlots?.slotDurationMinutes || 30;
    const breakStart = timeToMinutes(doctor.timeSlots?.breakStartTime || '13:00');
    const breakEnd = timeToMinutes(doctor.timeSlots?.breakEndTime || '14:00');

    // Find all active booked appointments for this doctor on that date
    const bookedAppointments = await Appointment.find({
      doctor: doctor._id,
      appointmentDate: date,
      status: { $ne: 'cancelled' }
    }).select('timeSlot');

    const bookedSlotsSet = new Set(bookedAppointments.map((a) => a.timeSlot.trim().toUpperCase()));

    const slots = [];
    for (let current = startMin; current + duration <= endMin; current += duration) {
      // Check if current slot falls inside break time
      if (current >= breakStart && current < breakEnd) {
        continue;
      }

      const slotDisplay = minutesToDisplayTime(current);
      const isBooked = bookedSlotsSet.has(slotDisplay.toUpperCase());

      slots.push({
        time: slotDisplay,
        available: !isBooked
      });
    }

    return res.json({
      date,
      dayOfWeek: targetDayName,
      isWorkingDay: true,
      doctorName: doctor.name,
      consultationFee: doctor.consultationFee,
      slots
    });
  } catch (error) {
    console.error('getDoctorAvailableSlots error:', error);
    return res.status(500).json({ message: error.message || 'Error generating slots' });
  }
};

// @desc    Update doctor profile (for logged-in doctor)
// @route   PUT /api/doctors/profile
// @access  Private (Doctor)
const updateDoctorProfile = async (req, res) => {
  try {
    let doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found for this account' });
    }

    const fields = [
      'name',
      'phone',
      'department',
      'specialization',
      'qualifications',
      'experienceYears',
      'consultationFee',
      'clinicAddress',
      'bio',
      'avatar',
      'workingDays',
      'timeSlots'
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        doctor[field] = req.body[field];
      }
    });

    // Also sync User name/phone/avatar if updated
    if (req.body.name || req.body.phone || req.body.avatar) {
      const user = await User.findById(req.user._id);
      if (user) {
        if (req.body.name) user.name = req.body.name;
        if (req.body.phone) user.phone = req.body.phone;
        if (req.body.avatar) user.avatar = req.body.avatar;
        await user.save();
      }
    }

    const updated = await doctor.save();
    return res.json(updated);
  } catch (error) {
    console.error('updateDoctorProfile error:', error);
    return res.status(500).json({ message: error.message || 'Error updating doctor profile' });
  }
};

// @desc    Get current doctor's own profile and statistics
// @route   GET /api/doctors/dashboard/stats
// @access  Private (Doctor)
const getDoctorStats = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const todayStr = new Date().toISOString().split('T')[0];

    const totalAppointments = await Appointment.countDocuments({ doctor: doctor._id });
    const todayAppointments = await Appointment.countDocuments({
      doctor: doctor._id,
      appointmentDate: todayStr,
      status: { $ne: 'cancelled' }
    });
    const upcomingAppointments = await Appointment.countDocuments({
      doctor: doctor._id,
      status: 'confirmed'
    });
    const completedAppointments = await Appointment.countDocuments({
      doctor: doctor._id,
      status: 'completed'
    });

    const appointments = await Appointment.find({ doctor: doctor._id, status: 'completed' });
    const totalEarnings = appointments.reduce((sum, a) => sum + (a.fee || 0), 0);

    return res.json({
      doctor,
      stats: {
        totalAppointments,
        todayAppointments,
        upcomingAppointments,
        completedAppointments,
        totalEarnings
      }
    });
  } catch (error) {
    console.error('getDoctorStats error:', error);
    return res.status(500).json({ message: error.message || 'Error loading dashboard statistics' });
  }
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  getDoctorAvailableSlots,
  updateDoctorProfile,
  getDoctorStats
};
