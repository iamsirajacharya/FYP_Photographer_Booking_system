import React, { useState } from "react";
import { Header } from "../../../UI/header";
import { Footer } from "../../../UI/footer";
import { AdminSidebar } from "../../../UI/admin-sidebar";
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Download,
  XCircle,
  Calendar,
} from "lucide-react";
import { useGetAllBookingsQuery } from "../../redux/api/adminApi";

// Status mapping for bookings
const bookingStatusMap = {
  Pending: { color: "bg-yellow-100 text-yellow-800" },
  Confirmed: { color: "bg-blue-100 text-blue-800" },
  Completed: { color: "bg-green-100 text-green-800" },
  Canceled: { color: "bg-gray-100 text-gray-800" },
};

export default function BookingsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 6;

  // Use RTK Query to fetch bookings from the server
  const { data, error, isLoading } = useGetAllBookingsQuery({
    page: currentPage,
    limit: bookingsPerPage,
    search: searchTerm,
    status: filterStatus !== "all" ? filterStatus : "",
    type: filterType !== "all" ? filterType : "",
  });

  // Destructure server response
  const bookings = data?.bookings || [];
  const totalPages = data?.totalPages || 1;
  const totalBookings = data?.totalBookings || 0;

  // Indices for display (the server handles actual pagination, these are for showing counts)
  const indexOfFirstBooking = (currentPage - 1) * bookingsPerPage;
  const indexOfLastBooking = Math.min(
    currentPage * bookingsPerPage,
    totalBookings
  );

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* <Header /> */}
      <div className="flex flex-1">
        {/* Admin Sidebar */}
        <AdminSidebar />

        {/* Main content offset for sidebar on medium+ screens */}
        <main className="flex-1 p-6 md:ml-64 md:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-purple-800">
              Booking Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage all photography session bookings
            </p>
          </div>

          <div className="rounded-lg border bg-white shadow-sm">
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 p-4">
              <div>
                <h2 className="flex items-center text-lg font-medium">
                  <Calendar className="mr-2 h-5 w-5 text-purple-600" />
                  All Bookings
                </h2>
                <p className="text-muted-foreground">
                  View and manage photography session bookings
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    placeholder="Search bookings..."
                    className="pl-9 w-full md:w-[200px]"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
                <div>
                  <select
                    value={filterStatus}
                    onChange={(e) => {
                      setFilterStatus(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full md:w-[150px] rounded-md border px-3 py-2"
                  >
                    <option value="all">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Canceled">Canceled</option>
                  </select>
                </div>
                <div>
                  <select
                    value={filterType}
                    onChange={(e) => {
                      setFilterType(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full md:w-[150px] rounded-md border px-3 py-2"
                  >
                    <option value="all">All Types</option>
                    <option value="Portrait">Portrait</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Family">Family</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Event">Event</option>
                    <option value="Headshot">Headshot</option>
                  </select>
                </div>
                <button
                  type="button"
                  className="h-10 w-10 shrink-0 inline-flex items-center justify-center rounded-md border bg-white shadow-sm transition-colors hover:bg-gray-50"
                >
                  <Filter className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Loading & Error states */}
            {isLoading ? (
              <div className="p-4">Loading bookings...</div>
            ) : error ? (
              <div className="p-4 text-red-600">
                Error loading bookings. Please try again later.
              </div>
            ) : (
              <>
                <div className="p-4">
                  <div className="overflow-hidden rounded-lg border shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-muted/50">
                            {/* Serial # Column */}
                            <th className="px-4 py-3.5 text-left text-sm font-medium text-muted-foreground w-14">
                              #
                            </th>
                            <th className="px-4 py-3.5 text-left text-sm font-medium text-muted-foreground hidden md:table-cell">
                              Client
                            </th>
                            <th className="px-4 py-3.5 text-left text-sm font-medium text-muted-foreground hidden lg:table-cell">
                              Photographer
                            </th>
                            <th className="px-4 py-3.5 text-left text-sm font-medium text-muted-foreground">
                              Date &amp; Time
                            </th>
                            <th className="px-4 py-3.5 text-left text-sm font-medium text-muted-foreground hidden xl:table-cell">
                              Type
                            </th>
                            <th className="px-4 py-3.5 text-left text-sm font-medium text-muted-foreground">
                              Status
                            </th>
                            <th className="px-4 py-3.5 text-left text-sm font-medium text-muted-foreground hidden lg:table-cell">
                              Amount
                            </th>
                            <th className="px-4 py-3.5 text-left text-sm font-medium text-muted-foreground hidden xl:table-cell">
                              Created
                            </th>
                            {/* Center Actions Column */}
                            <th className="px-4 py-3.5 text-center text-sm font-medium text-muted-foreground">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {bookings.map((booking, index) => {
                            // Calculate row number across pages
                            const rowNumber = indexOfFirstBooking + index + 1;
                            return (
                              <tr
                                key={booking.id}
                                className="hover:bg-muted/30 transition-colors"
                              >
                                <td className="px-4 py-3.5 text-sm font-medium whitespace-nowrap">
                                  {rowNumber}
                                </td>
                                <td className="px-4 py-3.5 text-sm hidden md:table-cell">
                                  <div>
                                    <p className="font-medium">
                                      {booking.client?.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                                      {booking.client?.email}
                                    </p>
                                  </div>
                                </td>
                                <td className="px-4 py-3.5 text-sm hidden lg:table-cell">
                                  <div>
                                    <p className="font-medium">
                                      {booking.photographer?.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                                      {booking.photographer?.email}
                                    </p>
                                  </div>
                                </td>
                                <td className="px-4 py-3.5 text-sm whitespace-nowrap">
                                  <div className="flex flex-col">
                                    <span className="font-medium">
                                      {booking.date}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {booking.time}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-4 py-3.5 text-sm hidden xl:table-cell">
                                  {booking.type}
                                </td>
                                <td className="px-4 py-3.5">
                                  <span
                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                      bookingStatusMap[booking.status]?.color
                                    }`}
                                  >
                                    {booking.status}
                                  </span>
                                </td>
                                <td className="px-4 py-3.5 text-sm font-medium hidden lg:table-cell">
                                  {booking.amount}
                                </td>
                                <td className="px-4 py-3.5 text-sm hidden xl:table-cell whitespace-nowrap">
                                  {booking.createdAt}
                                </td>
                                {/* Centered Actions */}
                                <td className="px-4 py-3.5 text-center">
                                  <div className="relative inline-block text-left">
                                    <button
                                      type="button"
                                      className="h-8 w-8 p-0 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                    </button>
                                    {/* Dropdown Menu */}
                                    <div className="absolute right-0 mt-2 w-[160px] rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                                      <div
                                        className="py-1"
                                        role="menu"
                                        aria-orientation="vertical"
                                        aria-labelledby="options-menu"
                                      >
                                        {/* View Details - icon only */}
                                        <a
                                          href="#"
                                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                          role="menuitem"
                                          aria-label="View Details"
                                        >
                                          <Eye className="h-4 w-4" />
                                        </a>
                                        {/* Edit Booking - icon only */}
                                        <a
                                          href="#"
                                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                          role="menuitem"
                                          aria-label="Edit Booking"
                                        >
                                          <Edit className="h-4 w-4" />
                                        </a>
                                        {/* Download Invoice (with text) */}
                                        {booking.status === "Completed" && (
                                          <a
                                            href="#"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                            role="menuitem"
                                          >
                                            <Download className="mr-2 h-4 w-4 inline-block" />
                                            Download Invoice
                                          </a>
                                        )}
                                        <hr className="border-gray-200 my-1" />
                                        {/* Cancel Booking (with text) */}
                                        {(booking.status === "Pending" ||
                                          booking.status === "Confirmed") && (
                                          <a
                                            href="#"
                                            className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 hover:text-red-700"
                                            role="menuitem"
                                          >
                                            <XCircle className="mr-2 h-4 w-4 inline-block" />
                                            Cancel Booking
                                          </a>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    {/* Pagination */}
                    <div className="flex items-center justify-between border-t bg-muted/10 px-4 py-3">
                      <p className="text-sm text-muted-foreground">
                        Showing{" "}
                        <span className="font-medium">
                          {indexOfFirstBooking + 1}-{indexOfLastBooking}
                        </span>{" "}
                        of <span className="font-medium">{totalBookings}</span>{" "}
                        bookings
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        <button
                          type="button"
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-end border-t bg-muted/10 px-4 py-3 gap-2">
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-50"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        View Calendar
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-50"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Export Bookings
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
      {/* <Footer /> */}
    </div>
  );
}
