import React, { useState } from "react";
import { Header } from "../../../UI/header";
import { Footer } from "../../../UI/footer";
import { AdminSidebar } from "../../../UI/admin-sidebar";
import { Search, Filter, MoreHorizontal, UserPlus, Users } from "lucide-react";
import { useGetAllUsersQuery } from "../../redux/api/adminApi";

// Define a mapping for user statuses (adjust values as needed)
const userStatusMap = {
  Active: "bg-green-100 text-green-800",
  Inactive: "bg-gray-100 text-gray-800",
  Suspended: "bg-red-100 text-red-800",
};

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

  // Use the RTK Query hook with query parameters
  const {
    data: usersData,
    error,
    isLoading,
  } = useGetAllUsersQuery({
    page: currentPage,
    limit: usersPerPage,
    search: searchTerm,
    role: filterRole !== "all" ? filterRole : "",
    status: filterStatus !== "all" ? filterStatus : "",
  });

  // Destructure data from the query result
  const users = usersData?.users || [];
  const totalUsers = usersData?.totalUsers || 0;
  const totalPages = usersData?.totalPages || 1;
  const indexOfFirstUser = (currentPage - 1) * usersPerPage;
  const indexOfLastUser = Math.min(currentPage * usersPerPage, totalUsers);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-6 md:p-8">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-purple-800">
                User Management
              </h1>
              <p className="text-gray-500 mt-1">
                Manage all users on the platform
              </p>
            </div>
            <button className="mt-4 sm:mt-0 bg-purple-600 hover:bg-purple-700 shadow py-2 px-4 rounded text-white font-medium flex items-center">
              <UserPlus className="mr-2 h-4 w-4" /> Add New User
            </button>
          </div>

          <div className="rounded-lg border shadow-sm bg-white">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center p-4 gap-4">
              <div>
                <h2 className="flex items-center text-lg font-medium">
                  <Users className="mr-2 h-5 w-5 text-purple-600" /> All Users
                </h2>
                <p className="text-gray-500">View and manage user accounts</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    placeholder="Search users..."
                    className="pl-9 w-full md:w-[200px] border rounded px-3 py-2"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1); // Reset to first page on search
                    }}
                  />
                </div>
                <select
                  value={filterRole}
                  onChange={(e) => {
                    setFilterRole(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full md:w-[130px] rounded border px-3 py-2"
                >
                  <option value="all">All Roles</option>
                  <option value="Client">Clients</option>
                  <option value="Photographer">Photographers</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full md:w-[130px] rounded border px-3 py-2"
                >
                  <option value="all">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Suspended">Suspended</option>
                </select>
                <button className="h-10 w-10 inline-flex items-center justify-center rounded border bg-white hover:bg-gray-50">
                  <Filter className="h-4 w-4" />
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="p-4">Loading...</div>
            ) : error ? (
              <div className="p-4 text-red-500">
                Error loading users. Please try again later.
              </div>
            ) : (
              <>
                <div className="overflow-x-auto border-t">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-3 text-left">User</th>
                        <th className="px-4 py-3 text-left hidden md:table-cell">
                          Email
                        </th>
                        <th className="px-4 py-3 text-left">Role</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-left hidden lg:table-cell">
                          Join Date
                        </th>
                        <th className="px-4 py-3 text-left hidden xl:table-cell">
                          Bookings
                        </th>
                        <th className="px-4 py-3 text-left hidden xl:table-cell">
                          Last Active
                        </th>
                        <th className="px-4 py-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 flex items-center gap-2">
                            <img
                              src="/placeholder.svg"
                              alt={user.name}
                              className="h-8 w-8 rounded-full object-cover border"
                            />
                            <span className="font-medium">{user.name}</span>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            {user.email}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.role === "Photographer"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                userStatusMap[user.status]
                              }`}
                            >
                              {user.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 hidden lg:table-cell">
                            {user.joinDate}
                          </td>
                          <td className="px-4 py-3 hidden xl:table-cell">
                            {user.bookings}
                          </td>
                          <td className="px-4 py-3 hidden xl:table-cell">
                            {user.lastActive}
                          </td>
                          <td className="px-4 py-3">
                            <button className="h-8 w-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
                              <MoreHorizontal className="h-4 w-4 text-gray-600" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between items-center border-t bg-gray-50 px-4 py-3">
                  <p className="text-sm text-gray-500">
                    Showing{" "}
                    <span className="font-medium">
                      {indexOfFirstUser + 1}-{indexOfLastUser}
                    </span>{" "}
                    of <span className="font-medium">{totalUsers}</span>
                  </p>
                  <div className="space-x-2">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 rounded border disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 rounded border disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
