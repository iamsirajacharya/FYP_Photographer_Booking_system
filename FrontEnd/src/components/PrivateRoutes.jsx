import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// export const PrivateRoute = ({ allowedRoles }) => {
//   const { isAuthenticated, role } = useAuth();

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   // If no specific roles are required, allow access
//   if (!allowedRoles) {
//     // Redirect to appropriate dashboard if accessing root route
//     if (window.location.pathname === "/") {
//       if (role === "admin") {
//         return <Navigate to="/admin/dashboard" replace />;
//       } else if (role === "photographer") {
//         return <Navigate to="/photographer/dashboard" replace />;
//       } else if (role === "client") {
//         return <Navigate to="/user/dashboard" replace />;
//       }
//     }
//     return <Outlet />;
//   }

//   // Check if user has required role
//   if (!allowedRoles.includes(role)) {
//     // Redirect to appropriate dashboard based on role
//     if (role === "admin") {
//       return <Navigate to="/admin/dashboard" replace />;
//     } else if (role === "photographer") {
//       return <Navigate to="/photographer/dashboard" replace />;
//     } else if (role === "client") {
//       return <Navigate to="/user/dashboard" replace />;
//     }
//   }

//   return <Outlet />;
// };

export const PrivateRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Optionally, redirect based on role or show an unauthorized message.
    if (role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (role === "photographer") {
      return <Navigate to="/photographer/dashboard" replace />;
    } else if (role === "client") {
      return <Navigate to="/user/dashboard" replace />;
    }
  }

  // Render the child component passed to PrivateRoute
  return children;
};
