import { useState } from "react";
import { Header } from "../../../UI/header";
import { AdminSidebar } from "../../../UI/admin-sidebar";
import { Footer } from "../../../UI/footer";
import {
  BarChart3,
  Calendar,
  Star,
  ArrowUpRight,
  DollarSign,
} from "lucide-react";

export default function ReportsPage() {
  const [timePeriod, setTimePeriod] = useState("last30days");

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <div className="flex flex-1">
        <AdminSidebar />

        <main className="flex-1 p-6 md:p-8">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-purple-800">
                Reports & Analytics
              </h1>
              <p className="text-muted-foreground mt-1">
                View platform performance and insights
              </p>
            </div>

            <div className="mt-4 flex items-center gap-2 sm:mt-0">
              <select
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
                className="w-[180px] border-purple-200 bg-white shadow-sm rounded-md px-3 py-2"
              >
                <option value="last7days">Last 7 days</option>
                <option value="last30days">Last 30 days</option>
                <option value="last90days">Last 90 days</option>
                <option value="lastyear">Last year</option>
                <option value="alltime">All time</option>
              </select>

              <button
                type="button"
                className="shadow-sm border-purple-200 hover:border-purple-300 inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-50"
              >
                <Calendar className="mr-2 h-4 w-4" /> Custom Range
              </button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {/* Total Bookings */}
            <div className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow duration-200 rounded-lg">
              <div className="bg-purple-600 text-white p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-white/80 font-medium">
                      Total Bookings
                    </p>
                    <h3 className="text-2xl font-bold mt-1">2,180</h3>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 dark:bg-gray-950">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Booking count</p>
                  <div className="flex items-center text-xs text-green-600">
                    <ArrowUpRight className="mr-1 h-3 w-3" />
                    <span>+12% from last month</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Revenue */}
            <div className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow duration-200 rounded-lg">
              <div className="bg-green-600 text-white p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-white/80 font-medium">
                      Total Revenue
                    </p>
                    <h3 className="text-2xl font-bold mt-1">$297,500</h3>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 dark:bg-gray-950">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Total earnings
                  </p>
                  <div className="flex items-center text-xs text-green-600">
                    <ArrowUpRight className="mr-1 h-3 w-3" />
                    <span>+18% from last month</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Average Rating */}
            <div className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow duration-200 rounded-lg">
              <div className="bg-amber-500 text-white p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-white/80 font-medium">
                      Average Rating
                    </p>
                    <h3 className="text-2xl font-bold mt-1">4.8/5.0</h3>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 dark:bg-gray-950">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Client satisfaction
                  </p>
                  <div className="flex items-center text-xs text-green-600">
                    <ArrowUpRight className="mr-1 h-3 w-3" />
                    <span>+0.2 from last month</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Placeholder for charts */}
          <div className="border-none shadow-md rounded-lg p-4">
            <h2 className="text-lg font-medium flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 text-purple-600" /> Booking
              Analytics
            </h2>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
