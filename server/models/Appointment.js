const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true
    },
    appointmentDate: {
      type: String, // YYYY-MM-DD
      required: [true, 'Appointment date is required']
    },
    timeSlot: {
      type: String, // e.g. "10:30 AM"
      required: [true, 'Time slot is required']
    },
    reason: {
      type: String,
      required: [true, 'Reason for appointment is required'],
      trim: true
    },
    symptoms: {
      type: String,
      default: ''
    },
    fee: {
      type: Number,
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'paid'
    },
    paymentMethod: {
      type: String,
      default: 'Online / Card'
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'confirmed'
    },
    cancellationReason: {
      type: String,
      default: ''
    },
    cancelledBy: {
      type: String,
      enum: ['patient', 'doctor', 'admin', null],
      default: null
    },
    medicalReports: [
      {
        fileName: { type: String, required: true },
        originalName: { type: String, required: true },
        fileUrl: { type: String, required: true },
        fileType: { type: String, default: 'document' },
        uploadedAt: { type: Date, default: Date.now }
      }
    ],
    prescription: {
      diagnosis: { type: String, default: '' },
      notes: { type: String, default: '' },
      medicines: [
        {
          name: { type: String, required: true },
          dosage: { type: String, default: '1 tablet' },
          frequency: { type: String, default: 'Twice daily' },
          duration: { type: String, default: '5 days' },
          instructions: { type: String, default: 'After meals' }
        }
      ],
      issuedAt: { type: Date, default: null },
      doctorName: { type: String, default: '' }
    }
  },
  { timestamps: true }
);

// Compound index to help fast lookup of doctor's slot on a given date
appointmentSchema.index({ doctor: 1, appointmentDate: 1, timeSlot: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
