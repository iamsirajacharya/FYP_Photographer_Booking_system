import { useEffect, useState } from "react";
import { Calendar, Clock, DollarSign, Star, Users } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "../DashboardLayout";
import { useSelector } from "react-redux";
import {
  useGetPhotographerDetailsQuery,
  useGetPhotographerReviewsQuery,
} from "../../redux/api/photographerApi";
import { useGetPhotographerBookingsQuery } from "../../redux/api/bookingApi";

export default function PhotographerDashboard() {
  const { user, role } = useSelector((state) => state.auth);
  const photographerId = user?.photographerProfile?.id;

  // Access control
  if (role !== "photographer" || !photographerId) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400">
              {role !== "photographer"
                ? "Access Denied: You are not registered as a photographer."
                : "Error: Photographer profile not found."}
            </p>
            <Link
              to="/photographer/apply"
              className="mt-4 inline-block rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
            >
              Apply as Photographer
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Data fetching
  const {
    data: photographerData,
    isLoading: isLoadingPhotographer,
    error: photographerError,
  } = useGetPhotographerDetailsQuery(photographerId, { skip: !photographerId });

  const { data: bookingsData, isLoading: isLoadingBookings } =
    useGetPhotographerBookingsQuery(
      { photographerId },
      { skip: !photographerId }
    );

  const { data: reviewsData, isLoading: isLoadingReviews } =
    useGetPhotographerReviewsQuery(photographerId, { skip: !photographerId });

  // Local state
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

  // Process bookings data
  useEffect(() => {
    const bookings = bookingsData?.bookings || [];
    if (bookings.length) {
      const today = new Date().toISOString().split("T")[0];

      // Today's earnings
      const todayEarnings = bookings
        .filter((b) => b.date === today && b.status === "completed")
        .reduce((sum, b) => sum + b.totalPrice, 0);

      // Last week/month earnings
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      const weeklyEarnings = bookings
        .filter(
          (b) => new Date(b.date) >= oneWeekAgo && b.status === "completed"
        )
        .reduce((sum, b) => sum + b.totalPrice, 0);

      const monthlyEarnings = bookings
        .filter(
          (b) => new Date(b.date) >= oneMonthAgo && b.status === "completed"
        )
        .reduce((sum, b) => sum + b.totalPrice, 0);

      setEarnings({
        today: todayEarnings,
        thisWeek: weeklyEarnings,
        thisMonth: monthlyEarnings,
      });

      // Booking counts
      const total = bookings.length;
      const completed = bookings.filter((b) => b.status === "completed").length;
      const pending = bookings.filter((b) => b.status === "pending").length;
      const canceled = bookings.filter((b) => b.status === "canceled").length;

      setStats({
        totalBookings: total,
        completedBookings: completed,
        pendingBookings: pending,
        canceledBookings: canceled,
      });

      // Upcoming bookings
      const upcoming = bookings
        .filter((b) => ["pending", "confirmed"].includes(b.status))
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 3)
        .map((b) => ({
          id: b.id,
          clientName: b.client?.name || "Client",
          clientImage:
            b.client?.profileImage || "/placeholder.svg?height=64&width=64",
          date: b.date,
          time: `${b.startTime} - ${b.endTime}`,
          location: b.location,
          status: b.status,
          type: b.sessionType,
          price: b.totalPrice,
        }));

      setUpcomingBookings(upcoming);

      // Yearly earnings array
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
      const yearData = months.map((m) => ({ month: m, amount: 0 }));
      const thisYear = new Date().getFullYear();

      bookings.forEach((b) => {
        const bd = new Date(b.date);
        if (bd.getFullYear() === thisYear && b.status === "completed") {
          yearData[bd.getMonth()].amount += b.totalPrice;
        }
      });

      setYearlyEarnings(yearData.slice(0, new Date().getMonth() + 1));
    }
  }, [bookingsData]);

  // Process reviews data
  useEffect(() => {
    const reviews = reviewsData?.reviews || [];
    setRecentReviews(
      reviews.slice(0, 3).map((r) => ({
        id: r.id,
        clientName: r.users?.name || "Client",
        clientImage:
          r.users?.profileImage || "/placeholder.svg?height=64&width=64",
        date: new Date(r.createdAt).toISOString().split("T")[0],
        rating: r.rating,
        comment: r.comment,
      }))
    );
  }, [reviewsData]);

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

  // Handle loading state
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

  // Handle error state
  if (photographerError) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400">
              Error:{" "}
              {photographerError?.message || "Failed to load photographer data"}
            </p>
            <Link
              to="/photographer/apply"
              className="mt-4 inline-block rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
            >
              Apply as Photographer
            </Link>
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
    </DashboardLayout>
  );
}
