"use client";

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect to appropriate dashboard based on role
    if (role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (role === "photographer") {
      return <Navigate to="/photographer/dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
};
