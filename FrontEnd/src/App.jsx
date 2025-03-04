import React from "react";
import { Routes, Route } from "react-router";
import Register from "../src/components/Authentication/Register";
import Landing from "../src/components/Dashboard/Landing";
import Login from "../src/components/Authentication/Login";
import Photographer from "./components/Dashboard/Photographer";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/photographer" element={<Photographer />} />
      {/* <Route path="/login" element={<Login />} /> */}
    </Routes>
  );
}

export default App;
