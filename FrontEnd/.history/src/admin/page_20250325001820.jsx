"use client";

import React, { useState } from "react";
import { AdminSidebar } from "../../UI/admin-sidebar";
import { Footer } from "../../UI/footer";
import { CheckCircle, XCircle, Users, Camera, Clock, Flag } from "lucide-react";
import { useGetPhotographerApplicationsQuery } from "../redux/api/adminApi";

// Mock allUsers data remains for the users section
const allUsers = [
  {
    id: 1,
    name: "Emily Davis",
    email: "emily.davis@example.com",
    role: "Client",
    joinDate: "2023-09-10",
    bookings: 3,
  },
  {
    id: 2,
    name: "Alex Morgan",
    email: "alex.morgan@example.com",
    role: "Photographer",
    joinDate: "2023-08-15",
    bookings: 12,
  },
  {
    id: 3,
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    role: "Photographer",
    joinDate: "2023-08-20",
    bookings: 8,
  },
  {
    id: 4,
    name: "Michael Rodriguez",
    email: "michael.rodriguez@example.com",
    role: "Photographer",
    joinDate: "2023-09-05",
    bookings: 5,
  },
  {
    id: 5,
    name: "John Smith",
    email: "john.smith@example.com",
    role: "Client",
    joinDate: "2023-09-15",
    bookings: 1,
  },
];

export default function AdminDashboardPage() {
  // Use the API hook for photographer applications
  const {
    data: photographerApplications,
    isLoading: loadingApplications,
    isError: errorApplications,
    error: applicationsError,
  } = useGetPhotographerApplicationsQuery();

  const [activeSection, setActiveSection] = useState("applications");

  // For demo purposes, the following functions log actions.
  // Replace them with appropriate mutations and refetch logic as needed.
  const handleApprove = (id) => {
    console.log("Approve application", id);
    // TODO: Call mutation to approve application and refetch data
  };

  const handleReject = (id) => {
    console.log("Reject application", id);
    // TODO: Call mutation to reject application and refetch data
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1">
        <main className="py-8 md:ml-64">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-purple-800">
                Admin Dashboard
              </h1>
              <p className="text-gray-500">
                Manage users and photographer applications
              </p>
            </div>

            {/* Stats Section */}
            <div className="grid gap-6 md:grid-cols-3">
              {/* Total Users */}
              <div className="rounded-lg border bg-white p-6 shadow-sm flex flex-col items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h2 className="mt-3 text-2xl font-bold">{allUsers.length}</h2>
                <p className="text-gray-500">Total Users</p>
              </div>

              {/* Active Photographers */}
              <div className="rounded-lg border bg-white p-6 shadow-sm flex flex-col items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                  <Camera className="h-6 w-6 text-purple-600" />
                </div>
                <h2 className="mt-3 text-2xl font-bold">
                  {
                    allUsers.filter((user) => user.role === "Photographer")
                      .length
                  }
                </h2>
                <p className="text-gray-500">Active Photographers</p>
              </div>

              {/* Pending Applications */}
              <div className="rounded-lg border bg-white p-6 shadow-sm flex flex-col items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <h2 className="mt-3 text-2xl font-bold">
                  {photographerApplications
                    ? photographerApplications.length
                    : 0}
                </h2>
                <p className="text-gray-500">Pending Applications</p>
              </div>
            </div>

            {/* Section Switcher */}
            <div className="mt-8 mb-4 flex items-center justify-center gap-2">
              <button
                className={`px-4 py-2 rounded-md font-medium ${
                  activeSection === "applications"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
                onClick={() => setActiveSection("applications")}
              >
                Photographer Applications
              </button>
              <button
                className={`px-4 py-2 rounded-md font-medium ${
                  activeSection === "users"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
                onClick={() => setActiveSection("users")}
              >
                All Users
              </button>
            </div>

            {/* Applications Section */}
            {activeSection === "applications" && (
              <div className="rounded-lg border bg-white shadow-sm">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-semibold">
                    Pending Photographer Applications
                  </h2>
                  <p className="text-sm text-gray-500">
                    Review and approve photographer applications
                  </p>
                </div>
                <div className="p-4">
                  {loadingApplications ? (
                    <p className="text-center text-gray-600">
                      Loading applications...
                    </p>
                  ) : errorApplications ? (
                    <p className="text-center text-red-600">
                      Error loading applications:{" "}
                      {applicationsError?.message || "Unknown error"}
                    </p>
                  ) : photographerApplications &&
                    photographerApplications.length > 0 ? (
                    <div className="space-y-4">
                      {photographerApplications.map((photographer) => (
                        <div
                          key={photographer.id}
                          className="rounded-lg border bg-white p-4 shadow-sm"
                        >
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">
                                  {photographer.name}
                                </h3>
                                <span className="inline-block rounded px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800">
                                  Pending
                                </span>
                              </div>
                              <p className="text-sm text-gray-500">
                                Email: {photographer.email}
                              </p>
                              <p className="text-sm text-gray-500">
                                Location: {photographer.location}
                              </p>
                              <p className="text-sm text-gray-500">
                                Specialty: {photographer.specialty}
                              </p>
                              <p className="text-sm text-gray-500">
                                Experience: {photographer.experience}
                              </p>
                              <p className="text-sm text-gray-500">
                                Applied: {photographer.appliedDate}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                className="rounded border border-green-500 px-3 py-1 text-sm font-medium text-green-500 hover:bg-green-50 hover:text-green-600"
                                onClick={() => handleApprove(photographer.id)}
                              >
                                <CheckCircle className="mr-1 h-4 w-4" />
                                Approve
                              </button>
                              <button
                                className="rounded border border-red-500 px-3 py-1 text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600"
                                onClick={() => handleReject(photographer.id)}
                              >
                                <XCircle className="mr-1 h-4 w-4" />
                                Reject
                              </button>
                              <button className="rounded border px-3 py-1 text-sm font-medium text-gray-500 hover:bg-gray-50">
                                View Details
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed">
                      <p className="text-gray-500">No pending applications</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Users Section */}
            {activeSection === "users" && (
              <div className="rounded-lg border bg-white shadow-sm">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-semibold">All Users</h2>
                  <p className="text-sm text-gray-500">
                    Manage all users on the platform
                  </p>
                </div>
                <div className="p-4">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-2 text-left">User</th>
                          <th className="px-4 py-2 text-left">Email</th>
                          <th className="px-4 py-2 text-left">Role</th>
                          <th className="px-4 py-2 text-left">Join Date</th>
                          <th className="px-4 py-2 text-left">Bookings</th>
                          <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allUsers.map((user) => (
                          <tr key={user.id} className="border-b">
                            <td className="px-4 py-2">
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                  <span>{user.name.charAt(0)}</span>
                                </div>
                                <span>{user.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-2">{user.email}</td>
                            <td className="px-4 py-2">
                              <span
                                className={`px-2 py-1 rounded ${
                                  user.role === "Photographer"
                                    ? "bg-purple-100 text-purple-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {user.role}
                              </span>
                            </td>
                            <td className="px-4 py-2">{user.joinDate}</td>
                            <td className="px-4 py-2">{user.bookings}</td>
                            <td className="px-4 py-2">
                              <button className="px-3 py-1 rounded border text-sm text-gray-500 hover:bg-gray-50">
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
