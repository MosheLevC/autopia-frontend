import { Navigate, useLocation } from "react-router";
import { observer } from "mobx-react-lite";
import { useAuth } from "../stores/AuthStoreContext";
import { Center, Loader } from "@mantine/core";

export const ProtectedRoute = observer(function ProtectedRoute({ children }) {
  const auth = useAuth();
  const location = useLocation();

  if (auth.isLoading) {
    return (
      <Center style={{ minHeight: "80vh" }}>
        <Loader size="lg" color="blue" />
      </Center>
    );
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
});

export const PublicRoute = observer(function PublicRoute({ children }) {
  const auth = useAuth();

  if (auth.isLoading) {
    return (
      <Center style={{ minHeight: "80vh" }}>
        <Loader size="lg" color="blue" />
      </Center>
    );
  }

  if (auth.isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return children;
});
