const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Doctor = require('../models/Doctor');

// Helper to generate JWT
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'supersecretjwtkey_bookadoctor_2026_pulse',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new user (Patient or Doctor)
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role = 'patient',
      phone,
      address,
      patientDetails,
      doctorDetails
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'A user with this email already exists' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: role === 'doctor' ? 'doctor' : 'patient',
      phone: phone || '',
      address: address || '',
      patientDetails: patientDetails || {}
    });

    let doctorProfile = null;
    if (user.role === 'doctor') {
      const docData = doctorDetails || {};
      doctorProfile = await Doctor.create({
        user: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        department: docData.department || 'General Medicine',
        specialization: docData.specialization || 'General Practitioner',
        qualifications: docData.qualifications || 'MBBS',
        experienceYears: Number(docData.experienceYears) || 3,
        consultationFee: Number(docData.consultationFee) || 50,
        clinicAddress: docData.clinicAddress || {
          hospitalName: 'PulseCare Health Clinic',
          street: '12 Medical Lane',
          city: 'New York',
          state: 'NY',
          zipCode: '10001'
        },
        bio: docData.bio || 'Dedicated medical practitioner focused on preventive healthcare.',
        isApproved: false // Newly registered doctors require admin approval
      });
    }

    const token = generateToken(user._id, user.role);

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      avatar: user.avatar,
      patientDetails: user.patientDetails,
      doctorProfile: doctorProfile ? doctorProfile._id : null,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: error.message || 'Server error during registration' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Your account has been deactivated. Please contact support.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    let doctorProfile = null;
    if (user.role === 'doctor') {
      doctorProfile = await Doctor.findOne({ user: user._id });
    }

    const token = generateToken(user._id, user.role);

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      avatar: user.avatar,
      patientDetails: user.patientDetails,
      doctorProfile: doctorProfile || null,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: error.message || 'Server error during login' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let doctorProfile = null;
    if (user.role === 'doctor') {
      doctorProfile = await Doctor.findOne({ user: user._id });
    }

    return res.json({
      ...user.toObject(),
      doctorProfile
    });
  } catch (error) {
    console.error('getMe error:', error);
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Update current user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
    user.address = req.body.address !== undefined ? req.body.address : user.address;
    user.avatar = req.body.avatar !== undefined ? req.body.avatar : user.avatar;

    if (req.body.patientDetails) {
      user.patientDetails = {
        ...user.patientDetails,
        ...req.body.patientDetails
      };
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    let doctorProfile = null;
    if (updatedUser.role === 'doctor') {
      doctorProfile = await Doctor.findOne({ user: updatedUser._id });
    }

    return res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
      address: updatedUser.address,
      avatar: updatedUser.avatar,
      patientDetails: updatedUser.patientDetails,
      doctorProfile
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ message: error.message || 'Server error updating profile' });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile
};
