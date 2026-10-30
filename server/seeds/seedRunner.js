const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Department = require('../models/Department');
const Appointment = require('../models/Appointment');
const { departmentsData, doctorsData } = require('./seedData');

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/book_a_doctor';
    console.log(`[Seed] Connecting to MongoDB at ${mongoUri}...`);
    await mongoose.connect(mongoUri);

    console.log('[Seed] Clearing existing collections...');
    await User.deleteMany({});
    await Doctor.deleteMany({});
    await Department.deleteMany({});
    await Appointment.deleteMany({});

    console.log('[Seed] Inserting departments...');
    const createdDepts = await Department.insertMany(departmentsData);
    console.log(`[Seed] Inserted ${createdDepts.length} departments.`);

    console.log('[Seed] Creating Admin account...');
    const adminUser = await User.create({
      name: 'System Administrator',
      email: 'admin@pulsecare.com',
      password: 'admin123',
      role: 'admin',
      phone: '+1 (555) 000-0001',
      address: 'PulseCare HQ, Suite 100, New York, NY',
      isActive: true
    });

    console.log('[Seed] Creating demo patient accounts...');
    const demoPatient1 = await User.create({
      name: 'Sarah Jenkins',
      email: 'patient@pulsecare.com',
      password: 'patient123',
      role: 'patient',
      phone: '+1 (555) 234-5678',
      address: '742 Evergreen Terrace, Springfield, IL',
      patientDetails: {
        bloodGroup: 'O+',
        age: 29,
        gender: 'Female',
        emergencyContact: '+1 (555) 999-1234 (Brother: David Jenkins)',
        medicalHistory: 'Mild seasonal allergies. No history of cardiovascular or chronic conditions.'
      },
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      isActive: true
    });

    const demoPatient2 = await User.create({
      name: 'Michael Chang',
      email: 'patient2@pulsecare.com',
      password: 'patient123',
      role: 'patient',
      phone: '+1 (555) 876-5432',
      address: '108 Ocean Avenue, Santa Monica, CA',
      patientDetails: {
        bloodGroup: 'A+',
        age: 36,
        gender: 'Male',
        emergencyContact: '+1 (555) 333-8888 (Spouse: Lily Chang)',
        medicalHistory: 'Mild hypertension controlled with dietary lifestyle.'
      },
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      isActive: true
    });

    console.log('[Seed] Creating 10 demo doctor accounts and profiles...');
    const createdDoctors = [];
    for (const doc of doctorsData) {
      const docUser = await User.create({
        name: doc.name,
        email: doc.email,
        password: 'doctor123',
        role: 'doctor',
        phone: doc.phone,
        address: `${doc.clinicAddress.street}, ${doc.clinicAddress.city}, ${doc.clinicAddress.state}`,
        avatar: doc.avatar,
        isActive: true
      });

      const doctorProfile = await Doctor.create({
        ...doc,
        user: docUser._id,
        isApproved: true,
        isActive: true
      });

      createdDoctors.push(doctorProfile);
    }
    console.log(`[Seed] Inserted ${createdDoctors.length} doctors.`);

    console.log('[Seed] Creating sample appointments...');
    // Tomorrow's date formatted as YYYY-MM-DD
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    // Day after tomorrow
    const nextDay = new Date();
    nextDay.setDate(nextDay.getDate() + 2);
    const nextDayStr = nextDay.toISOString().split('T')[0];

    // Past date (3 days ago)
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 3);
    const pastDateStr = pastDate.toISOString().split('T')[0];

    // Appointment 1: Confirmed upcoming for Sarah Jenkins with Dr. Evelyn Carter
    await Appointment.create({
      patient: demoPatient1._id,
      doctor: createdDoctors[0]._id, // Dr. Evelyn Carter
      appointmentDate: tomorrowStr,
      timeSlot: '10:00 AM',
      reason: 'Routine cardiovascular checkup and resting ECG assessment.',
      symptoms: 'Mild shortness of breath during brisk morning jogs.',
      fee: createdDoctors[0].consultationFee,
      paymentStatus: 'paid',
      paymentMethod: 'Credit Card',
      status: 'confirmed',
      medicalReports: [
        {
          fileName: 'sample_ecg_report.pdf',
          originalName: 'Previous_Annual_ECG_2025.pdf',
          fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          fileType: 'application/pdf',
          uploadedAt: new Date()
        }
      ]
    });

    // Appointment 2: Completed appointment with prescription for Sarah Jenkins with Dr. Robert Sterling
    await Appointment.create({
      patient: demoPatient1._id,
      doctor: createdDoctors[5]._id, // Dr. Robert Sterling
      appointmentDate: pastDateStr,
      timeSlot: '09:30 AM',
      reason: 'Persistent seasonal allergies and throat irritation.',
      symptoms: 'Sneezing, itchy eyes, dry cough in the evenings.',
      fee: createdDoctors[5].consultationFee,
      paymentStatus: 'paid',
      paymentMethod: 'Online / Card',
      status: 'completed',
      prescription: {
        diagnosis: 'Seasonal Allergic Rhinitis with mild pharyngeal irritation',
        notes: 'Advised daily saline nasal rinse, adequate hydration, and limiting pollen exposure during morning hours. Follow up in 3 weeks if symptoms persist.',
        medicines: [
          {
            name: 'Cetirizine Hydrochloride 10mg',
            dosage: '1 tablet',
            frequency: 'Once daily at bedtime',
            duration: '10 days',
            instructions: 'Take with water after dinner'
          },
          {
            name: 'Fluticasone Propionate Nasal Spray 50mcg',
            dosage: '2 sprays per nostril',
            frequency: 'Once daily in the morning',
            duration: '14 days',
            instructions: 'Shake bottle gently before spraying'
          }
        ],
        issuedAt: pastDate,
        doctorName: createdDoctors[5].name
      }
    });

    // Appointment 3: Confirmed upcoming for Michael Chang with Dr. Marcus Vance
    await Appointment.create({
      patient: demoPatient2._id,
      doctor: createdDoctors[1]._id, // Dr. Marcus Vance
      appointmentDate: nextDayStr,
      timeSlot: '11:00 AM',
      reason: 'Frequent migraine episodes and screen fatigue evaluation.',
      symptoms: 'Throbbing pain behind left eye, sensitivity to bright light.',
      fee: createdDoctors[1].consultationFee,
      paymentStatus: 'paid',
      paymentMethod: 'Health Savings Account',
      status: 'confirmed'
    });

    console.log('[Seed] Sample appointments successfully created.');
    console.log('====================================================');
    console.log(' [PulseCare Demo Credentials Summary]');
    console.log(' - Admin:   admin@pulsecare.com   / admin123');
    console.log(' - Patient: patient@pulsecare.com / patient123');
    console.log(' - Doctor:  dr.carter@pulsecare.com / doctor123');
    console.log('   (Any seeded doctor email works with: doctor123)');
    console.log('====================================================');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDatabase();
