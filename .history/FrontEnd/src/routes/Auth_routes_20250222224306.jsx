import React from "react";
import { Routes, Route } from "react-router";
import Register from "../components/Authentication/Register";

function Auth_routes() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Register />} />
    </Routes>
  );
}

export default Auth_routes;
