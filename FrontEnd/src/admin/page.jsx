import React, { useState } from "react";
import { AdminSidebar } from "../../UI/admin-sidebar";
import { Footer } from "../../UI/footer";
import { CheckCircle, XCircle, Users, Camera, Clock, Eye } from "lucide-react";
import {
  useGetDashboardStatsQuery,
  useGetAllUsersQuery,
  useGetPhotographerApplicationsQuery,
  useGetUserByIdQuery,
  useApprovePhotographerApplicationMutation,
  useRejectPhotographerApplicationMutation,
} from "../redux/api/adminApi";

export default function AdminDashboardPage() {
  // Queries for dashboard stats, all users, and photographer applications
  const {
    data: dashboardStats,
    isLoading: loadingStats,
    isError: errorStats,
    error: statsError,
  } = useGetDashboardStatsQuery();

  const {
    data: usersData,
    isLoading: loadingUsers,
    isError: errorUsers,
    error: usersError,
  } = useGetAllUsersQuery();

  const {
    data: photographerApplications,
    isLoading: loadingApplications,
    isError: errorApplications,
    error: applicationsError,
  } = useGetPhotographerApplicationsQuery();

  // Mutation hooks for approving/rejecting photographer applications
  const [approvePhotographer] = useApprovePhotographerApplicationMutation();
  const [rejectPhotographer] = useRejectPhotographerApplicationMutation();

  // Local state for section and viewing a user detail
  const [activeSection, setActiveSection] = useState("users");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  // Load detailed user info when needed
  const {
    data: selectedUserData,
    isLoading: loadingSelectedUser,
    isError: errorSelectedUser,
    error: selectedUserError,
  } = useGetUserByIdQuery(selectedUserId, {
    skip: selectedUserId === null,
  });

  // Consolidate loading and error states
  const isLoadingAny =
    loadingStats || loadingUsers || loadingApplications || loadingSelectedUser;
  const isErrorAny =
    errorStats || errorUsers || errorApplications || errorSelectedUser;

  // Handlers for approving/rejecting from the main dashboard
  const handleApprove = async (photographerId) => {
    try {
      await approvePhotographer(photographerId).unwrap();
      console.log("Application approved for photographer ID:", photographerId);
      // Optionally, refetch queries or update local state.
    } catch (err) {
      console.error("Error approving application:", err);
    }
  };

  const handleReject = async (photographerId) => {
    try {
      await rejectPhotographer(photographerId).unwrap();
      console.log("Application rejected for photographer ID:", photographerId);
      // Optionally, refetch queries or update local state.
    } catch (err) {
      console.error("Error rejecting application:", err);
    }
  };

  const handleViewUser = (userId) => {
    setSelectedUserId(userId);
    setShowUserModal(true);
  };

  const closeUserModal = () => {
    setShowUserModal(false);
    setSelectedUserId(null);
  };

  if (isLoadingAny) {
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

  if (isErrorAny) {
    return (
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />
        <div className="flex-1">
          <main className="py-8 md:ml-64">
            <div className="container mx-auto px-4">
              <p className="text-center text-xl text-red-600">
                Error loading dashboard:{" "}
                {statsError?.message ||
                  usersError?.message ||
                  applicationsError?.message ||
                  selectedUserError?.message ||
                  "Unknown error"}
              </p>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    );
  }

  // Extract stats and user list
  const totalUsers = dashboardStats?.totalUsers || 0;
  const activePhotographers = dashboardStats?.activePhotographers || 0;
  const pendingApplications = dashboardStats?.pendingApplications || 0;
  const allUsers = usersData?.users || [];
  const pendingApps = photographerApplications || [];

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1">
        <main className="py-8 md:ml-64">
          <div className="container mx-auto px-4">
            {/* Dashboard Header */}
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
              <div className="rounded-lg border bg-white p-6 shadow-sm flex flex-col items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h2 className="mt-3 text-2xl font-bold">{totalUsers}</h2>
                <p className="text-gray-500">Total Users</p>
              </div>
              <div className="rounded-lg border bg-white p-6 shadow-sm flex flex-col items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                  <Camera className="h-6 w-6 text-purple-600" />
                </div>
                <h2 className="mt-3 text-2xl font-bold">
                  {activePhotographers}
                </h2>
                <p className="text-gray-500">Active Photographers</p>
              </div>
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
              {/* <button
                className={`px-4 py-2 rounded-md font-medium ${
                  activeSection === "applications"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
                onClick={() => setActiveSection("applications")}
              >
                Photographer Applications
              </button> */}
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
                  {pendingApps && pendingApps.length > 0 ? (
                    <div className="space-y-4">
                      {pendingApps.map((app) => (
                        <div
                          key={app.id}
                          className="rounded-lg border bg-white p-4 shadow-sm"
                        >
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{app.name}</h3>
                                <span className="inline-block rounded px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800">
                                  Pending
                                </span>
                              </div>
                              <p className="text-sm text-gray-500">
                                Email: {app.email}
                              </p>
                              <p className="text-sm text-gray-500">
                                Location: {app.location}
                              </p>
                              <p className="text-sm text-gray-500">
                                Specialty: {app.specialty}
                              </p>
                              <p className="text-sm text-gray-500">
                                Experience: {app.experience}
                              </p>
                              {app.applicationDate && (
                                <p className="text-sm text-gray-500">
                                  Applied: {app.applicationDate}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                className="rounded border border-green-500 px-3 py-1 text-sm font-medium text-green-500 hover:bg-green-50 hover:text-green-600"
                                onClick={() => handleApprove(app.id)}
                              >
                                <CheckCircle className="mr-1 h-4 w-4" />
                                Approve
                              </button>
                              <button
                                className="rounded border border-red-500 px-3 py-1 text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600"
                                onClick={() => handleReject(app.id)}
                              >
                                <XCircle className="mr-1 h-4 w-4" />
                                Reject
                              </button>
                              <button
                                className="rounded border px-3 py-1 text-sm font-medium text-gray-500 hover:bg-gray-50"
                                onClick={() =>
                                  console.log("View details:", app)
                                }
                              >
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
                          <th className="px-4 py-2 text-left">Actions</th>
                          <th className="px-4 py-2 text-left">Bookings</th>
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
                            <td className="px-4 py-2">
                              <div className="flex items-center gap-2">
                                <button
                                  className="px-3 py-1 rounded border text-sm text-gray-500 hover:bg-gray-50"
                                  onClick={() => handleViewUser(user.id)}
                                >
                                  <Eye className="mr-1 h-4 w-4" />
                                  View
                                </button>
                                {/* <button className="px-3 py-1 rounded border text-sm text-blue-500 hover:bg-blue-50">
                                  Edit
                                </button>
                                <button className="px-3 py-1 rounded border text-sm text-red-500 hover:bg-red-50">
                                  Delete
                                </button> */}
                              </div>
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

      {/* User Detail Modal */}
      {showUserModal && (
        <UserDetailModal
          userId={selectedUserId}
          onClose={closeUserModal}
          data={selectedUserData}
          loading={loadingSelectedUser}
          error={selectedUserError}
          handleApprove={handleApprove}
          handleReject={handleReject}
        />
      )}
    </div>
  );
}

/** Modal component for user details */
function UserDetailModal({
  userId,
  onClose,
  data,
  loading,
  error,
  handleApprove,
  handleReject,
}) {
  // Assume API returns the user details directly or under data.user
  const user = data?.user || data;
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow">
          <p>Loading user details...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow">
          <p className="text-red-600">Error loading user details</p>
          <button onClick={onClose} className="mt-2 px-4 py-2 border rounded">
            Close
          </button>
        </div>
      </div>
    );
  }
  if (!user) return null;

  // Check if this user has a pending photographer application
  const isPendingPhotographer =
    user.photographerProfile &&
    user.photographerProfile.applicationStatus === "pending";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">User Details</h2>
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        {/* Additional user details as needed */}
        {isPendingPhotographer && (
          <div className="mt-4 bg-yellow-50 p-3 rounded">
            <p className="text-sm text-gray-700 mb-2">
              This user has a pending photographer application.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleApprove(user.photographerProfile.id)}
                className="mr-2 px-3 py-1 border rounded text-green-600"
              >
                Approve
              </button>
              <button
                onClick={() => handleReject(user.photographerProfile.id)}
                className="px-3 py-1 border rounded text-red-600"
              >
                Reject
              </button>
            </div>
          </div>
        )}
        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
