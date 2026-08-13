# Autopia (אוטופיה) — Frontend

A modern Hebrew-first car management web application built with React, Vite, Mantine UI, and MobX / React Context.

## 📌 Project Overview
Autopia helps vehicle owners in Israel manage their cars effortlessly in one place:
- **Vehicle Dashboard**: Track odometer mileage, distance since last service, and upcoming alerts.
- **5-Step Vehicle Setup Wizard**: Add cars by Israeli license plate lookup or manual entry, auto-fill details, upload vehicle manuals, and configure maintenance intervals.
- **Service History Log**: Detailed maintenance feed with component tagging (brakes, battery, filters, AC, wipers), cost tracking, and invoice receipt uploads.
- **Smart Reminders**: Automated alerts for annual vehicle tests (טסט שנתי), periodic service, component replacements, and compulsory insurance.
- **AI Car Assistant**: Interactive floating AI assistant trained on the car's uploaded PDF manual (sfar rechev).

---

## 🛠️ Tech Stack
- **Framework**: React 19 + Vite
- **Routing**: React Router 7
- **UI & Styling**: Mantine UI + PostCSS + CSS Modules / Vanilla CSS
- **State Management**: React Context (`AppContext.jsx`) / MobX
- **Icons & Brand Assets**: Phosphor Icons & `node-vehicle-logos`
- **Linting**: Oxlint

---

## 📁 File Structure

```
src/
├── components/
│   ├── Navbar.jsx           # Responsive Navigation (Desktop Sidebar / Mobile Bottom bar)
│   ├── Header.jsx           # Top header bar with car selector & user greeting
│   ├── VehicleCard.jsx      # Vehicle preview card component
│   ├── VehicleWizard.jsx    # Add vehicle 5-step wizard component
│   ├── ServiceLog.jsx       # Service history list component
│   ├── AddServiceForm.jsx   # Add maintenance form & component selection modal
│   ├── Reminders.jsx        # Reminders list component
│   ├── AddReminderForm.jsx  # Add reminder form
│   ├── AIChat.jsx           # AI Assistant drawer/modal overlay
│   └── UserProfile.jsx      # User profile form component
│
├── context/
│   └── AppContext.jsx       # Central application state provider
│
├── pages/
│   ├── LandingPage.jsx      # Public entry landing page
│   ├── AuthPage.jsx         # Login & Signup page
│   ├── HomePage.jsx         # Main dashboard
│   ├── VehiclesPage.jsx     # My Vehicles list page
│   ├── VehicleProfilePage.jsx # Single vehicle profile details
│   ├── AddVehiclePage.jsx   # Add vehicle wizard page
│   ├── ServicesPage.jsx     # Service log history page
│   ├── AddServicePage.jsx   # Add maintenance record page
│   ├── RemindersPage.jsx    # Reminders page
│   ├── AddReminderPage.jsx  # Add reminder page
│   └── ProfilePage.jsx      # User profile & settings page
│
├── App.jsx                  # Main router setup & layout container
└── main.jsx                 # Application entry point
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
