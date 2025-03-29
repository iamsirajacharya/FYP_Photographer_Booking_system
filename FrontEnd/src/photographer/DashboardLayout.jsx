import React from "react";
import { Header } from "./header";

export default function DashboardLayout({ children }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Header />
      <div className="mt-6">{children}</div>
    </div>
  );
}
