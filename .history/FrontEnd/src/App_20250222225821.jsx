import React from "react";
import { Routes, Route } from "react-router";
import Register from "../src/components/Authentication/Register";
import Home from "../src/components/Dashboard/Home";
import Login from "./components/Authentication/Login";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register" element={<Login />} />
    </Routes>
  );
}

export default App;
