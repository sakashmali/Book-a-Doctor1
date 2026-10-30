const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAdminDoctors,
  setDoctorApproval,
  toggleDoctorActive,
  getAdminPatients,
  togglePatientActive,
  getAdminAppointments
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// All routes here require Admin role
router.use(protect, adminOnly);

router.get('/stats', getAdminStats);
router.get('/doctors', getAdminDoctors);
router.put('/doctors/:id/approval', setDoctorApproval);
router.put('/doctors/:id/toggle-status', toggleDoctorActive);
router.get('/patients', getAdminPatients);
router.put('/patients/:id/toggle-status', togglePatientActive);
router.get('/appointments', getAdminAppointments);

module.exports = router;
