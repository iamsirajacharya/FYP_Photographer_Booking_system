import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Register from "../src/components/Authentication/Register";
import Login from "../src/components/Authentication/Login";
import { useDispatch } from "react-redux";
import { setCredentials } from "./redux/slices/authSlice";
import { PrivateRoute } from "../src/components/PrivateRoutes";
import PhotographerDashboard from "./photographer/dashboard/page";
import PhotographerBookingsPage from "./photographer/bookings/page";
import PhotographerAvailabilityPage from "./photographer/availability/page";
import PhotographerPortfolioPage from "./photographer/portfolio/page";
import PhotographerReviewsPage from "./photographer/reviews/page";
// import PhotographerDashboard from "./photographer/PhotographerDashboard";
import Home from "./page";
import ApplyPage from "./apply/page";
import MapPage from "./map/page";
import AdminDashboardPage from "./admin/page";
import ProfilePage from "./profile/page";
import BookingsPage from "./admin/bookings/page";
import PhotographerPage from "./photographers/page";
import ReportsPage from "./admin/reports/page";
import UsersPage from "./admin/users/page";
import AdminPhotographersPage from "./admin/photographers/page";
// import PhotographerDetailPage from "./photographers/details/page";
// import PhotographerDashboardProtectedRoute from "./components/PhotographerDashboardProtectedRoute";
import { useGetCurrentUserQuery } from "./redux/api/authApi";

function App() {
  const dispatch = useDispatch();
  const { data, isSuccess } = useGetCurrentUserQuery();

  useEffect(() => {
    if (isSuccess && data?.user) {
      // data.user should include photographerProfile if your backend returns it
      dispatch(
        setCredentials({
          user: data.user,
          token: localStorage.getItem("token"),
          role: data.user.role,
        })
      );
      // Optionally, also store photographerProfile separately:
      // dispatch(updateUser({ photographer: data.user.photographerProfile }));
    }
  }, [isSuccess, data, dispatch]);

  return (
    <Routes>
      {/* <Route
        path="/photographer/dashboard"
        element={
          <PrivateRoute>
            <PhotographerDashboard />
          </PrivateRoute>
        }
      /> */}
      <Route
        path="/photographer/dashboard"
        element={
          <PrivateRoute>
            <PhotographerDashboard />
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
        path="/photographer/availability"
        element={
          <PrivateRoute>
            <PhotographerAvailabilityPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/photographer/reviews"
        element={
          <PrivateRoute>
            <PhotographerReviewsPage />
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
      {/* <Route element={<PhotographerDashboardProtectedRoute />}>
        <Route
          path="/photographer/dashboard"
          element={<PhotographerDashboard />}
        />
      </Route> */}

      {/* <Route
        path="/photographer/availability"
        element={
          <PrivateRoute>
            <PhotographerAvailabilityPage />
          </PrivateRoute>
        }
      /> */}
      {/* <Route
        path="/photographer/portfolio"
        element={
          <PrivateRoute>
            <PhotographerPortfolioPage />
          </PrivateRoute>
        }
      /> */}
      {/* <Route
        path="/photographer/bookings"
        element={
          <PrivateRoute>
            <PhotographerBookingsPage />
          </PrivateRoute>
        }
      /> */}
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
      <Route
        path="/photographers"
        element={
          <PrivateRoute>
            <PhotographerPage />
          </PrivateRoute>
        }
      />
      {/* <Route path="/photographers/:id" element={<PhotographerDetailPage />} /> */}
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
            <AdminPhotographersPage />
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
