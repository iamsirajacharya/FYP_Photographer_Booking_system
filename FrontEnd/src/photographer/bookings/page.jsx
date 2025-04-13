import { useState } from "react";
import {
  Calendar,
  ChevronRight,
  Clock,
  Download,
  Filter,
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
    label: "Pending",
    color:
      "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800/30",
  },
  confirmed: {
    label: "Confirmed",
    color:
      "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/30",
  },
  completed: {
    label: "Completed",
    color:
      "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800/30",
  },
  canceled: {
    label: "Canceled",
    color:
      "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
  },
};

export default function PhotographerBookingsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  // Local state mapping booking IDs to the currently selected new status
  const [statusUpdates, setStatusUpdates] = useState({});

  // Retrieve authenticated user info from Redux store
  const { user } = useSelector((state) => state.auth);
  const isPhotographer = Boolean(user && user.photographerProfile);

  // Fetch all bookings from the backend
  const {
    data: bookingData,
    isLoading,
    isError,
    error,
  } = useGetAllBookingsQuery({});

  // Mutation hook to update booking status
  const [updateBookingStatus, { isLoading: updatingStatus }] =
    useUpdateBookingStatusMutation();

  // Extract bookings from the response (adjust according to your response shape)
  const bookings = bookingData?.bookings || [
    {
      id: "BKG20231025",
      clientName: "Emily Davis",
      clientImage: "/placeholder.svg?height=64&width=64",
      date: "2023-10-25",
      time: "10:00 AM - 12:00 PM",
      location: "Central Park, New York",
      status: "pending",
      type: "Portrait Session",
      price: 240,
      duration: 2,
      totalPrice: 240,
      createTime: "2023-10-10",
      client: { name: "Emily Davis" },
    },
    {
      id: "BKG20231028",
      clientName: "Michael Johnson",
      clientImage: "/placeholder.svg?height=64&width=64",
      date: "2023-10-28",
      time: "2:00 PM - 5:00 PM",
      location: "Studio 42, Brooklyn",
      status: "confirmed",
      type: "Fashion Shoot",
      price: 450,
      duration: 3,
      totalPrice: 450,
      createTime: "2023-10-12",
      client: { name: "Michael Johnson" },
    },
    {
      id: "BKG20231102",
      clientName: "Sarah Wilson",
      clientImage: "/placeholder.svg?height=64&width=64",
      date: "2023-11-02",
      time: "9:00 AM - 11:00 AM",
      location: "Client's Home, Manhattan",
      status: "completed",
      type: "Family Portrait",
      price: 220,
      duration: 2,
      totalPrice: 220,
      createTime: "2023-10-15",
      client: { name: "Sarah Wilson" },
    },
    {
      id: "BKG20231105",
      clientName: "John Miller",
      clientImage: "/placeholder.svg?height=64&width=64",
      date: "2023-11-05",
      time: "3:00 PM - 6:00 PM",
      location: "Battery Park, New York",
      status: "canceled",
      type: "Engagement Photos",
      price: 350,
      duration: 3,
      totalPrice: 350,
      createTime: "2023-10-18",
      client: { name: "John Miller" },
    },
  ];

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

  // Unified status update handler for photographer actions
  const handleUpdateStatus = async (bookingId) => {
    // Get the new status selected in the dropdown (or fallback to current status)
    const newStatus =
      statusUpdates[bookingId] ||
      bookings.find((b) => b.id === bookingId)?.status;
    if (!newStatus) return;
    try {
      await updateBookingStatus({
        id: bookingId,
        status: newStatus,
        // Include a reason if canceled (adjust as needed)
        reason:
          newStatus === "canceled" ? "Canceled by photographer" : undefined,
      }).unwrap();
      alert("Booking status updated!");
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update booking status");
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] flex-col bg-gray-50 dark:bg-gray-950 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
          <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
            Loading bookings...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] flex-col bg-gray-50 dark:bg-gray-950 items-center justify-center">
          <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-3">
            <svg
              className="h-6 w-6 text-red-600 dark:text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-semibold text-red-600 dark:text-red-400">
            Error loading bookings
          </h3>
          <p className="text-center text-gray-600 dark:text-gray-400 max-w-md mt-2">
            {error?.message ||
              "Unknown error occurred while fetching your bookings. Please try again later."}
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            My Bookings
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-300">
            Manage your photography sessions
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
            <input
              placeholder="Search bookings..."
              className="pl-9 w-full sm:w-[220px] rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="relative p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          >
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </button>
        </div>
      </div>

      {/* Filter dropdown */}
      {isFilterOpen && (
        <div className="mb-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label
                htmlFor="filter-date"
                className="block text-sm font-medium text-gray-900 dark:text-white mb-1"
              >
                Filter by date
              </label>
              <input
                id="filter-date"
                type="date"
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
            <div>
              <label
                htmlFor="filter-type"
                className="block text-sm font-medium text-gray-900 dark:text-white mb-1"
              >
                Session Type
              </label>
              <select
                id="filter-type"
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              >
                <option value="">All Types</option>
                <option value="portrait">Portrait Session</option>
                <option value="wedding">Wedding Photography</option>
                <option value="fashion">Fashion Shoot</option>
                <option value="family">Family Portrait</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="filter-price"
                className="block text-sm font-medium text-gray-900 dark:text-white mb-1"
              >
                Price Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              className="inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 mr-2"
              onClick={() => setIsFilterOpen(false)}
            >
              Clear
            </button>
            <button
              className="inline-flex items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              onClick={() => setIsFilterOpen(false)}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
          <li className="mr-2">
            <button
              onClick={() => setActiveTab("all")}
              className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg ${
                activeTab === "all"
                  ? "text-purple-600 dark:text-purple-500 border-purple-600 dark:border-purple-500"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              }`}
            >
              All Bookings
              <span className="ml-2 rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-xs font-medium text-gray-900 dark:text-gray-300">
                {bookings.length}
              </span>
            </button>
          </li>
          <li className="mr-2">
            <button
              onClick={() => setActiveTab("pending")}
              className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg ${
                activeTab === "pending"
                  ? "text-amber-600 dark:text-amber-500 border-amber-600 dark:border-amber-500"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              }`}
            >
              Pending
              <span className="ml-2 rounded-full bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 text-xs font-medium text-amber-800 dark:text-amber-300">
                {bookings.filter((b) => b.status === "pending").length}
              </span>
            </button>
          </li>
          <li className="mr-2">
            <button
              onClick={() => setActiveTab("confirmed")}
              className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg ${
                activeTab === "confirmed"
                  ? "text-blue-600 dark:text-blue-500 border-blue-600 dark:border-blue-500"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              }`}
            >
              Confirmed
              <span className="ml-2 rounded-full bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 text-xs font-medium text-blue-800 dark:text-blue-300">
                {bookings.filter((b) => b.status === "confirmed").length}
              </span>
            </button>
          </li>
          <li className="mr-2">
            <button
              onClick={() => setActiveTab("completed")}
              className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg ${
                activeTab === "completed"
                  ? "text-emerald-600 dark:text-emerald-500 border-emerald-600 dark:border-emerald-500"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              }`}
            >
              Completed
              <span className="ml-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:text-emerald-300">
                {bookings.filter((b) => b.status === "completed").length}
              </span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("canceled")}
              className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg ${
                activeTab === "canceled"
                  ? "text-gray-600 dark:text-gray-400 border-gray-600 dark:border-gray-500"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              }`}
            >
              Canceled
              <span className="ml-2 rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-xs font-medium text-gray-800 dark:text-gray-300">
                {bookings.filter((b) => b.status === "canceled").length}
              </span>
            </button>
          </li>
        </ul>
      </div>

      {/* Bookings List */}
      <div className="space-y-6">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden transition-all hover:shadow-md"
            >
              {/* Booking Header */}
              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 sm:p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-medium text-gray-900 dark:text-white">
                        {booking.id}
                      </h3>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                          statusMap[booking.status].color
                        }`}
                      >
                        {statusMap[booking.status].label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Booking time: {booking.createTime}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {booking.status === "confirmed" && (
                      <button className="inline-flex items-center justify-center rounded-md bg-purple-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                        <Video className="mr-1 h-3.5 w-3.5" />
                        Contact Client
                      </button>
                    )}
                    {booking.status === "completed" && (
                      <button className="inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:ring-offset-2">
                        <Download className="mr-1 h-3.5 w-3.5" />
                        Upload Photos
                      </button>
                    )}
                    <button className="inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:ring-offset-2">
                      Details
                      <ChevronRight className="ml-1 h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Booking Body */}
              <div className="grid md:grid-cols-[180px_1fr]">
                <div className="relative">
                  <div className="flex h-full items-center justify-center bg-purple-50 dark:bg-purple-900/20 p-6 md:p-8">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-700 dark:text-purple-400">
                        {booking.date.split("-")[2]}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(booking.date).toLocaleString("default", {
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                      <div className="mt-3 inline-flex rounded-full bg-white dark:bg-gray-800 px-3 py-1 text-sm font-medium text-gray-900 dark:text-white shadow-sm border border-gray-200 dark:border-gray-700">
                        {booking.type}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-full overflow-hidden">
                          <img
                            src={
                              booking.clientImage ||
                              "/placeholder.svg?height=64&width=64"
                            }
                            alt={booking.client?.name || "Client"}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {booking.client?.name || booking.clientName}
                        </h3>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="mr-1.5 h-4 w-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                        <span>{booking.location}</span>
                      </div>
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="mr-1.5 h-4 w-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                          <span>{booking.date}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Clock className="mr-1.5 h-4 w-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                          <span>{booking.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 md:text-right">
                      <div className="flex items-center justify-between md:flex-col md:items-end">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Duration
                        </div>
                        <div className="ml-2 md:ml-0 font-medium text-gray-900 dark:text-white">
                          {booking.duration}{" "}
                          {booking.duration === 1 ? "hour" : "hours"}
                        </div>
                      </div>
                      <div className="flex items-center justify-between md:flex-col md:items-end">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Price per hour
                        </div>
                        <div className="ml-2 md:ml-0 font-medium text-gray-900 dark:text-white">
                          ${booking.price}
                        </div>
                      </div>
                      <div className="flex items-center justify-between md:flex-col md:items-end">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          Total Price
                        </div>
                        <div className="ml-2 md:ml-0 text-lg font-semibold text-purple-700 dark:text-purple-400">
                          ${booking.totalPrice}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Photographer Status Update Section */}
              {isPhotographer && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2">
                  <label
                    htmlFor={`status-${booking.id}`}
                    className="text-sm text-gray-600 dark:text-gray-400"
                  >
                    Update Status:
                  </label>
                  <select
                    id={`status-${booking.id}`}
                    value={statusUpdates[booking.id] || booking.status}
                    onChange={(e) =>
                      setStatusUpdates({
                        ...statusUpdates,
                        [booking.id]: e.target.value,
                      })
                    }
                    className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="canceled">Canceled</option>
                  </select>
                  <button
                    onClick={() => handleUpdateStatus(booking.id)}
                    disabled={
                      (statusUpdates[booking.id] || booking.status) ===
                        booking.status || updatingStatus
                    }
                    className="inline-flex items-center justify-center rounded-md bg-purple-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-70"
                  >
                    Update
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-12 text-center">
            <div className="rounded-full bg-gray-100 dark:bg-gray-700 p-3">
              <Calendar className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              No bookings found
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {activeTab === "all"
                ? "You don't have any bookings yet."
                : `You don't have any ${activeTab} bookings.`}
            </p>
            <button className="mt-6 inline-flex items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
              <Calendar className="mr-2 h-4 w-4" />
              Update Availability
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
