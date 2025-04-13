import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Register from "../src/components/Authentication/Register";
import Landing from "./components/ClientDashboard/Landing";
import Login from "../src/components/Authentication/Login";
// import Photographers from "./components/ClientDashboard/Photographer";
// import HowItWorks from "./components/ClientDashboard/HowItWorks";
import { useDispatch } from "react-redux";
import { setCredentials } from "./redux/slices/authSlice";
import { PrivateRoute } from "../src/components/PrivateRoutes";
// import ApplyPhotographer from "./components/Authentication/ApplyPhotographer";
import PhotographerDashboard from "../src/photographer/dashboard/page";
import PhotographerAvailabilityPage from "./photographer/availability/page";
import PhotographerPortfolioPage from "./photographer/portfolio/page";
import PhotographerBookingsPage from "./photographer/bookings/page";
import Home from "./page";
import ApplyPage from "./apply/page";
import MapPage from "./map/page";
import AdminDashboardPage from "./admin/page";
import ProfilePage from "./profile/page";
import BookingsPage from "./admin/bookings/page";
// import PhotographersPage from "./photographers/page";
import ReportsPage from "./admin/reports/page";
import UsersPage from "./admin/users/page";

function App() {
  const dispatch = useDispatch(); // ← Move useDispatch here

  useEffect(() => {
    // ← Move useEffect here
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token && user) {
      dispatch(setCredentials({ token, user, role: user.role }));
    }
  }, [dispatch]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Landing />
          </PrivateRoute>
        }
      />
      <Route
        path="/photographer/dashboard"
        element={
          <PrivateRoute>
            <PhotographerDashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/photographer/availability"
        element={
          <PrivateRoute>
            <PhotographerAvailabilityPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/photographer/portfolio"
        element={
          <PrivateRoute>
            <PhotographerPortfolioPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/photographer/bookings"
        element={
          <PrivateRoute>
            <PhotographerBookingsPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/user/dashboard"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />

      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      {/* <Route path="/apply" element={<ApplyPhotographer />} />  
      <Route path="/how-it-works" element={<HowItWorks />} /> 
      <Route path="/photographer" element={<Photographers />} />*/}

      {/* <Route
        path="/photographers"
        element={
          <PrivateRoute>
            <PhotographersPage />
          </PrivateRoute>
        }
      /> */}
      <Route
        path="/map"
        element={
          <PrivateRoute>
            <MapPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/apply"
        element={
          <PrivateRoute>
            <ApplyPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoute>
            <AdminDashboardPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <PrivateRoute>
            <UsersPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/photographers"
        element={
          <PrivateRoute>
            <PhotographersPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/bookings"
        element={
          <PrivateRoute>
            <BookingsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <PrivateRoute>
            <ReportsPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
