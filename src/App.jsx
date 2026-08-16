import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import { AuthStoreProvider } from "./stores/AuthStoreContext";
import { VehicleStoreProvider } from "./stores/VehicleStoreContext";
import { ProtectedRoute, PublicRoute } from "./components/ProtectedRoute";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import AddReminderPage from "./pages/AddReminderPage";
import AddServicePage from "./pages/AddServicePage";
import AddVehiclePage from "./pages/AddVehiclePage";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import LandingPage from "./pages/LandingPage";
import ProfilePage from "./pages/ProfilePage";
import RemindersPage from "./pages/RemindersPage";
import ServicesPage from "./pages/ServicesPage";
import VehicleProfilePage from "./pages/VehicleProfilePage";
import VehiclesPage from "./pages/VehiclesPage";

function AppLayout() {
  return (
    <div className="app-container" dir="rtl">
      <Header />
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthStoreProvider>
      <VehicleStoreProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/auth"
              element={
                <PublicRoute>
                  <AuthPage />
                </PublicRoute>
              }
            />

            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/home" element={<HomePage />} />
              <Route path="/vehicles" element={<VehiclesPage />} />
              <Route path="/vehicles/add" element={<AddVehiclePage />} />
              <Route
                path="/vehicles/:vehicleId"
                element={<VehicleProfilePage />}
              />
              <Route
                path="/vehicles/:vehicleId/services"
                element={<ServicesPage />}
              />
              <Route
                path="/vehicles/:vehicleId/services/add"
                element={<AddServicePage />}
              />
              <Route
                path="/vehicles/:vehicleId/reminders"
                element={<RemindersPage />}
              />
              <Route
                path="/vehicles/:vehicleId/reminders/add"
                element={<AddReminderPage />}
              />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </VehicleStoreProvider>
    </AuthStoreProvider>
  );
}

export default App;
