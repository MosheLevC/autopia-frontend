# Autopia (אוטופיה) — Frontend

A modern Hebrew-first car management web application built with React, Vite, Mantine UI, and MobX / React Context.

## 📌 Project Overview
Autopia helps vehicle owners in Israel manage their cars effortlessly in one place:
- **Vehicle Dashboard**: Track odometer mileage, distance since last maintenance, and upcoming alerts.
- **5-Step Vehicle Setup Wizard**: Add cars by Israeli license plate lookup or manual entry, auto-fill details, upload vehicle manuals, and configure maintenance intervals.
- **Maintenance History Log**: Detailed maintenance feed with component tagging (brakes, battery, filters, AC, wipers), cost tracking, and invoice receipt uploads.
- **Smart Reminders**: Automated alerts for annual vehicle tests (טסט שנתי), periodic maintenance, component replacements, and compulsory insurance.
- **AI Car Assistant**: Interactive floating AI assistant trained on the car's uploaded PDF manual (sfar rechev).

---

## 🛠️ Tech Stack
- **Framework**: React 19 + Vite
- **Routing**: React Router 7
- **UI & Styling**: Mantine UI (v9) + Vanilla CSS (RTL-first)
- **State Management**: Classless Functional MobX (`observable`, `action`, `runInAction`) with React Context
- **HTTP Client**: Axios with JWT Bearer auth interceptor
- **Icons & Brand Assets**: Phosphor Icons (`<i className="ph-..." />`) & `node-vehicle-logos`
- **Linting**: Oxlint

---

## 📁 File Structure

```
src/
├── components/
│   ├── Navbar.jsx              # Responsive Navigation (Desktop Sidebar / Mobile Bottom bar)
│   ├── Header.jsx              # Top header bar with dynamic page title & profile action
│   ├── VehicleCard.jsx         # Vehicle preview card component
│   ├── VehicleWizard.jsx       # Add vehicle 5-step wizard component
│   ├── MaintenanceLog.jsx      # Maintenance history list component
│   ├── AddMaintenanceForm.jsx  # Add maintenance form & component selection modal
│   ├── Reminders.jsx           # Reminders list component
│   ├── AddReminderForm.jsx     # Add reminder form
│   ├── AIChat.jsx              # AI Assistant drawer/modal overlay
│   └── UserProfile.jsx         # User profile form component
│
├── context/
│   └── HeaderContext.jsx       # Dynamic header title context provider & hook
│
├── services/
│   ├── apiClient.js            # Axios client with JWT interceptor
│   ├── authService.js          # Authentication API calls
│   └── vehicleService.js       # Vehicles & license plate API calls
│
├── stores/
│   ├── authStore.js            # Authentication MobX store
│   ├── vehicleStore.js         # Vehicle MobX store
│   ├── AuthStoreContext.jsx    # Auth store provider & useAuth hook
│   └── VehicleStoreContext.jsx # Vehicle store provider & useVehicleStore hook
│
├── utils/
│   └── plateUtils.js           # License plate formatting & date helpers
│
├── pages/
│   ├── LandingPage.jsx         # Public entry landing page
│   ├── AuthPage.jsx            # Login & Signup page
│   ├── HomePage.jsx            # Main dashboard
│   ├── VehiclesPage.jsx        # My Vehicles list page
│   ├── VehicleProfilePage.jsx  # Single vehicle profile details
│   ├── AddVehiclePage.jsx      # Add vehicle wizard page
│   ├── MaintenancesPage.jsx    # Maintenance log history page
│   ├── AddMaintenancePage.jsx  # Add maintenance record page
│   ├── RemindersPage.jsx       # Reminders page
│   ├── AddReminderPage.jsx     # Add reminder page
│   └── ProfilePage.jsx         # User profile & settings page
│
├── App.jsx                     # Main router setup & layout container
└── main.jsx                    # Application entry point
```

---

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Run Local Dev Server
```bash
npm run dev
```

### Lint Codebase
```bash
npm run lint
```
