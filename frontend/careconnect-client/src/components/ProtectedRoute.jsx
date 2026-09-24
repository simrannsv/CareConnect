import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

export default function ProtectedRoute({
  allowedRoles,
}) {
  const {
    isAuthenticated,
    user,
    restoring,
  } = useAuth();

  const location = useLocation();

  if (restoring) {
    return (
      <Loader label="Restoring your session..." />
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  if (
    allowedRoles?.length &&
    !allowedRoles.includes(user?.role)
  ) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}