const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getMyAppointments,
  getDoctorAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  cancelAppointment,
  addPrescription,
  uploadAppointmentReport
} = require('../controllers/appointmentController');
const { protect, doctorOnly, doctorOrAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Book appointment (with optional medical file upload)
router.post('/', protect, upload.array('reports', 5), createAppointment);

// Patient appointments
router.get('/my-appointments', protect, getMyAppointments);

// Doctor appointments
router.get('/doctor-appointments', protect, doctorOnly, getDoctorAppointments);

// Single appointment
router.get('/:id', protect, getAppointmentById);

// Update status
router.put('/:id/status', protect, doctorOrAdmin, updateAppointmentStatus);

// Cancel
router.put('/:id/cancel', protect, cancelAppointment);

// Issue prescription
router.post('/:id/prescription', protect, doctorOnly, addPrescription);

// Upload reports
router.post('/:id/upload-report', protect, upload.array('reports', 5), uploadAppointmentReport);

module.exports = router;
