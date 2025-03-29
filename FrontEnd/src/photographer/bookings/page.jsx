import React, { useState } from "react";
import {
  Calendar,
  ChevronRight,
  Clock,
  Download,
  MapPin,
  Search,
  Video,
} from "lucide-react";
import DashboardLayout from "../DashboardLayout";
import {
  useGetAllBookingsQuery,
  useUpdateBookingStatusMutation,
} from "../../redux/api/bookingApi";
import { useSelector } from "react-redux";

// Status mapping for display
const statusMap = {
  pending: {
    label: "Pending Confirmation",
    color: "bg-yellow-100 text-yellow-800",
  },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-800" },
  completed: { label: "Completed", color: "bg-green-100 text-green-800" },
  canceled: { label: "Canceled", color: "bg-gray-100 text-gray-800" },
};

export default function PhotographerBookingsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Retrieve authenticated user info from Redux store
  const { user } = useSelector((state) => state.auth);
  // If user has an associated photographer profile, we treat them as photographer.
  const isPhotographer = Boolean(user && user.photographerProfile);

  // Fetch all bookings from the backend
  const {
    data: bookingData,
    isLoading,
    isError,
    error,
  } = useGetAllBookingsQuery({});

  // Mutation hook to update booking status (approve or reject)
  const [updateBookingStatus, { isLoading: updatingStatus }] =
    useUpdateBookingStatusMutation();

  // Extract bookings from the response (adjust according to your response shape)
  const bookings = bookingData?.bookings || [];

  // Filter bookings based on active tab and search term
  const filteredBookings = bookings.filter((booking) => {
    const matchesTab = activeTab === "all" || booking.status === activeTab;
    const term = searchTerm.toLowerCase();

    const clientName = booking.clientName
      ? booking.clientName.toLowerCase()
      : "";
    const bookingId = booking.id ? booking.id.toLowerCase() : "";
    const bookingType = booking.type ? booking.type.toLowerCase() : "";

    return (
      matchesTab &&
      (clientName.includes(term) ||
        bookingId.includes(term) ||
        bookingType.includes(term))
    );
  });

  // Handlers for approving and rejecting bookings
  const handleAccept = async (bookingId) => {
    try {
      await updateBookingStatus({
        id: bookingId,
        status: "confirmed",
        reason: "Accepted by photographer",
      }).unwrap();
      alert("Booking accepted!");
    } catch (err) {
      console.error("Accept error:", err);
      alert("Failed to accept booking");
    }
  };

  const handleDecline = async (bookingId) => {
    try {
      await updateBookingStatus({
        id: bookingId,
        status: "canceled",
        reason: "Declined by photographer",
      }).unwrap();
      alert("Booking declined!");
    } catch (err) {
      console.error("Decline error:", err);
      alert("Failed to decline booking");
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-screen flex-col bg-gray-50 items-center justify-center">
          <p className="text-center text-xl text-gray-600">
            Loading bookings...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout>
        <div className="flex min-h-screen flex-col bg-gray-50 items-center justify-center">
          <p className="text-center text-xl text-red-600">
            Error loading bookings: {error?.message || "Unknown error"}
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-purple-800">My Bookings</h1>
          <p className="text-muted-foreground">
            Manage your photography sessions
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search bookings..."
              className="pl-9 w-[250px] rounded border border-gray-300 bg-white px-3 py-2 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Bookings Card */}
      <div className="border rounded-lg shadow-sm">
        <div className="border-b p-4">
          <h3 className="text-lg font-bold">All Bookings</h3>
        </div>
        <div className="p-4">
          {/* Tabs */}
          <div className="grid grid-cols-5 gap-2">
            {["all", "pending", "confirmed", "completed", "canceled"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded ${
                    activeTab === tab
                      ? "bg-gray-300"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              )
            )}
          </div>

          {/* Bookings List */}
          <div className="mt-6 space-y-6">
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-lg border bg-white shadow overflow-hidden"
                >
                  {/* Booking Header */}
                  <div className="bg-gray-100 p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-medium">
                            {booking.id}
                          </h3>
                          <span
                            className={`${
                              statusMap[booking.status].color
                            } rounded px-2 py-1 text-xs font-medium`}
                          >
                            {statusMap[booking.status].label}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Booking time: {booking.createTime}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {booking.status === "pending" && isPhotographer && (
                          <>
                            <button
                              onClick={() => handleAccept(booking.id)}
                              className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-sm"
                              disabled={updatingStatus}
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleDecline(booking.id)}
                              className="border border-red-600 text-red-600 hover:bg-red-50 px-2 py-1 rounded text-sm"
                              disabled={updatingStatus}
                            >
                              Decline
                            </button>
                          </>
                        )}
                        {booking.status === "confirmed" && (
                          <button className="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded text-sm">
                            <Video className="mr-1 inline h-4 w-4" />
                            Contact Client
                          </button>
                        )}
                        {booking.status === "completed" && (
                          <button className="border rounded px-2 py-1 text-sm">
                            <Download className="mr-1 inline h-4 w-4" />
                            Upload Photos
                          </button>
                        )}
                        <button className="border rounded px-2 py-1 text-sm">
                          Details
                          <ChevronRight className="ml-1 inline h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Booking Body */}
                  <div className="p-0">
                    <div className="grid md:grid-cols-[200px_1fr]">
                      <div className="relative">
                        <div className="flex h-full items-center justify-center bg-purple-50 p-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-700">
                              {booking.date.split("-")[2]}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(booking.date).toLocaleString(
                                "default",
                                {
                                  month: "short",
                                }
                              )}
                            </div>
                            <div className="mt-2 text-sm font-medium">
                              {booking.type}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <h3 className="font-semibold text-lg">
                              Client: {booking.clientName}
                            </h3>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <MapPin className="mr-1 inline h-4 w-4 text-purple-600" />
                              {booking.location}
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center text-sm">
                                <Calendar className="mr-1 inline h-4 w-4 text-purple-600" />
                                <span>{booking.date}</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <Clock className="mr-1 inline h-4 w-4 text-purple-600" />
                                <span>{booking.time}</span>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2 md:text-right">
                            <div className="text-sm text-muted-foreground">
                              Duration
                            </div>
                            <div className="font-medium">
                              {booking.duration} hours
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Total Price
                            </div>
                            <div className="text-xl font-bold text-purple-700">
                              ${booking.totalPrice}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex h-60 flex-col items-center justify-center rounded-lg border border-dashed">
                <Calendar className="h-12 w-12 text-gray-300" />
                <h3 className="mt-4 text-lg font-medium">
                  No {activeTab !== "all" ? activeTab : ""} bookings
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  You don't have any {activeTab !== "all" ? activeTab : ""}{" "}
                  bookings at the moment
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
