"use client";

import React, { useState } from "react";
import { AdminSidebar } from "../../UI/admin-sidebar";
import { Footer } from "../../UI/footer";
import { CheckCircle, XCircle, Users, Camera, Clock } from "lucide-react";
import {
  useGetDashboardStatsQuery,
  useGetAllUsersQuery,
  useGetPhotographerApplicationsQuery,
  useGetAllPhotographersQuery, // if needed later
} from "../redux/api/adminApi";

export default function AdminDashboardPage() {
  // Query for overall dashboard stats
  const {
    data: dashboardStats,
    isLoading: loadingStats,
    isError: errorStats,
    error: statsError,
  } = useGetDashboardStatsQuery();

  // Query for photographer applications
  const {
    data: photographerApplications,
    isLoading: loadingApplications,
    isError: errorApplications,
    error: applicationsError,
  } = useGetPhotographerApplicationsQuery();

  // Query for all users
  const {
    data: usersData,
    isLoading: loadingUsers,
    isError: errorUsers,
    error: usersError,
  } = useGetAllUsersQuery();

  // Optional query for all photographers (if needed)
  const {
    data: photographersData,
    isLoading: loadingPhotographers,
    isError: errorPhotographers,
    error: photographersError,
  } = useGetAllPhotographersQuery();

  const [activeSection, setActiveSection] = useState("applications");

  // Handlers – for now, these log the action.
  const handleApprove = (id) => {
    console.log("Approve application", id);
    // TODO: Call the appropriate mutation and refetch data.
  };

  const handleReject = (id) => {
    console.log("Reject application", id);
    // TODO: Call the appropriate mutation and refetch data.
  };

  // Show loading if any of the critical queries are still loading.
  if (loadingStats || loadingApplications || loadingUsers) {
    return (
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />
        <div className="flex-1">
          <main className="py-8 md:ml-64">
            <div className="container mx-auto px-4">
              <p className="text-center text-xl">Loading dashboard...</p>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    );
  }

  // Show error if any query fails.
  if (errorStats || errorApplications || errorUsers) {
    return (
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />
        <div className="flex-1">
          <main className="py-8 md:ml-64">
            <div className="container mx-auto px-4">
              <p className="text-center text-xl text-red-600">
                Error loading dashboard:{" "}
                {statsError?.message ||
                  applicationsError?.message ||
                  usersError?.message ||
                  "Unknown error"}
              </p>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    );
  }

  // Assume dashboardStats returns totalUsers, activePhotographers, and pendingApplications.
  const totalUsers = dashboardStats?.totalUsers || 0;
  const activePhotographers = dashboardStats?.activePhotographers || 0;
  const pendingApplications = dashboardStats?.pendingApplications || 0;

  // Assume usersData has a property "users" which is an array.
  const allUsers = usersData?.users || [];

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
                <h2 className="mt-3 text-2xl font-bold">{totalUsers}</h2>
                <p className="text-gray-500">Total Users</p>
              </div>

              {/* Active Photographers */}
              <div className="rounded-lg border bg-white p-6 shadow-sm flex flex-col items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                  <Camera className="h-6 w-6 text-purple-600" />
                </div>
                <h2 className="mt-3 text-2xl font-bold">
                  {activePhotographers}
                </h2>
                <p className="text-gray-500">Active Photographers</p>
              </div>

              {/* Pending Applications */}
              <div className="rounded-lg border bg-white p-6 shadow-sm flex flex-col items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <h2 className="mt-3 text-2xl font-bold">
                  {pendingApplications}
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
                  {photographerApplications &&
                  photographerApplications.length > 0 ? (
                    <div className="space-y-4">
                      {photographerApplications.map((application) => (
                        <div
                          key={application.id}
                          className="rounded-lg border bg-white p-4 shadow-sm"
                        >
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">
                                  {application.name}
                                </h3>
                                <span className="inline-block rounded px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800">
                                  Pending
                                </span>
                              </div>
                              <p className="text-sm text-gray-500">
                                Email: {application.email}
                              </p>
                              <p className="text-sm text-gray-500">
                                Location: {application.location}
                              </p>
                              <p className="text-sm text-gray-500">
                                Specialty: {application.specialty}
                              </p>
                              <p className="text-sm text-gray-500">
                                Experience: {application.experience}
                              </p>
                              <p className="text-sm text-gray-500">
                                Applied: {application.appliedDate}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                className="rounded border border-green-500 px-3 py-1 text-sm font-medium text-green-500 hover:bg-green-50 hover:text-green-600"
                                onClick={() => handleApprove(application.id)}
                              >
                                <CheckCircle className="mr-1 h-4 w-4" />
                                Approve
                              </button>
                              <button
                                className="rounded border border-red-500 px-3 py-1 text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600"
                                onClick={() => handleReject(application.id)}
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
