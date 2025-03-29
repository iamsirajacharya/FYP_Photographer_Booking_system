import { Link } from "react-router-dom";
import { Header } from "../../../UI/header";
import { Footer } from "../../../UI/footer";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Download,
  MapPin,
  Star,
  Video,
} from "lucide-react";

export default function BookingDetailPage({ params }) {
  const booking = {
    id: params.id,
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
    sessionDetails: {
      type: "Portrait Photography",
      location: "Central Park, New York",
      outfit: "2-3 casual outfits",
      deliverables: "20 edited digital photos",
    },
    contactInfo: {
      name: "John Smith",
      phone: "123****4567",
      email: "john***@example.com",
    },
    paymentInfo: {
      method: "Credit Card",
      transactionId: "TXN20230930143512345",
      discount: "First-time client discount",
      discountAmount: 20,
      originalPrice: 260,
    },
  };

  const statusMap = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    canceled: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <Link
          to="/bookings"
          className="inline-flex items-center text-purple-600 hover:text-purple-800 mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Bookings
        </Link>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-purple-800">
              Booking Details
            </h1>
            <span
              className={`inline-block rounded px-2 py-1 text-sm ${
                statusMap[booking.status]
              }`}
            >
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
            <p className="text-gray-500 mt-1">Booking ID: {booking.id}</p>
          </div>
          <div className="flex gap-2 mt-4 sm:mt-0">
            {booking.status === "confirmed" && (
              <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded flex items-center">
                <Video className="mr-2 h-4 w-4" /> Video Chat
              </button>
            )}
            {booking.status === "completed" && (
              <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 flex items-center">
                <Download className="mr-2 h-4 w-4" /> Download Photos
              </button>
            )}
            <Link
              to={`/photographers/${encodeURIComponent(
                booking.photographerName
              )}`}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
            >
              View Photographer
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Photographer Information */}
            <div className="bg-white shadow rounded p-6">
              <h2 className="font-semibold text-lg mb-4">
                Photographer Information
              </h2>
              <div className="flex gap-4">
                <img
                  src={booking.photographerImage}
                  alt={booking.photographerName}
                  className="h-40 w-48 rounded object-cover"
                />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">
                    {booking.photographerName}
                  </h3>
                  <p className="text-sm flex items-center text-gray-600">
                    <MapPin className="mr-1 h-4 w-4 text-purple-600" />{" "}
                    {booking.location}
                  </p>
                  <p className="text-sm flex items-center text-gray-600">
                    <Calendar className="mr-1 h-4 w-4 text-purple-600" />{" "}
                    {booking.date}
                  </p>
                  <p className="text-sm flex items-center text-gray-600">
                    <Clock className="mr-1 h-4 w-4 text-purple-600" />{" "}
                    {booking.time}
                  </p>
                </div>
              </div>
            </div>

            {/* Booking Timeline */}
            <div className="bg-white shadow rounded p-6">
              <h2 className="font-semibold text-lg mb-4">Booking Timeline</h2>
              <ul className="space-y-4 border-l-2 border-purple-300 pl-4">
                <li>
                  <h4 className="font-medium">Booking Created</h4>
                  <p className="text-sm text-gray-500">{booking.createTime}</p>
                </li>
                <li>
                  <h4 className="font-medium">Booking Confirmed</h4>
                  <p className="text-sm text-gray-500">{booking.payTime}</p>
                  <p className="text-sm text-gray-500">
                    Payment: {booking.paymentInfo.method}
                  </p>
                </li>
                <li>
                  <h4 className="font-medium">Session Completed</h4>
                  <p className="text-sm text-gray-500">{booking.date}</p>
                </li>
              </ul>
            </div>

            {/* Review Information */}
            {booking.isRated && (
              <div className="bg-white shadow rounded p-6">
                <h2 className="font-semibold text-lg mb-4">My Review</h2>
                <div className="flex items-center mb-2">
                  {Array(5)
                    .fill(null)
                    .map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < booking.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-200"
                        }`}
                      />
                    ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {booking.rating}/5
                  </span>
                </div>
                <p className="text-sm text-gray-700">{booking.comment}</p>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Price Details */}
            <div className="bg-white shadow rounded p-6">
              <h2 className="font-semibold text-lg mb-4">Price Details</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Hourly Rate</span>
                  <span>
                    ${booking.price} × {booking.duration}h
                  </span>
                </div>
                {booking.paymentInfo.discount && (
                  <div className="flex justify-between text-red-500">
                    <span>Discount</span>
                    <span>- ${booking.paymentInfo.discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-gray-200 pt-2 font-semibold">
                  <span>Total</span>
                  <span>${booking.totalPrice}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
