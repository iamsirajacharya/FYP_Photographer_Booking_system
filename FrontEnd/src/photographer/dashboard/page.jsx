//photographerDashboard.jsx
import { useEffect, useState } from "react";
import {
  Calendar,
  Camera,
  ChevronRight,
  Clock,
  DollarSign,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import DashboardLayout from "../DashboardLayout";
import { useSelector } from "react-redux";
import { useGetPhotographerDetailsQuery } from "../../redux/api/photographerApi";
import { useGetPhotographerBookingsQuery } from "../../redux/api/bookingApi";
import { useGetPhotographerReviewsQuery } from "../../redux/api/reviewApi";

export default function PhotographerDashboard() {
  // Get current user from auth state
  const { user } = useSelector((state) => state.auth);

  // Fetch photographer profile data
  const { data: photographerData, isLoading: isLoadingPhotographer } =
    useGetPhotographerDetailsQuery(user?.photographerId);

  // Fetch bookings data
  const { data: bookingsData, isLoading: isLoadingBookings } =
    useGetPhotographerBookingsQuery({});

  // Fetch reviews data
  const { data: reviewsData, isLoading: isLoadingReviews } =
    useGetPhotographerReviewsQuery(user?.photographerId);

  // Calculate earnings and stats from bookings
  const [earnings, setEarnings] = useState({
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
  });

  const [stats, setStats] = useState({
    totalBookings: 0,
    completedBookings: 0,
    pendingBookings: 0,
    canceledBookings: 0,
  });

  const [yearlyEarnings, setYearlyEarnings] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);

  // Process bookings data when it's loaded
  useEffect(() => {
    if (bookingsData?.bookings) {
      // Calculate earnings
      const today = new Date().toISOString().split("T")[0];
      const todayEarnings = bookingsData.bookings
        .filter(
          (booking) => booking.date === today && booking.status === "completed"
        )
        .reduce((sum, booking) => sum + booking.totalPrice, 0);

      // Get one week ago date
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      // Get one month ago date
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      // Calculate weekly and monthly earnings
      const weeklyEarnings = bookingsData.bookings
        .filter(
          (booking) =>
            new Date(booking.date) >= oneWeekAgo &&
            booking.status === "completed"
        )
        .reduce((sum, booking) => sum + booking.totalPrice, 0);

      const monthlyEarnings = bookingsData.bookings
        .filter(
          (booking) =>
            new Date(booking.date) >= oneMonthAgo &&
            booking.status === "completed"
        )
        .reduce((sum, booking) => sum + booking.totalPrice, 0);

      setEarnings({
        today: todayEarnings,
        thisWeek: weeklyEarnings,
        thisMonth: monthlyEarnings,
      });

      // Calculate booking stats
      const totalBookings = bookingsData.bookings.length;
      const completedBookings = bookingsData.bookings.filter(
        (booking) => booking.status === "completed"
      ).length;
      const pendingBookings = bookingsData.bookings.filter(
        (booking) => booking.status === "pending"
      ).length;
      const canceledBookings = bookingsData.bookings.filter(
        (booking) => booking.status === "canceled"
      ).length;

      setStats({
        totalBookings,
        completedBookings,
        pendingBookings,
        canceledBookings,
      });

      // Get upcoming bookings (pending or confirmed, sorted by date)
      const upcoming = bookingsData.bookings
        .filter((booking) => ["pending", "confirmed"].includes(booking.status))
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 3)
        .map((booking) => ({
          id: booking.id,
          clientName: booking.client?.name || "Client",
          clientImage:
            booking.client?.profileImage ||
            "/placeholder.svg?height=64&width=64",
          date: booking.date,
          time: `${booking.startTime} - ${booking.endTime}`,
          location: booking.location,
          status: booking.status,
          type: booking.sessionType,
          price: booking.totalPrice,
        }));

      setUpcomingBookings(upcoming);

      // Calculate yearly earnings by month
      const monthlyData = [];
      const currentYear = new Date().getFullYear();
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      months.forEach((month, index) => {
        monthlyData.push({
          month,
          amount: 0,
        });
      });

      bookingsData.bookings.forEach((booking) => {
        const bookingDate = new Date(booking.date);
        if (
          bookingDate.getFullYear() === currentYear &&
          booking.status === "completed"
        ) {
          const monthIndex = bookingDate.getMonth();
          monthlyData[monthIndex].amount += booking.totalPrice;
        }
      });

      setYearlyEarnings(monthlyData.slice(0, new Date().getMonth() + 1));
    }
  }, [bookingsData]);

  // Process reviews data when it's loaded
  useEffect(() => {
    if (reviewsData?.reviews) {
      const recent = reviewsData.reviews.slice(0, 3).map((review) => ({
        id: review.id,
        clientName: review.users?.name || "Client",
        clientImage:
          review.users?.profileImage || "/placeholder.svg?height=64&width=64",
        date: new Date(review.createdAt).toISOString().split("T")[0],
        rating: review.rating,
        comment: review.comment,
      }));

      setRecentReviews(recent);
    }
  }, [reviewsData]);

  // Calculate average rating from reviews
  const averageRating =
    reviewsData?.reviews?.length > 0
      ? (
          reviewsData.reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviewsData.reviews.length
        ).toFixed(1)
      : 0;

  // Status mapping for bookings
  const statusMap = {
    pending: { label: "Pending", color: "bg-amber-100 text-amber-800" },
    confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-800" },
    completed: { label: "Completed", color: "bg-emerald-100 text-emerald-800" },
    canceled: { label: "Canceled", color: "bg-gray-100 text-gray-800" },
  };

  if (isLoadingPhotographer || isLoadingBookings) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-t-purple-600 border-r-transparent border-b-purple-600 border-l-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              Loading dashboard data...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const photographerName =
    user?.name || photographerData?.photographer?.users?.name || "Photographer";
  const photographerSpecialty =
    photographerData?.photographer?.specialty || "Photography";
  const reviewCount = reviewsData?.totalReviews || 0;
  const growth = "+12% from last month";

  return (
    <DashboardLayout>
      {/* Welcome Section */}
      <section className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              Welcome back, {photographerName}
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-300">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mr-2">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="ml-1 font-semibold">{averageRating}</span>
            </div>
            <div className="h-4 w-px bg-gray-300 dark:bg-gray-600 mx-2"></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {reviewCount} reviews
            </span>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all hover:shadow-md">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Monthly Earnings
              </p>
              <div className="mt-2 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  ${earnings.thisMonth}
                </p>
                <p className="ml-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  {growth}
                </p>
              </div>
            </div>
            <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-4 h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-blue-500"
              style={{ width: "85%" }}
            ></div>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            85% of monthly target
          </p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all hover:shadow-md">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Bookings
              </p>
              <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                {stats.totalBookings}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Completed
              </p>
              <p className="mt-1 font-semibold text-emerald-600 dark:text-emerald-400">
                {stats.completedBookings}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Pending
              </p>
              <p className="mt-1 font-semibold text-amber-600 dark:text-amber-400">
                {stats.pendingBookings}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Canceled
              </p>
              <p className="mt-1 font-semibold text-gray-600 dark:text-gray-400">
                {stats.canceledBookings}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all hover:shadow-md">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Upcoming Sessions
              </p>
              <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                {stats.pendingBookings}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Next booking
              </p>
              <p className="text-xs font-medium text-gray-900 dark:text-white">
                {upcomingBookings[0]
                  ? new Date(upcomingBookings[0].date).toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric" }
                    ) +
                    ", " +
                    upcomingBookings[0].time.split(" - ")[0]
                  : "No upcoming bookings"}
              </p>
            </div>
            <div className="mt-1 h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full">
              <div className="h-full bg-gradient-to-r from-amber-500 to-amber-300 w-1/3 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all hover:shadow-md">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Clients
              </p>
              <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                {stats.completedBookings}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <Users className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-7 w-7 rounded-full border-2 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700"
                  />
                ))}
                <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white dark:border-gray-800 bg-purple-600 text-xs font-medium text-white">
                  +{Math.max(0, stats.completedBookings - 3)}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  +3 new clients this month
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Revenue Chart */}
      <section className="mb-8">
        <div className="rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Revenue Overview
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Monthly earnings progression
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-purple-500 mr-1"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  2023
                </span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-blue-300 dark:bg-blue-500 mr-1"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Target
                </span>
              </div>
            </div>
          </div>
          <div className="h-64 w-full">
            <div className="flex h-52 items-end justify-between">
              {yearlyEarnings.map((data, i) => (
                <div
                  key={i}
                  className="relative flex flex-1 flex-col items-center"
                >
                  <div className="relative h-full w-full flex justify-center items-end">
                    <div
                      className="w-5 rounded-t bg-gradient-to-b from-purple-600 to-blue-500"
                      style={{ height: `${(data.amount / 4000) * 100}%` }}
                    ></div>
                  </div>
                  <span className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {data.month}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Upcoming Bookings */}
        <section>
          <div className="rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="flex items-center justify-between p-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Upcoming Bookings
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Your scheduled sessions
                </p>
              </div>
              <a
                href="/photographer/bookings"
                className="flex items-center text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
              >
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </a>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {upcomingBookings.length > 0 ? (
                upcomingBookings.map((booking) => (
                  <div key={booking.id} className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-none">
                        <div className="rounded-xl bg-purple-100 dark:bg-purple-900/30 p-3 text-center">
                          <span className="block text-xl font-semibold text-purple-700 dark:text-purple-400">
                            {new Date(booking.date).getDate()}
                          </span>
                          <span className="text-xs text-purple-600 dark:text-purple-300">
                            {new Date(booking.date).toLocaleString("default", {
                              month: "short",
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {booking.type}
                            </h4>
                            <div className="mt-1 flex items-center">
                              <span className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                                <Clock className="h-3.5 w-3.5" />
                                {booking.time}
                              </span>
                            </div>
                          </div>
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                              statusMap[booking.status].color
                            }`}
                          >
                            {statusMap[booking.status].label}
                          </span>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full overflow-hidden mr-2">
                              <img
                                src={
                                  booking.clientImage ||
                                  "/placeholder.svg?height=64&width=64"
                                }
                                alt={booking.clientName}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              {booking.clientName}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            ${booking.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                  No upcoming bookings found
                </div>
              )}
              <div className="p-4 text-center">
                <a
                  href="/photographer/availability"
                  className="inline-flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Manage Availability
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Reviews */}
        <section>
          <div className="rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="flex items-center justify-between p-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recent Reviews
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Client feedback
                </p>
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <span className="ml-1 font-semibold">{averageRating}</span>
              </div>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentReviews.length > 0 ? (
                recentReviews.map((review) => (
                  <div key={review.id} className="p-6">
                    <div className="flex items-start">
                      <div className="mr-4 h-10 w-10 rounded-full overflow-hidden">
                        <img
                          src={
                            review.clientImage ||
                            "/placeholder.svg?height=64&width=64"
                          }
                          alt={review.clientName}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {review.clientName}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {review.date}
                          </p>
                        </div>
                        <div className="mt-1 flex">
                          {Array(5)
                            .fill(null)
                            .map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
                                }`}
                              />
                            ))}
                        </div>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                  No reviews found
                </div>
              )}
              <div className="p-4 text-center">
                <a
                  href="/photographer/reviews"
                  className="inline-flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Star className="mr-2 h-4 w-4" />
                  View All Reviews
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Quick Actions */}
      <section className="mt-8">
        <div className="rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Quick Actions
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage your photographer profile
            </p>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <a
              href="/photographer/portfolio"
              className="group flex flex-col rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-md transition-all"
            >
              <div className="h-12 w-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-3 group-hover:bg-purple-600 dark:group-hover:bg-purple-600 transition-colors">
                <Camera className="h-6 w-6 text-purple-600 dark:text-purple-400 group-hover:text-white dark:group-hover:text-white transition-colors" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                Update Portfolio
              </h4>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Add new photos to showcase your work
              </p>
            </a>
            <a
              href="/photographer/availability"
              className="group flex flex-col rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all"
            >
              <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3 group-hover:bg-blue-600 dark:group-hover:bg-blue-600 transition-colors">
                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400 group-hover:text-white dark:group-hover:text-white transition-colors" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                Manage Availability
              </h4>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Set your working hours and days
              </p>
            </a>
            <a
              href="/photographer/settings"
              className="group flex flex-col rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:border-amber-500 dark:hover:border-amber-500 hover:shadow-md transition-all"
            >
              <div className="h-12 w-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-3 group-hover:bg-amber-600 dark:group-hover:bg-amber-600 transition-colors">
                <DollarSign className="h-6 w-6 text-amber-600 dark:text-amber-400 group-hover:text-white dark:group-hover:text-white transition-colors" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                Update Pricing
              </h4>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Adjust your rates and packages
              </p>
            </a>
            <a
              href="/photographer/settings"
              className="group flex flex-col rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-md transition-all"
            >
              <div className="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-3 group-hover:bg-emerald-600 dark:group-hover:bg-emerald-600 transition-colors">
                <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400 group-hover:text-white dark:group-hover:text-white transition-colors" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                Growth Analytics
              </h4>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Track your business performance
              </p>
            </a>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
