import { useEffect } from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
} from "react-router";
import { observer } from "mobx-react-lite";
import { useAuth, useVehicleStore } from "./stores";
import { ProtectedRoute, PublicRoute } from "./components/ProtectedRoute";
import { HeaderProvider } from "./context/HeaderProvider";
import Header from "./components/Header";

import Navbar from "./components/Navbar";
import AddReminderPage from "./pages/AddReminderPage";
import EditReminderPage from "./pages/EditReminderPage";
import AddMaintenancePage from "./pages/AddMaintenancePage";
import AddVehiclePage from "./pages/AddVehiclePage";
import AuthPage from "./pages/AuthPage";
import AIChatPage from "./pages/AIChatPage";
import HomePage from "./pages/HomePage";
import LandingPage from "./pages/LandingPage";
import ProfilePage from "./pages/ProfilePage";
import MaintenancesPage from "./pages/MaintenancesPage";
import MaintenanceDetailPage from "./pages/MaintenanceDetailPage";
import RemindersPage from "./pages/RemindersPage";
import VehiclesPage from "./pages/VehiclesPage";

const AppLayout = observer(function AppLayout() {
  const auth = useAuth();
  const vehicleStore = useVehicleStore();
  const location = useLocation();
  const isAIPage = location.pathname === "/ai";

  useEffect(() => {
    if (auth.isAuthenticated) {
      vehicleStore.fetchVehicles().catch(() => {});
    }
  }, [auth.isAuthenticated, vehicleStore]);

  return (
    <div
      className={`app-container ${isAIPage ? "app-container--ai" : ""}`}
      dir="rtl"
    >
      <Navbar />
      <div className="app-content-wrapper">
        <Header />
        <main className={`app-body ${isAIPage ? "app-body--ai" : ""}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
});

function App() {
  return (
    <HeaderProvider>
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
            <Route path="/ai" element={<AIChatPage />} />
            <Route path="/vehicles" element={<VehiclesPage />} />
            <Route path="/vehicles/add" element={<AddVehiclePage />} />
            <Route path="/maintenances" element={<MaintenancesPage />} />
            <Route
              path="/maintenances/add"
              element={<AddMaintenancePage />}
            />
            <Route
              path="/vehicles/:vehicleId/maintenances"
              element={<MaintenancesPage />}
            />
            <Route
              path="/vehicles/:vehicleId/maintenances/add"
              element={<AddMaintenancePage />}
            />
            <Route
              path="/vehicles/:vehicleId/maintenances/:maintenanceId"
              element={<MaintenanceDetailPage />}
            />
            <Route path="/reminders" element={<RemindersPage />} />
            <Route
              path="/reminders/add"
              element={<AddReminderPage />}
            />
            <Route
              path="/reminders/:reminderId/edit"
              element={<EditReminderPage />}
            />
            <Route
              path="/vehicles/:vehicleId/reminders"
              element={<RemindersPage />}
            />
            <Route
              path="/vehicles/:vehicleId/reminders/add"
              element={<AddReminderPage />}
            />
            <Route
              path="/vehicles/:vehicleId/reminders/:reminderId/edit"
              element={<EditReminderPage />}
            />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </BrowserRouter>
    </HeaderProvider>
  );
}

export default App;
