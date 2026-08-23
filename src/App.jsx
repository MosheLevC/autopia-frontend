import { useEffect } from "react";
import {
  BrowserRouter,
  Outlet,
  Route,
  Routes,
  useLocation,
} from "react-router";
import { observer } from "mobx-react-lite";
import { AuthStoreProvider, useAuth } from "./stores/AuthStoreContext";
import { VehicleStoreProvider, useVehicleStore } from "./stores/VehicleStoreContext";
import { MaintenanceStoreProvider } from "./stores/MaintenanceStoreContext";
import { ProtectedRoute, PublicRoute } from "./components/ProtectedRoute";
import { HeaderProvider } from "./context/HeaderContext";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import AddReminderPage from "./pages/AddReminderPage";
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
import VehicleProfilePage from "./pages/VehicleProfilePage";
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
    <AuthStoreProvider>
      <VehicleStoreProvider>
        <MaintenanceStoreProvider>
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
                  <Route
                    path="/vehicles/:vehicleId"
                    element={<VehicleProfilePage />}
                  />
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
          </HeaderProvider>
        </MaintenanceStoreProvider>
      </VehicleStoreProvider>
    </AuthStoreProvider>
  );
}

export default App;
