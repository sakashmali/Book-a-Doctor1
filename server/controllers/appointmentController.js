const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private (Patient or any logged in user)
const createAppointment = async (req, res) => {
  try {
    const {
      doctorId,
      appointmentDate,
      timeSlot,
      reason,
      symptoms,
      paymentMethod = 'Online / Card'
    } = req.body;

    if (!doctorId || !appointmentDate || !timeSlot || !reason) {
      return res.status(400).json({
        message: 'Doctor, appointment date, time slot, and reason are required'
      });
    }

    // Verify doctor
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Selected doctor not found' });
    }
    if (!doctor.isActive || !doctor.isApproved) {
      return res.status(400).json({ message: 'Selected doctor is currently unavailable for bookings' });
    }

    // Date validation: ensure date is not in the past
    const todayStr = new Date().toISOString().split('T')[0];
    if (appointmentDate < todayStr) {
      return res.status(400).json({ message: 'Cannot book appointments for past dates' });
    }

    // Check duplicate booking for the doctor at that date & slot
    const existingSlotBooking = await Appointment.findOne({
      doctor: doctorId,
      appointmentDate,
      timeSlot: timeSlot.trim(),
      status: { $ne: 'cancelled' }
    });

    if (existingSlotBooking) {
      return res.status(409).json({
        message: 'This time slot is already booked for this doctor. Please select another time slot.'
      });
    }

    // Check duplicate booking for this patient at the same date & time
    const existingPatientBooking = await Appointment.findOne({
      patient: req.user._id,
      appointmentDate,
      timeSlot: timeSlot.trim(),
      status: { $ne: 'cancelled' }
    });

    if (existingPatientBooking) {
      return res.status(409).json({
        message: 'You already have an active appointment booked for this time slot.'
      });
    }

    // Process any uploaded medical report files
    const medicalReports = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        medicalReports.push({
          fileName: file.filename,
          originalName: file.originalname,
          fileUrl: `/uploads/${file.filename}`,
          fileType: file.mimetype
        });
      });
    }

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctor._id,
      appointmentDate,
      timeSlot: timeSlot.trim(),
      reason,
      symptoms: symptoms || '',
      fee: doctor.consultationFee,
      paymentStatus: 'paid',
      paymentMethod,
      status: 'confirmed',
      medicalReports
    });

    const populated = await Appointment.findById(appointment._id)
      .populate('doctor')
      .populate('patient', 'name email phone avatar patientDetails');

    return res.status(201).json(populated);
  } catch (error) {
    console.error('createAppointment error:', error);
    return res.status(500).json({ message: error.message || 'Error booking appointment' });
  }
};

// @desc    Get patient's appointments
// @route   GET /api/appointments/my-appointments
// @access  Private (Patient)
const getMyAppointments = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { patient: req.user._id };

    if (status && status !== 'all') {
      filter.status = status;
    }

    const appointments = await Appointment.find(filter)
      .populate({
        path: 'doctor',
        select: 'name email phone department specialization qualifications consultationFee clinicAddress avatar'
      })
      .sort({ appointmentDate: -1, createdAt: -1 });

    return res.json(appointments);
  } catch (error) {
    console.error('getMyAppointments error:', error);
    return res.status(500).json({ message: error.message || 'Error retrieving your appointments' });
  }
};

// @desc    Get doctor's appointments
// @route   GET /api/appointments/doctor-appointments
// @access  Private (Doctor)
const getDoctorAppointments = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found for this user' });
    }

    const { date, status } = req.query;
    const filter = { doctor: doctor._id };

    if (date) {
      filter.appointmentDate = date;
    }
    if (status && status !== 'all') {
      filter.status = status;
    }

    const appointments = await Appointment.find(filter)
      .populate('patient', 'name email phone avatar address patientDetails')
      .sort({ appointmentDate: 1, timeSlot: 1 });

    return res.json(appointments);
  } catch (error) {
    console.error('getDoctorAppointments error:', error);
    return res.status(500).json({ message: error.message || 'Error retrieving doctor appointments' });
  }
};

// @desc    Get single appointment details
// @route   GET /api/appointments/:id
// @access  Private
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('doctor')
      .populate('patient', 'name email phone avatar address patientDetails');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Security check: only the patient, the doctor, or an admin can view
    const isPatient = appointment.patient._id.toString() === req.user._id.toString();
    const doctorObj = await Doctor.findOne({ user: req.user._id });
    const isDoctor = doctorObj && appointment.doctor._id.toString() === doctorObj._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isPatient && !isDoctor && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view this appointment' });
    }

    return res.json(appointment);
  } catch (error) {
    console.error('getAppointmentById error:', error);
    return res.status(500).json({ message: error.message || 'Error retrieving appointment' });
  }
};

// @desc    Update appointment status (Doctor / Admin)
// @route   PUT /api/appointments/:id/status
// @access  Private (Doctor or Admin)
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Verify permission
    if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ user: req.user._id });
      if (!doctor || appointment.doctor.toString() !== doctor._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this appointment' });
      }
    }

    appointment.status = status;
    if (status === 'cancelled') {
      appointment.cancelledBy = req.user.role;
      appointment.cancellationReason = req.body.cancellationReason || 'Cancelled by ' + req.user.role;
    }

    await appointment.save();

    const updated = await Appointment.findById(appointment._id)
      .populate('doctor')
      .populate('patient', 'name email phone avatar patientDetails');

    return res.json(updated);
  } catch (error) {
    console.error('updateAppointmentStatus error:', error);
    return res.status(500).json({ message: error.message || 'Error updating appointment status' });
  }
};

// @desc    Cancel appointment (Patient, Doctor, or Admin)
// @route   PUT /api/appointments/:id/cancel
// @access  Private
const cancelAppointment = async (req, res) => {
  try {
    const { reason = 'Cancelled by user' } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.status === 'cancelled') {
      return res.status(400).json({ message: 'Appointment is already cancelled' });
    }

    if (appointment.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel an already completed appointment' });
    }

    // Check ownership
    const isPatient = appointment.patient.toString() === req.user._id.toString();
    const doctorObj = await Doctor.findOne({ user: req.user._id });
    const isDoctor = doctorObj && appointment.doctor.toString() === doctorObj._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isPatient && !isDoctor && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to cancel this appointment' });
    }

    appointment.status = 'cancelled';
    appointment.cancellationReason = reason;
    appointment.cancelledBy = req.user.role;

    await appointment.save();

    const updated = await Appointment.findById(appointment._id)
      .populate('doctor')
      .populate('patient', 'name email phone avatar');

    return res.json({ message: 'Appointment successfully cancelled', appointment: updated });
  } catch (error) {
    console.error('cancelAppointment error:', error);
    return res.status(500).json({ message: error.message || 'Error cancelling appointment' });
  }
};

// @desc    Add or update prescription (Doctor only)
// @route   POST /api/appointments/:id/prescription
// @access  Private (Doctor)
const addPrescription = async (req, res) => {
  try {
    const { diagnosis, notes, medicines = [], markCompleted = true } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor || appointment.doctor.toString() !== doctor._id.toString()) {
      return res.status(403).json({ message: 'Only the assigned doctor can issue prescriptions' });
    }

    appointment.prescription = {
      diagnosis: diagnosis || '',
      notes: notes || '',
      medicines: Array.isArray(medicines) ? medicines : [],
      issuedAt: new Date(),
      doctorName: doctor.name
    };

    if (markCompleted) {
      appointment.status = 'completed';
    }

    await appointment.save();

    const updated = await Appointment.findById(appointment._id)
      .populate('doctor')
      .populate('patient', 'name email phone avatar patientDetails');

    return res.json({ message: 'Prescription recorded successfully', appointment: updated });
  } catch (error) {
    console.error('addPrescription error:', error);
    return res.status(500).json({ message: error.message || 'Error saving prescription' });
  }
};

// @desc    Upload medical reports to an appointment
// @route   POST /api/appointments/:id/upload-report
// @access  Private
const uploadAppointmentReport = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (!req.file && (!req.files || req.files.length === 0)) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const files = req.files || [req.file];
    files.forEach((file) => {
      appointment.medicalReports.push({
        fileName: file.filename,
        originalName: file.originalname,
        fileUrl: `/uploads/${file.filename}`,
        fileType: file.mimetype,
        uploadedAt: new Date()
      });
    });

    await appointment.save();

    return res.json({
      message: 'Medical report(s) uploaded successfully',
      reports: appointment.medicalReports
    });
  } catch (error) {
    console.error('uploadAppointmentReport error:', error);
    return res.status(500).json({ message: error.message || 'Error uploading medical report' });
  }
};

module.exports = {
  createAppointment,
  getMyAppointments,
  getDoctorAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  cancelAppointment,
  addPrescription,
  uploadAppointmentReport
};
