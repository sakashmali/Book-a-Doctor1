# PulseCare — Modern Doctor Booking & Healthcare Portal (MERN Stack)

A complete, production-ready, full-stack **Book a Doctor** web application built with the **MERN Stack** (React.js + Vite, Node.js, Express.js, MongoDB, Mongoose) styled with modern CSS and Bootstrap 5.

![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)
![React](https://img.shields.io/badge/React-19.x%20%7C%20Vite-61dafb.svg)
![Node.js](https://img.shields.io/badge/Node.js-Express%205-green.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen.svg)
![License](https://img.shields.io/badge/License-MIT-orange.svg)

---

## 🌟 Key Features

### 1. Modern Healthcare UI & Public Portal
- Responsive healthcare website with high-performance UI components.
- Hero search bar with instant query filtering by doctor name, specialty, or clinic location.
- Interactive **Departments Directory** featuring 8 clinical specialties (Cardiology, Neurology, Pediatrics, Orthopedics, Dermatology, General Medicine, Ophthalmology, Gynecology).
- 24/7 Emergency response helpline and clinical information.

### 2. Patient Registration, Health Profile & Dashboard
- Patient registration, secure authentication, and profile management.
- Health record profile tracking blood group, age, gender, and emergency contacts.
- Real-time status tracking for **Upcoming**, **Completed**, and **Cancelled** visits.
- Digital prescription viewer with medication dosages, instructions, and doctor's advice.
- Secure upload of past medical documents (PDFs, lab reports, test scans).

### 3. Doctor Discovery & Interactive Booking System
- **10+ Certified Demo Doctors** with detailed credentials, fees ($50–$150), clinic addresses, ratings, and bios.
- **Dynamic Slot Generation**: Generates live available intervals based on doctor's custom operating days and hours.
- **Duplicate Booking Prevention**: Strict conflict detection prevents double booking of slots and overlapping patient appointments.
- Instant booking confirmation slip and appointment receipt.

### 4. Doctor Dashboard & Clinical Portal
- Overview analytics: Today's visits, Upcoming appointments, Completed checkups, and Total clinical revenue.
- Appointment Management: Filter by date/status, view patient history, and access patient-uploaded test scans.
- **Digital Prescription Writer**: Diagnosis entry, dynamic medication rows (Dosage, Frequency, Duration, Instructions), and clinical advice.
- **Practice Availability Manager**: Custom toggle for working days (Monday–Sunday) and operating hours with instant slot generation updates.

### 5. Admin Dashboard & Compliance Console
- System metrics: Total patients, approved doctors, pending applications, appointments, and total platform revenue.
- **Doctor Licensing & Approval**: Review new doctor applications and grant or revoke practice permissions.
- **Patient Account Controls**: Track booking activity and toggle account status.
- **Department Manager**: Add, edit, or delete medical departments and specialty icons.
- **Appointments Master**: System-wide oversight to monitor, reassign, or cancel appointments.

### 6. Security, Authentication & File Uploads
- **JWT Authentication** with role-based route protection (`patient`, `doctor`, `admin`).
- **bcryptjs** password hashing (10 salt rounds).
- **Multer** file upload pipeline with MIME-type filtering (PDF, PNG, JPG, DOCX) and 10MB size limits.
- Modular code architecture separating `client` and `server`.

---

## 🔑 Demo Login Credentials

The login page includes **1-Click Quick Demo Login** buttons for immediate testing:

| Role | Email | Password | Access & Features |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin@pulsecare.com` | `admin123` | Doctor approvals, department CRUD, system stats |
| **Doctor** | `dr.carter@pulsecare.com` | `doctor123` | Availability scheduler, write prescriptions, view visits |
| **Patient** | `patient@pulsecare.com` | `patient123` | Book doctors, upload lab reports, view prescriptions |
| **Patient 2** | `patient2@pulsecare.com` | `patient123` | Second demo patient account |

> *Note: Any of the 10 seeded doctors can log in using their email and the password `doctor123`.*

---

## 📁 Project Directory Structure

```text
Doctor/
├── package.json               # Root scripts
├── .gitignore                 # Secrets & build exclusion
├── README.md                  # Comprehensive documentation
├── server/                    # Node.js + Express Backend
│   ├── config/
│   │   └── db.js              # MongoDB connection handler
│   ├── controllers/
│   │   ├── authController.js        # Register, login, profile
│   │   ├── doctorController.js      # Search, filter, availability slots
│   │   ├── appointmentController.js # Booking, duplicate check, prescriptions
│   │   ├── departmentController.js  # Department CRUD
│   │   └── adminController.js       # Stats, doctor approval, patient management
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT verification & role authorization
│   │   ├── uploadMiddleware.js # Multer file upload validation
│   │   └── errorMiddleware.js  # 404 & centralized error handler
│   ├── models/
│   │   ├── User.js            # User schema (Patient, Doctor, Admin)
│   │   ├── Doctor.js          # Doctor profile, clinic, and availability
│   │   ├── Department.js      # Medical specialty divisions
│   │   └── Appointment.js     # Booking schema with prescription & reports
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── doctorRoutes.js
│   │   ├── appointmentRoutes.js
│   │   ├── departmentRoutes.js
│   │   └── adminRoutes.js
│   ├── seeds/
│   │   ├── seedData.js        # 10 realistic doctors & 8 departments
│   │   └── seedRunner.js      # Seeding script
│   ├── uploads/               # Stored medical reports & prescriptions
│   ├── .env                   # Environment config (gitignored)
│   ├── .env.example           # Example config template
│   ├── server.js              # Express app entry point
│   └── package.json
└── client/                    # React.js + Vite Frontend (JavaScript only)
    ├── src/
    │   ├── components/
    │   │   ├── common/        # Navbar, Footer, ProtectedRoute
    │   │   ├── booking/       # BookingModal (slots, reports, duplicate validation)
    │   │   └── doctor/        # DoctorCard, DoctorFilterBar
    │   ├── context/
    │   │   └── AuthContext.jsx # Global JWT authentication state
    │   ├── pages/
    │   │   ├── Home.jsx             # Hero, departments, featured doctors
    │   │   ├── DoctorsPage.jsx      # Doctor search & multi-filter
    │   │   ├── DoctorDetailPage.jsx # Doctor profile & embedded booking
    │   │   ├── DepartmentsPage.jsx  # Department overview
    │   │   ├── LoginPage.jsx        # Sign in with 1-click demo buttons
    │   │   ├── RegisterPage.jsx     # Patient / Doctor registration
    │   │   ├── PatientDashboard.jsx # Consultations, reports & prescriptions
    │   │   ├── DoctorDashboard.jsx  # Visits, slot schedule & Rx writer
    │   │   ├── AdminDashboard.jsx   # Metrics, approvals & department editor
    │   │   └── NotFound.jsx         # 404 handler
    │   ├── services/
    │   │   └── api.js         # Axios instance with JWT interceptors
    │   ├── App.jsx            # Router and layout
    │   ├── main.jsx           # React DOM root
    │   ├── App.css
    │   └── index.css          # Bootstrap 5 & custom healthcare design
    ├── vite.config.js         # Vite configuration with backend proxy
    ├── index.html
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **MongoDB** running locally on port `27017` (e.g. `mongodb://127.0.0.1:27017`) or a MongoDB Atlas URI.

---

### Step 1: Clone and Setup Environment

1. Navigate to the `server` directory and copy the environment template:
   ```bash
   cd server
   cp .env.example .env
   ```

2. Verify or update `server/.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/book_a_doctor
   JWT_SECRET=supersecretjwtkey_bookadoctor_2026_pulse
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```

---

### Step 2: Install Dependencies & Seed Demo Data

1. **Install Server Packages & Seed Database**:
   ```bash
   cd server
   npm install
   npm run seed
   ```
   *The seed command populates 8 departments, 10 certified doctors with full profiles, demo patients, and sample appointments.*

2. **Install Client Packages**:
   ```bash
   cd ../client
   npm install
   ```

---

### Step 3: Run the Application

#### Terminal 1 — Start the Backend Server:
```bash
cd server
npm start
```
The backend API starts on **http://localhost:5000**.

#### Terminal 2 — Start the Frontend Development Server:
```bash
cd client
npm run dev
```
The React application starts on **http://localhost:5173**.

Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 🧪 Testing the Application

1. **Browse Doctors**:
   - Visit the home page or click **Find Doctors**.
   - Filter by specialty (e.g. *Cardiology*), search by doctor name, or sort by consultation fee.
2. **Book a Consultation**:
   - Click **Book Consultation** on any doctor card.
   - Pick a date and view the dynamically generated real-time time slots.
   - Enter consultation reason and optionally attach a medical file.
   - Submit to receive an instant confirmed appointment receipt.
   - *Duplicate check test*: Attempting to book the same slot twice triggers a conflict alert and prevents duplicate entries.
3. **Doctor Portal**:
   - Log in as `dr.carter@pulsecare.com` (or click **Doctor Demo** on login).
   - View scheduled patients, inspect uploaded reports, and click **Rx** to issue a digital prescription with medication dosages and advice.
   - Switch to the **Availability & Profile** tab to toggle working days or update fees.
4. **Admin Console**:
   - Log in as `admin@pulsecare.com` (or click **Admin Demo** on login).
   - Review platform statistics and total revenue.
   - Approve or revoke doctor licenses.
   - Manage patient accounts and create new medical departments.

---

## 🔒 GitHub Upload & Security Notes
- `server/.env` is strictly excluded via `.gitignore`.
- Uploaded medical files in `server/uploads/` are excluded from version control while preserving directory structure with `.gitkeep`.
- Production build verified with `npm run build` in `client`.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
