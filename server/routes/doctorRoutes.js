const express = require('express');
const router = express.Router();
const {
  getAllDoctors,
  getDoctorById,
  getDoctorAvailableSlots,
  updateDoctorProfile,
  getDoctorStats
} = require('../controllers/doctorController');
const { protect, doctorOnly } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllDoctors);
router.get('/:id/available-slots', getDoctorAvailableSlots);
router.get('/:id', getDoctorById);

// Doctor Dashboard routes
router.get('/dashboard/stats', protect, doctorOnly, getDoctorStats);
router.put('/profile', protect, doctorOnly, updateDoctorProfile);

module.exports = router;
