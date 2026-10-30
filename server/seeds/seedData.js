const departmentsData = [
  {
    name: 'Cardiology',
    description: 'Comprehensive heart & cardiovascular care, ECG diagnostics, coronary care and interventions.',
    icon: 'bi-heart-pulse-fill',
    image: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Neurology',
    description: 'Expert diagnosis and therapy for brain, spine, neuropathy, and complex nervous system disorders.',
    icon: 'bi-diagram-3-fill',
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Pediatrics',
    description: 'Specialized healthcare, immunization, wellness monitoring and pediatric care for infants and kids.',
    icon: 'bi-emoji-smile-fill',
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Orthopedics',
    description: 'Bone, joint, spinal health, ligament repair, joint replacements, and sports injury therapies.',
    icon: 'bi-bandaid-fill',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Dermatology',
    description: 'Clinical and cosmetic skin, hair, and nail health, allergy therapies, and eczema treatments.',
    icon: 'bi-stars',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'General Medicine',
    description: 'Primary care, family medicine, chronic disease management, and preventative health checks.',
    icon: 'bi-capsule',
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Ophthalmology',
    description: 'Advanced vision screening, glaucoma care, diabetic retinopathy, and surgical eye care.',
    icon: 'bi-eye-fill',
    image: 'https://images.unsplash.com/photo-1579684453423-f84349ef60b0?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Gynecology',
    description: "Comprehensive women's wellness, prenatal care, obstetrics, and reproductive healthcare.",
    icon: 'bi-gender-female',
    image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=600&q=80'
  }
];

const doctorsData = [
  {
    name: 'Dr. Evelyn Carter',
    email: 'dr.carter@pulsecare.com',
    phone: '+1 (555) 101-2001',
    department: 'Cardiology',
    specialization: 'Interventional Cardiologist',
    qualifications: 'MBBS, MD (Cardiology), FACC',
    experienceYears: 14,
    consultationFee: 120,
    clinicAddress: {
      hospitalName: 'PulseCare Central Heart Pavilion',
      street: '742 Heartbeat Boulevard, Suite 400',
      city: 'New York',
      state: 'NY',
      zipCode: '10021'
    },
    bio: 'Dr. Evelyn Carter is a board-certified interventional cardiologist with over 14 years of experience diagnosing complex arrhythmias, coronary conditions, and hypertension.',
    avatar: 'https://images.unsplash.com/photo-1594824813629-450f61205be8?auto=format&fit=crop&w=500&q=80',
    rating: 4.9,
    reviewCount: 94,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    timeSlots: {
      startTime: '09:00',
      endTime: '17:00',
      slotDurationMinutes: 30,
      breakStartTime: '13:00',
      breakEndTime: '14:00'
    }
  },
  {
    name: 'Dr. Marcus Vance',
    email: 'dr.vance@pulsecare.com',
    phone: '+1 (555) 101-2002',
    department: 'Neurology',
    specialization: 'Cognitive Neurologist & Spine Specialist',
    qualifications: 'MBBS, MD, DM (Neurology), FAAN',
    experienceYears: 16,
    consultationFee: 150,
    clinicAddress: {
      hospitalName: 'St. Jude Neuro & Spine Institute',
      street: '150 Neuro Parkway, 3rd Floor',
      city: 'Boston',
      state: 'MA',
      zipCode: '02115'
    },
    bio: 'Dr. Marcus Vance specializes in headache disorders, Parkinsonian syndromes, epilepsy management, and traumatic brain injury recovery protocols.',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=500&q=80',
    rating: 4.8,
    reviewCount: 78,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    timeSlots: {
      startTime: '09:30',
      endTime: '16:30',
      slotDurationMinutes: 30,
      breakStartTime: '13:00',
      breakEndTime: '14:00'
    }
  },
  {
    name: 'Dr. Sophia Ramirez',
    email: 'dr.ramirez@pulsecare.com',
    phone: '+1 (555) 101-2003',
    department: 'Pediatrics',
    specialization: 'Pediatrician & Neonatologist',
    qualifications: 'MBBS, MD (Pediatrics), FAAP',
    experienceYears: 9,
    consultationFee: 80,
    clinicAddress: {
      hospitalName: 'PulseCare Children & Infant Wellness',
      street: '22 Blossom Way, Suite 101',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60611'
    },
    bio: 'Dr. Sophia Ramirez is dedicated to nurturing child development from newborns through teenage milestones, specializing in preventive health and childhood allergies.',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=500&q=80',
    rating: 4.9,
    reviewCount: 112,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Friday', 'Saturday'],
    timeSlots: {
      startTime: '08:30',
      endTime: '15:30',
      slotDurationMinutes: 30,
      breakStartTime: '12:30',
      breakEndTime: '13:30'
    }
  },
  {
    name: 'Dr. Liam Thorne',
    email: 'dr.thorne@pulsecare.com',
    phone: '+1 (555) 101-2004',
    department: 'Orthopedics',
    specialization: 'Orthopedic Surgeon & Sports Medicine',
    qualifications: 'MBBS, MS (Orthopedics), FRCS',
    experienceYears: 13,
    consultationFee: 135,
    clinicAddress: {
      hospitalName: 'Apex Orthopedic & Motion Clinic',
      street: '88 Sports Haven Boulevard',
      city: 'Dallas',
      state: 'TX',
      zipCode: '75201'
    },
    bio: 'Dr. Liam Thorne is a renowned orthopedic specialist focusing on knee arthroscopy, rotator cuff repair, cartilage restoration, and minimally invasive joint procedures.',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=500&q=80',
    rating: 4.8,
    reviewCount: 65,
    workingDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    timeSlots: {
      startTime: '09:00',
      endTime: '17:00',
      slotDurationMinutes: 30,
      breakStartTime: '13:00',
      breakEndTime: '14:00'
    }
  },
  {
    name: 'Dr. Maya Patel',
    email: 'dr.patel@pulsecare.com',
    phone: '+1 (555) 101-2005',
    department: 'Dermatology',
    specialization: 'Consultant Dermatologist & Cosmetologist',
    qualifications: 'MBBS, MD (Dermatology & Venereology)',
    experienceYears: 11,
    consultationFee: 95,
    clinicAddress: {
      hospitalName: 'Radiance Skin & Laser Center',
      street: '512 Park Avenue South',
      city: 'New York',
      state: 'NY',
      zipCode: '10016'
    },
    bio: 'Dr. Maya Patel provides personalized, evidence-based dermatological care for eczema, psoriasis, acne scar revision, and comprehensive skin screening.',
    avatar: 'https://images.unsplash.com/photo-1594824813606-c87a55252277?auto=format&fit=crop&w=500&q=80',
    rating: 4.9,
    reviewCount: 140,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Saturday'],
    timeSlots: {
      startTime: '10:00',
      endTime: '18:00',
      slotDurationMinutes: 30,
      breakStartTime: '14:00',
      breakEndTime: '15:00'
    }
  },
  {
    name: 'Dr. Robert Sterling',
    email: 'dr.sterling@pulsecare.com',
    phone: '+1 (555) 101-2006',
    department: 'General Medicine',
    specialization: 'Family Medicine & Internal Medicine',
    qualifications: 'MBBS, MD (General Medicine), FACP',
    experienceYears: 20,
    consultationFee: 70,
    clinicAddress: {
      hospitalName: 'PulseCare Community Health Hub',
      street: '340 Elm Street, Suite 12',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101'
    },
    bio: 'Dr. Robert Sterling has two decades of experience providing empathetic primary care, managing diabetes, hypertension, preventive immunizations, and annual physicals.',
    avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=500&q=80',
    rating: 4.9,
    reviewCount: 185,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    timeSlots: {
      startTime: '08:00',
      endTime: '16:00',
      slotDurationMinutes: 30,
      breakStartTime: '12:00',
      breakEndTime: '13:00'
    }
  },
  {
    name: 'Dr. Clara Zimmerman',
    email: 'dr.zimmerman@pulsecare.com',
    phone: '+1 (555) 101-2007',
    department: 'Ophthalmology',
    specialization: 'Cornea, Refractive Surgery & Glaucoma',
    qualifications: 'MBBS, MS (Ophthalmology), FACS',
    experienceYears: 12,
    consultationFee: 110,
    clinicAddress: {
      hospitalName: 'ClearVision Eye Institute',
      street: '910 Vision Way, Suite 250',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94103'
    },
    bio: 'Dr. Clara Zimmerman is an ophthalmic surgeon specializing in refractive laser surgery, cataract removal with premium intraocular lenses, and early glaucoma detection.',
    avatar: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=500&q=80',
    rating: 4.8,
    reviewCount: 52,
    workingDays: ['Monday', 'Wednesday', 'Thursday', 'Friday'],
    timeSlots: {
      startTime: '09:00',
      endTime: '16:30',
      slotDurationMinutes: 30,
      breakStartTime: '13:00',
      breakEndTime: '14:00'
    }
  },
  {
    name: 'Dr. Anita Desai',
    email: 'dr.desai@pulsecare.com',
    phone: '+1 (555) 101-2008',
    department: 'Gynecology',
    specialization: 'Obstetrician & Gynecologist',
    qualifications: 'MBBS, MS (OB-GYN), FACOG',
    experienceYears: 15,
    consultationFee: 125,
    clinicAddress: {
      hospitalName: 'Harmony Women’s Wellness Center',
      street: '615 Maternity Plaza',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701'
    },
    bio: 'Dr. Anita Desai offers comprehensive gynecological exams, fertility counseling, prenatal monitoring, high-risk pregnancy guidance, and menopause management.',
    avatar: 'https://images.unsplash.com/photo-1594824813718-f2910793b8d4?auto=format&fit=crop&w=500&q=80',
    rating: 4.9,
    reviewCount: 97,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    timeSlots: {
      startTime: '09:00',
      endTime: '17:00',
      slotDurationMinutes: 30,
      breakStartTime: '13:00',
      breakEndTime: '14:00'
    }
  },
  {
    name: 'Dr. Tariq Al-Mansoor',
    email: 'dr.almansoor@pulsecare.com',
    phone: '+1 (555) 101-2009',
    department: 'Cardiology',
    specialization: 'Preventive Cardiology & Heart Failure Specialist',
    qualifications: 'MBBS, MD (Medicine), DM (Cardiology)',
    experienceYears: 10,
    consultationFee: 115,
    clinicAddress: {
      hospitalName: 'Metro Heart & Vascular Center',
      street: '202 Metro Blvd, Suite 500',
      city: 'Atlanta',
      state: 'GA',
      zipCode: '30303'
    },
    bio: 'Dr. Tariq Al-Mansoor is dedicated to lifestyle cardiovascular therapy, hypertension reversal, non-invasive imaging, and advanced cardiac rehab.',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=500&q=80',
    rating: 4.7,
    reviewCount: 43,
    workingDays: ['Monday', 'Tuesday', 'Thursday', 'Friday', 'Saturday'],
    timeSlots: {
      startTime: '09:30',
      endTime: '17:30',
      slotDurationMinutes: 30,
      breakStartTime: '13:30',
      breakEndTime: '14:30'
    }
  },
  {
    name: 'Dr. Jennifer Wu',
    email: 'dr.wu@pulsecare.com',
    phone: '+1 (555) 101-2010',
    department: 'General Medicine',
    specialization: 'Internal Medicine & Geriatric Care',
    qualifications: 'MBBS, MD, AGSF',
    experienceYears: 17,
    consultationFee: 85,
    clinicAddress: {
      hospitalName: 'Beacon Hill Wellness Clinic',
      street: '410 Beacon Street, Suite 3',
      city: 'Philadelphia',
      state: 'PA',
      zipCode: '19104'
    },
    bio: 'Dr. Jennifer Wu is an attentive internist with a passion for multi-morbidity care, adult disease prevention, polypharmacy management, and healthy aging guidance.',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=500&q=80',
    rating: 4.9,
    reviewCount: 130,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    timeSlots: {
      startTime: '08:30',
      endTime: '16:30',
      slotDurationMinutes: 30,
      breakStartTime: '12:30',
      breakEndTime: '13:30'
    }
  }
];

module.exports = {
  departmentsData,
  doctorsData
};
