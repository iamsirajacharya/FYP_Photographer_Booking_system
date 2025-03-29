import { Link } from "react-router-dom";
import { Header } from "../../UI/header";
import { Footer } from "../../UI/footer";
import {
  Calendar,
  ChevronRight,
  Clock,
  Download,
  MapPin,
  Star,
  Video,
} from "lucide-react";

// Mock booking data
const bookings = [
  {
    id: "BKG20231001",
    photographerName: "Alex Morgan",
    photographerImage: "/placeholder.svg?height=400&width=600",
    location: "New York City",
    date: "2023-10-15",
    time: "10:00 AM - 12:00 PM",
    duration: 2,
    price: 120,
    totalPrice: 240,
    status: "completed",
    createTime: "2023-09-30 14:30",
    payTime: "2023-09-30 14:35",
    isRated: true,
    rating: 5,
    comment:
      "Alex was amazing! Very professional and made me feel comfortable during the shoot. The photos turned out better than I expected.",
  },
  {
    id: "BKG20230925",
    photographerName: "Sarah Chen",
    photographerImage: "/placeholder.svg?height=400&width=600",
    location: "Los Angeles",
    date: "2023-10-05",
    time: "2:00 PM - 5:00 PM",
    duration: 3,
    price: 150,
    totalPrice: 450,
    status: "completed",
    createTime: "2023-09-25 10:15",
    payTime: "2023-09-25 10:20",
    isRated: false,
  },
  {
    id: "BKG20231010",
    photographerName: "Michael Rodriguez",
    photographerImage: "/placeholder.svg?height=400&width=600",
    location: "Denver",
    date: "2023-10-25",
    time: "9:00 AM - 1:00 PM",
    duration: 4,
    price: 100,
    totalPrice: 400,
    status: "confirmed",
    createTime: "2023-10-10 16:45",
    payTime: "2023-10-10 16:50",
  },
  {
    id: "BKG20231012",
    photographerName: "Emma Wilson",
    photographerImage: "/placeholder.svg?height=400&width=600",
    location: "Chicago",
    date: "2023-11-05",
    time: "3:00 PM - 5:00 PM",
    duration: 2,
    price: 110,
    totalPrice: 220,
    status: "pending",
    createTime: "2023-10-12 09:20",
  },
  {
    id: "BKG20230918",
    photographerName: "David Kim",
    photographerImage: "/placeholder.svg?height=400&width=600",
    location: "Seattle",
    date: "2023-09-20",
    time: "1:00 PM - 3:00 PM",
    duration: 2,
    price: 130,
    totalPrice: 260,
    status: "canceled",
    createTime: "2023-09-18 11:30",
    cancelTime: "2023-09-18 15:45",
  },
];

// Status mapping
const statusMap = {
  pending: {
    label: "Pending Confirmation",
    color: "bg-yellow-100 text-yellow-800",
  },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-800" },
  completed: { label: "Completed", color: "bg-green-100 text-green-800" },
  canceled: { label: "Canceled", color: "bg-gray-100 text-gray-800" },
};

export default function BookingsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-purple-800">My Bookings</h1>
            <p className="text-gray-500">
              View and manage all your photography sessions
            </p>
          </div>
          <Link
            to="/photographers"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded"
          >
            Book New Session
          </Link>
        </div>

        <div className="space-y-6">
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          ) : (
            <EmptyBookingState />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function BookingCard({ booking }) {
  return (
    <div className="bg-white rounded shadow overflow-hidden">
      <div className="bg-gray-100 p-4 flex justify-between items-center flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">{booking.id}</h2>
            <span
              className={`text-sm px-2 py-1 rounded ${
                statusMap[booking.status].color
              }`}
            >
              {statusMap[booking.status].label}
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Booking time: {booking.createTime}
          </p>
        </div>
        <div className="flex gap-2 mt-2 sm:mt-0">
          {booking.status === "pending" && (
            <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded">
              Cancel Request
            </button>
          )}
          {booking.status === "confirmed" && (
            <button className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded inline-flex items-center">
              <Video className="mr-1 h-4 w-4" /> Video Chat
            </button>
          )}
          {booking.status === "completed" && !booking.isRated && (
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 inline-flex items-center">
              <Star className="mr-1 h-4 w-4" /> Leave Review
            </button>
          )}
          <Link
            to={`/bookings/${booking.id}`}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 inline-flex items-center"
          >
            Booking Details <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-[200px_1fr]">
        <img
          src={booking.photographerImage}
          alt={booking.photographerName}
          className="w-full h-48 md:h-full object-cover"
        />
        <div className="p-4 space-y-3">
          <h3 className="text-lg font-semibold">{booking.photographerName}</h3>
          <div className="text-sm text-gray-500 flex items-center">
            <MapPin className="mr-1 h-4 w-4 text-purple-600" />{" "}
            {booking.location}
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center">
              <Calendar className="mr-1 h-4 w-4 text-purple-600" />{" "}
              {booking.date}
            </span>
            <span className="flex items-center">
              <Clock className="mr-1 h-4 w-4 text-purple-600" /> {booking.time}
            </span>
          </div>

          <div className="border-t pt-3 flex justify-between items-center">
            <div>
              <p className="text-sm">
                Hourly Rate:{" "}
                <span className="font-medium">${booking.price}</span>
              </p>
              <p className="text-sm font-semibold text-purple-700">
                Total: ${booking.totalPrice}
              </p>
            </div>

            {booking.status === "completed" && (
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 inline-flex items-center">
                <Download className="mr-1 h-4 w-4" /> Download Photos
              </button>
            )}
          </div>

          {booking.isRated && (
            <div className="border-t pt-3">
              <div className="flex items-center gap-2">
                {Array(5)
                  .fill(null)
                  .map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < booking.rating
                          ? "text-yellow-400 fill-current"
                          : "text-gray-200"
                      }`}
                    />
                  ))}
                <span className="text-sm text-gray-600">
                  {booking.rating}/5
                </span>
              </div>
              <p className="text-sm text-gray-700 mt-1">{booking.comment}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyBookingState() {
  return (
    <div className="h-60 flex flex-col justify-center items-center border border-dashed rounded bg-gray-50">
      <Calendar className="h-12 w-12 text-gray-300" />
      <h3 className="mt-3 font-medium text-lg">No bookings found</h3>
      <p className="mt-2 text-sm text-gray-500">
        Browse photographers and book your next session
      </p>
      <Link
        to="/photographers"
        className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded"
      >
        Browse Photographers
      </Link>
    </div>
  );
}
