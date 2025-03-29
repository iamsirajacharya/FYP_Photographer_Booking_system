// PhotographerDashboardProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PhotographerDashboardProtectedRoute = () => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (role && role.includes("photographer")) {
    return <Outlet />;
  }
  // If user is authenticated but not approved as photographer, you can navigate them to the client dashboard or show an error.
  return <Navigate to="/user/dashboard" />;
};

export default PhotographerDashboardProtectedRoute;
