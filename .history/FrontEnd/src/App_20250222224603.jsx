import React from "react";
import { Routes, Route } from "react-router";
import Register from "../src/components/Authentication/Register";
import Home from "../src/components/Dashboard/Home";

function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default App;
