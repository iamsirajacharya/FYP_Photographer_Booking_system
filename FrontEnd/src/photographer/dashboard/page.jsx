import React from "react";
import {
  Calendar,
  Camera,
  ChevronRight,
  Clock,
  DollarSign,
  Star,
  Users,
} from "lucide-react";
import DashboardLayout from "../DashboardLayout";

export default function PhotographerDashboard() {
  // Mock data
  const photographer = {
    name: "Alex Morgan",
    specialty: "Portrait & Fashion",
    rating: 4.9,
    reviews: 128,
    avatar: "/placeholder.svg?height=100&width=100",
    earnings: {
      today: 240,
      thisWeek: 960,
      thisMonth: 3840,
    },
    stats: {
      totalBookings: 42,
      completedBookings: 38,
      pendingBookings: 3,
      canceledBookings: 1,
    },
  };

  const upcomingBookings = [
    {
      id: "BKG20231025",
      clientName: "Emily Davis",
      date: "2023-10-25",
      time: "10:00 AM - 12:00 PM",
      location: "Central Park, New York",
      status: "confirmed",
      type: "Portrait Session",
      price: 240,
    },
    {
      id: "BKG20231028",
      clientName: "Michael Johnson",
      date: "2023-10-28",
      time: "2:00 PM - 5:00 PM",
      location: "Studio 42, Brooklyn",
      status: "confirmed",
      type: "Fashion Shoot",
      price: 450,
    },
    {
      id: "BKG20231102",
      clientName: "Sarah Wilson",
      date: "2023-11-02",
      time: "9:00 AM - 11:00 AM",
      location: "Client's Home, Manhattan",
      status: "pending",
      type: "Family Portrait",
      price: 220,
    },
  ];

  const recentReviews = [
    {
      id: 1,
      clientName: "Emily Davis",
      date: "2023-10-15",
      rating: 5,
      comment:
        "Alex was amazing! Very professional and made me feel comfortable during the shoot. The photos turned out better than I expected.",
    },
    {
      id: 2,
      clientName: "John Smith",
      date: "2023-10-10",
      rating: 5,
      comment:
        "Incredible experience working with Alex. The photos captured exactly what I was looking for. Highly recommend!",
    },
    {
      id: 3,
      clientName: "Lisa Johnson",
      date: "2023-10-05",
      rating: 4,
      comment:
        "Great photographer with an eye for detail. Very pleased with the results.",
    },
  ];

  // Status mapping
  const statusMap = {
    pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
    confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-800" },
    completed: { label: "Completed", color: "bg-green-100 text-green-800" },
    canceled: { label: "Canceled", color: "bg-gray-100 text-gray-800" },
  };

  return (
    <DashboardLayout>
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-purple-800">
            Photographer Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your bookings, portfolio, and settings
          </p>
        </div>
        <div className="mt-4 flex items-center gap-4 sm:mt-0">
          <img
            src={photographer.avatar}
            alt={photographer.name}
            className="h-10 w-10 rounded-full"
          />
          <div>
            <p className="font-medium">{photographer.name}</p>
            <div className="flex items-center text-sm text-muted-foreground">
              <Star className="mr-1 h-3 w-3 fill-yellow-400" />
              <span>
                {photographer.rating} ({photographer.reviews} reviews)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="border rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Earnings
              </p>
              <h3 className="text-2xl font-bold mt-1">
                ${photographer.earnings.thisMonth}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="border rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Bookings
              </p>
              <h3 className="text-2xl font-bold mt-1">
                {photographer.stats.totalBookings}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="border rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Upcoming Sessions
              </p>
              <h3 className="text-2xl font-bold mt-1">
                {photographer.stats.pendingBookings}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">Next 30 days</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="border rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Clients
              </p>
              <h3 className="text-2xl font-bold mt-1">
                {photographer.stats.completedBookings}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Unique clients
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
              <Users className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Upcoming Bookings */}
        <div className="border rounded-lg shadow-sm md:col-span-1">
          <div className="flex flex-row items-center justify-between p-4 border-b">
            <div>
              <h3 className="text-lg font-bold">Upcoming Bookings</h3>
              <p className="text-sm text-muted-foreground">
                Your scheduled photography sessions
              </p>
            </div>
            <a
              href="/photographer/bookings"
              className="text-blue-500 text-sm flex items-center"
            >
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </a>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {upcomingBookings.map((booking) => (
                <div key={booking.id} className="rounded-lg border p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{booking.type}</h3>
                        <span
                          className={`${
                            statusMap[booking.status].color
                          } rounded px-2 py-1 text-xs font-medium`}
                        >
                          {statusMap[booking.status].label}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Client: {booking.clientName}
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center text-sm">
                          <Calendar className="mr-1 h-4 w-4 text-purple-600" />
                          <span>{booking.date}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Clock className="mr-1 h-4 w-4 text-purple-600" />
                          <span>{booking.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className="font-bold text-purple-700">
                          ${booking.price}
                        </p>
                      </div>
                      <a
                        href={`/photographer/bookings/${booking.id}`}
                        className="border rounded px-3 py-1 text-sm"
                      >
                        Details
                      </a>
                    </div>
                  </div>
                </div>
              ))}
              <a
                href="/photographer/availability"
                className="border rounded block text-center py-2"
              >
                Manage Availability
              </a>
            </div>
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="border rounded-lg shadow-sm md:col-span-1">
          <div className="flex flex-row items-center justify-between p-4 border-b">
            <div>
              <h3 className="text-lg font-bold">Recent Reviews</h3>
              <p className="text-sm text-muted-foreground">
                What your clients are saying
              </p>
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-yellow-400" />
              <span className="ml-1 font-medium">{photographer.rating}</span>
            </div>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {recentReviews.map((review) => (
                <div key={review.id} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <span>{review.clientName.slice(0, 2)}</span>
                      </div>
                      <div>
                        <p className="font-medium">{review.clientName}</p>
                        <p className="text-xs text-muted-foreground">
                          {review.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex">
                      {Array(5)
                        .fill(null)
                        .map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-200 text-gray-200"
                            }`}
                          />
                        ))}
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                    {review.comment}
                  </p>
                </div>
              ))}
              <a
                href="/photographer/reviews"
                className="border rounded block text-center py-2"
              >
                View All Reviews
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="border rounded-lg shadow-sm mt-6">
        <div className="p-4 border-b">
          <h3 className="text-lg font-bold">Quick Actions</h3>
          <p className="text-sm text-muted-foreground">
            Manage your photographer profile
          </p>
        </div>
        <div className="p-4 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <a
            href="/photographer/portfolio"
            className="border rounded px-4 py-4 flex flex-col items-start"
          >
            <Camera className="h-6 w-6 text-purple-600 mb-2" />
            <div>
              <p className="font-medium">Update Portfolio</p>
              <p className="text-xs text-muted-foreground mt-1">
                Add new photos to showcase your work
              </p>
            </div>
          </a>
          <a
            href="/photographer/availability"
            className="border rounded px-4 py-4 flex flex-col items-start"
          >
            <Calendar className="h-6 w-6 text-purple-600 mb-2" />
            <div>
              <p className="font-medium">Manage Availability</p>
              <p className="text-xs text-muted-foreground mt-1">
                Set your working hours and days
              </p>
            </div>
          </a>
          <a
            href="/photographer/settings"
            className="border rounded px-4 py-4 flex flex-col items-start"
          >
            <DollarSign className="h-6 w-6 text-purple-600 mb-2" />
            <div>
              <p className="font-medium">Update Pricing</p>
              <p className="text-xs text-muted-foreground mt-1">
                Adjust your rates and packages
              </p>
            </div>
          </a>
          <a
            href="/photographer/settings"
            className="border rounded px-4 py-4 flex flex-col items-start"
          >
            <Users className="h-6 w-6 text-purple-600 mb-2" />
            <div>
              <p className="font-medium">Edit Profile</p>
              <p className="text-xs text-muted-foreground mt-1">
                Update your bio and specialties
              </p>
            </div>
          </a>
        </div>
      </div>
    </DashboardLayout>
  );
}
