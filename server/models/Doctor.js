const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: [true, 'Doctor name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      default: ''
    },
    department: {
      type: String,
      required: [true, 'Department is required']
    },
    specialization: {
      type: String,
      required: [true, 'Specialization is required']
    },
    qualifications: {
      type: String,
      default: 'MBBS, MD'
    },
    experienceYears: {
      type: Number,
      required: [true, 'Experience in years is required'],
      min: 0
    },
    consultationFee: {
      type: Number,
      required: [true, 'Consultation fee is required'],
      min: 0
    },
    clinicAddress: {
      hospitalName: { type: String, default: 'PulseCare Medical Center' },
      street: { type: String, default: '45 Health Avenue' },
      city: { type: String, default: 'New York' },
      state: { type: String, default: 'NY' },
      zipCode: { type: String, default: '10001' }
    },
    bio: {
      type: String,
      default: ''
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80'
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5
    },
    reviewCount: {
      type: Number,
      default: 18
    },
    workingDays: {
      type: [String],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    },
    timeSlots: {
      startTime: { type: String, default: '09:00' },
      endTime: { type: String, default: '17:00' },
      slotDurationMinutes: { type: Number, default: 30 },
      breakStartTime: { type: String, default: '13:00' },
      breakEndTime: { type: String, default: '14:00' }
    },
    isApproved: {
      type: Boolean,
      default: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Doctor', doctorSchema);
