# PulseCare — Modern Doctor Appointment Booking Web Application (MERN Stack)

A complete, full-stack **Book a Doctor Appointment** web application designed for academic evaluation and production-grade demonstration. Built strictly with **JavaScript (React.js, Vite, Node.js, Express.js, MongoDB / MongoDB Atlas)**, styled with modern responsive CSS and Bootstrap 5.

> **Strict Compliance Guarantee:**  
> - 100% JavaScript (`.js` and `.jsx`).  
> - **Zero** TypeScript (`.ts`, `.tsx`) and **Zero** Python (`.py`).  
> - Clean modular separation: `client/` (Frontend) and `server/` (Backend).  
> - Ready for GitHub upload with `.gitignore` and `.env.example` templates protecting credentials.

---

## 🌟 Key Application Features

1. **Hospital Home Page & Modern Design**:
   - High-performance UI with hospital emergency banner, medical statistics, and fast specialist lookup.
   - Fully responsive for mobile phones, tablets, and desktop displays.
2. **Patient Registration & Login**:
   - Secure patient registration with name, email, password (bcrypt hashed), contact number, and address.
   - JWT-based authentication with auto-refresh and protected routes.
3. **10 Certified Doctors**:
   - 10 board-certified physicians with qualifications (MBBS, MD, MS, DM, FACC, FAAN), years of experience, clinic addresses, ratings, and consultation fees ($70–$150).
4. **10 Medical Departments**:
   - 10 distinct specialties: **Cardiology**, **Neurology**, **Pediatrics**, **Orthopedics**, **Dermatology**, **General Medicine**, **Ophthalmology**, **Gynecology**, **Oncology**, and **ENT (Ear, Nose & Throat)**.
5. **Doctor Search & Department Filters**:
   - Live query search by doctor name, specialty, condition, or hospital.
   - Multi-filter dropdown by department, experience, and fee sorting (Low to High / High to Low).
6. **Complete Appointment Booking**:
   - Interactive booking modal collecting all 9 required fields:
     - **Patient Name**
     - **Mobile Number**
     - **Email Address**
     - **Residential Address**
     - **Medical Department**
     - **Doctor Name**
     - **Appointment Date** (with past-date validation)
     - **Time Slot** (real-time slot availability generation)
     - **Reason for Visit** (& optional symptoms description)
   - **Duplicate-Booking Prevention**: Prevents double-booking the same doctor at the same slot and alerts the patient immediately.
   - **Medical Document Upload**: Attach past prescriptions, test reports, or ECG scans (PDF, PNG, JPG).
7. **Patient Dashboard**:
   - View scheduled appointments with status badges (*Confirmed*, *Completed*, *Cancelled*).
   - Instant cancellation with reason logging.
   - Official digital prescription viewer with diagnosis, medication dosages, frequency, and instructions.
   - Edit personal health profile (blood group, age, gender, emergency contacts).
8. **Admin Dashboard**:
   - Real-time statistics: total patients, total doctors, approved doctors, total appointments, and revenue.
   - Doctor management: approve/revoke doctor credentials and toggle active status.
   - Patient management: monitor registered users and toggle account access.
   - Department manager: create, edit, or remove medical departments.
   - Global appointments manager: track and update consultation statuses across all doctors.
9. **Doctor Dashboard**:
   - Manage incoming patient schedule, review uploaded medical reports, and issue digital prescriptions.
   - Availability manager: customize weekly operating days (Monday–Sunday) and slot intervals.

---

## 👨‍⚕️ The 10 Demo Doctors & 10 Departments

| # | Doctor Name | Medical Department | Specialization | Qualifications | Exp. | Fee |
| :-: | :--- | :--- | :--- | :--- | :-: | :-: |
| 1 | **Dr. Evelyn Carter** | Cardiology | Interventional Cardiologist | MBBS, MD (Cardiology), FACC | 14 yrs | $120 |
| 2 | **Dr. Marcus Vance** | Neurology | Cognitive Neurologist & Spine Specialist | MBBS, MD, DM (Neurology), FAAN | 16 yrs | $150 |
| 3 | **Dr. Sophia Ramirez** | Pediatrics | Pediatrician & Neonatologist | MBBS, MD (Pediatrics), FAAP | 9 yrs | $80 |
| 4 | **Dr. Liam Thorne** | Orthopedics | Orthopedic Surgeon & Sports Medicine | MBBS, MS (Orthopedics), FRCS | 13 yrs | $135 |
| 5 | **Dr. Maya Patel** | Dermatology | Consultant Dermatologist & Cosmetologist | MBBS, MD (Dermatology) | 11 yrs | $95 |
| 6 | **Dr. Robert Sterling** | General Medicine | Family Medicine & Internal Medicine | MBBS, MD (General Medicine), FACP | 20 yrs | $70 |
| 7 | **Dr. Clara Zimmerman** | Ophthalmology | Cornea, Refractive Surgery & Glaucoma | MBBS, MS (Ophthalmology), FACS | 12 yrs | $110 |
| 8 | **Dr. Anita Desai** | Gynecology | Obstetrician & Gynecologist | MBBS, MS (OB-GYN), FACOG | 15 yrs | $125 |
| 9 | **Dr. Tariq Al-Mansoor** | Oncology | Medical Oncologist & Cancer Care | MBBS, MD (Medicine), DM (Oncology) | 10 yrs | $140 |
| 10 | **Dr. Jennifer Wu** | ENT | Otolaryngologist & Head-Neck Specialist | MBBS, MS (ENT), FACS | 14 yrs | $90 |

---

## 🔑 Demo Login Credentials

The Sign In page features **1-Click Quick Demo Login** buttons:

| Role | Email | Password | Primary Dashboard |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin@pulsecare.com` | `admin123` | [Admin Console](http://localhost:5173/admin/dashboard) |
| **Doctor** | `dr.carter@pulsecare.com` | `doctor123` | [Doctor Portal](http://localhost:5173/doctor/dashboard) |
| **Patient 1** | `patient@pulsecare.com` | `patient123` | [Patient Dashboard](http://localhost:5173/patient/dashboard) |
| **Patient 2** | `patient2@pulsecare.com` | `patient123` | [Patient Dashboard](http://localhost:5173/patient/dashboard) |

*(All 10 doctors can log in with their email and password `doctor123`)*

---

## 📁 Project Directory Structure

```text
Doctor/
├── package.json                    # Root scripts
├── .gitignore                      # Secrets & build exclusion
├── .env.example                    # Root environment configuration template
├── README.md                       # Complete documentation & startup guide
│
├── server/                         # Express.js & Node.js Backend
│   ├── config/
│   │   └── db.js                   # Mongoose database connection (Atlas & Local)
│   ├── controllers/
│   │   ├── authController.js       # Register, login, profile management
│   │   ├── doctorController.js     # Doctors search, filter, dynamic slot generation
│   │   ├── appointmentController.js# 9-field booking, duplicate check, prescriptions
│   │   ├── departmentController.js # 10 Medical departments CRUD
│   │   └── adminController.js      # System analytics, doctor approvals, user controls
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT verification & role authorization
│   │   ├── uploadMiddleware.js     # Multer file upload validation (PDF/Images/Docx)
│   │   └── errorMiddleware.js      # 404 & centralized error handler
│   ├── models/
│   │   ├── User.js                 # Patient, Doctor, Admin schema & bcrypt methods
│   │   ├── Doctor.js               # Doctor credentials, fees, address, working hours
│   │   ├── Department.js           # Department model with icons and descriptions
│   │   └── Appointment.js          # Appointment model with 9 explicit fields + Rx
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── doctorRoutes.js
│   │   ├── appointmentRoutes.js
│   │   ├── departmentRoutes.js
│   │   └── adminRoutes.js
│   ├── seeds/
│   │   ├── seedData.js             # 10 doctors & 10 departments seed dataset
│   │   └── seedRunner.js           # Database reset & seed executor
│   ├── uploads/                    # Directory for uploaded medical records (.gitkeep)
│   ├── .env                        # Local environment file (strictly gitignored)
│   ├── .env.example                # Example template for backend environment
│   ├── server.js                   # Express application entry point
│   └── package.json
│
└── client/                         # React.js + Vite Frontend (JavaScript Only)
    ├── src/
    │   ├── components/
    │   │   ├── common/
    │   │   │   ├── Navbar.jsx      # Navigation bar with role badges & links
    │   │   │   ├── Footer.jsx      # Emergency contact & clinical operations
    │   │   │   └── ProtectedRoute.jsx # Route authentication guard
    │   │   ├── booking/
    │   │   │   └── BookingModal.jsx# 9-field booking form with live slot picker
    │   │   └── doctor/
    │   │       ├── DoctorCard.jsx  # Doctor card with fees, rating, address & book button
    │   │       └── DoctorFilterBar.jsx # Search, department, fee & rating filters
    │   ├── context/
    │   │   └── AuthContext.jsx      # Global authentication state & user context
    │   ├── pages/
    │   │   ├── Home.jsx            # Hero search, 10 departments, top doctors
    │   │   ├── DoctorsPage.jsx     # Full directory of 10 doctors with filters
    │   │   ├── DoctorDetailPage.jsx# Doctor bio, clinical address & schedule
    │   │   ├── DepartmentsPage.jsx # 10 Medical specialties directory
    │   │   ├── LoginPage.jsx       # Sign in with 1-click demo buttons
    │   │   ├── RegisterPage.jsx    # Patient & Doctor registration
    │   │   ├── PatientDashboard.jsx# Consultations, prescriptions & reports
    │   │   ├── DoctorDashboard.jsx # Clinical schedule, availability & Rx writer
    │   │   ├── AdminDashboard.jsx  # Metrics, doctor approvals & department editor
    │   │   └── NotFound.jsx        # 404 page
    │   ├── services/
    │   │   └── api.js              # Axios instance with JWT interceptors
    │   ├── App.jsx                 # App routing & layout
    │   ├── main.jsx                # React root entry point
    │   ├── App.css
    │   └── index.css               # Bootstrap 5 & custom healthcare design
    ├── vite.config.js              # Vite server with backend API proxy
    ├── index.html                  # HTML template with fonts and icons
    └── package.json
```

---

## 🚀 Installation & Setup Instructions

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB**: Either **MongoDB Atlas** (cloud database) OR **Local MongoDB** (running on port `27017`).

---

### Step 1: Clone or Navigate to the Project
```bash
cd Doctor
```

---

### Step 2: Configure the Backend Environment

1. Navigate to the `server` directory and copy the environment template:
   ```bash
   cd server
   cp .env.example .env
   ```

2. Open `server/.env` and choose your MongoDB database:

#### Option A: MongoDB Atlas (Recommended for Cloud / College Evaluation)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign in.
2. Create a free shared cluster (M0).
3. Under **Database Access**, create a user (e.g. `pulsecare_admin`) and set a password.
4. Under **Network Access**, click **Add IP Address** and choose **Allow Access from Anywhere** (`0.0.0.0/0`).
5. Click **Connect** on your cluster, select **Drivers** (Node.js), and copy the connection string.
6. Paste it into `server/.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/book_a_doctor?retryWrites=true&w=majority
   JWT_SECRET=supersecretjwtkey_bookadoctor_2026_pulse
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```

#### Option B: Local MongoDB
If running MongoDB locally on your machine:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/book_a_doctor
JWT_SECRET=supersecretjwtkey_bookadoctor_2026_pulse
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

---

### Step 3: Install Dependencies & Seed Demo Data

1. **Install backend dependencies**:
   ```bash
   cd server
   npm install
   ```

2. **Populate the 10 Doctors, 10 Departments & Sample Bookings**:
   ```bash
   npm run seed
   ```
   *Output confirmation:*
   ```text
   [Seed] Inserting departments...
   [Seed] Inserted 10 departments.
   [Seed] Creating 10 demo doctor accounts and profiles...
   [Seed] Inserted 10 doctors.
   [Seed] Sample appointments successfully created.
   ```

3. **Install frontend dependencies**:
   ```bash
   cd ../client
   npm install
   ```

---

### Step 4: Run the Application

#### Terminal 1 — Start Backend Server:
```bash
cd server
npm start
```
The server will start on **http://localhost:5000** and log:
```text
[PulseCare Server] Running on http://localhost:5000
[Database Connected] MongoDB Atlas (Cloud) | Host: cluster0.xxxxx.mongodb.net | DB: book_a_doctor
```

#### Terminal 2 — Start Frontend Server:
```bash
cd client
npm run dev
```
The Vite React app will be available at **http://localhost:5173**.

Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 📤 How to Upload Complete Source Code to GitHub

Follow these exact steps to push the project to a GitHub repository safely without exposing `.env` or sensitive credentials:

### 1. Initialize Git in the Project Root
```bash
cd Doctor
git init
```

### 2. Verify `.gitignore`
Make sure `.gitignore` exists at the root. It already contains:
```gitignore
node_modules/
*/node_modules/
.env
.env.*
server/.env
dist/
client/dist/
server/uploads/*
!server/uploads/.gitkeep
```
> **Security Check:** Run `git status` and verify that `server/.env` is **NOT** listed in untracked files. Only `.env.example` should be staged.

### 3. Stage and Commit All Files
```bash
git add .
git commit -m "Initial commit: Book a Doctor Appointment MERN Web Application"
```

### 4. Create a New Repository on GitHub
1. Log in to [GitHub](https://github.com/).
2. Click **New Repository** (green button).
3. Name your repository (e.g., `book-a-doctor-appointment`).
4. Set visibility to **Public** or **Private**.
5. Do **NOT** initialize with README or .gitignore (we already created them).
6. Click **Create repository**.

### 5. Link and Push to GitHub
Copy your repository URL from GitHub and run:
```bash
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

Your complete source code is now live on GitHub!

---

## 🧪 Testing Guide for Project Evaluation

1. **Verify 10 Departments**:
   - Navigate to `/departments` to view all 10 clinical specialties.
2. **Verify 10 Doctors**:
   - Navigate to `/doctors` to search, filter by department (e.g., *Cardiology*, *Neurology*, *Oncology*, *ENT*), and view doctors with fees, qualifications, and experience.
3. **Appointment Booking (9 Fields)**:
   - Click **Book Appointment** on any doctor card.
   - Verify fields: Patient Name, Mobile Number, Email, Address, Department, Doctor, Date, Time Slot, and Reason for visit.
   - Submit and verify the instant confirmed slip.
4. **Duplicate Booking Test**:
   - Try to book the exact same slot for the same doctor and date.
   - The system intercepts the request with an `HTTP 409 Conflict` and displays a duplicate warning message.
5. **Patient Dashboard**:
   - Sign in as `patient@pulsecare.com` / `patient123`.
   - View scheduled consultations, inspect prescriptions, and test appointment cancellation.
6. **Doctor Portal**:
   - Sign in as `dr.carter@pulsecare.com` / `doctor123`.
   - View patient bookings and issue a digital prescription with medication dosages and instructions.
   - Go to **Availability & Profile** tab and toggle operating days or hours.
7. **Admin Dashboard**:
   - Sign in as `admin@pulsecare.com` / `admin123`.
   - View system statistics, revenue, doctor approval toggles, and department management.

---

## 📜 Project Summary
- **Project Title:** Book a Doctor (PulseCare)
- **Tech Stack:** MERN Stack (MongoDB / MongoDB Atlas, Express.js, React.js, Node.js)
- **Language:** JavaScript only (`.js`, `.jsx`). No TypeScript. No Python.
- **Styling:** Responsive Bootstrap 5 and custom CSS.
- **License:** MIT License

## 🎥 Project Demo Video

Watch the complete demonstration of the Book a Doctor (PulseCare) web application using the link below:

**[Watch Project Demo Video on Google Drive](https://drive.google.com/file/d/1tsn-_7nNAoeOeb_6uqbZR4m_adiLJKXs/view?usp=sharing)**

The demo video showcases the application's interface and working features.
