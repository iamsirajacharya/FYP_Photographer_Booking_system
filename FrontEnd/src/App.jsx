import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Register from "../src/components/Authentication/Register";
import Landing from "./components/ClientDashboard/Landing";
import Login from "../src/components/Authentication/Login";
import Photographers from "./components/ClientDashboard/Photographer";
import HowItWorks from "./components/ClientDashboard/HowItWorks";
import { useDispatch } from "react-redux";
import { login } from "./Redux/slice/authSlice";
import PrivateRoute from "./routes/PrivateRoutes";
// import ApplyPhotographer from "./components/Authentication/ApplyPhotographer";
import PhotographerDashboard from "./components/PhotographerDashboard/PhotographerDashboard";

function App() {
  const dispatch = useDispatch(); // ← Move useDispatch here

  useEffect(() => {
    // ← Move useEffect here
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token && user) {
      dispatch(login({ token, ...user }));
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
        path="/photographer-dashboard"
        element={
          <PrivateRoute>
            <PhotographerDashboard />
          </PrivateRoute>
        }
      />

      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      {/* <Route path="/apply" element={<ApplyPhotographer />} /> */}
      <Route path="/photographer" element={<Photographers />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
    </Routes>
  );
}

export default App;
