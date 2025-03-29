import { useState } from "react";
import { Header } from "../../../UI/header";
import { Footer } from "../../../UI/footer";
import { AdminSidebar } from "../../../UI/admin-sidebar";
import {
  CheckCircle,
  XCircle,
  Users,
  Camera,
  Clock,
  Calendar,
  DollarSign,
  BarChart3,
  ArrowUpRight,
  Eye,
} from "lucide-react";

// Update the stats mapping for better visual appearance
const stats = [
  {
    title: "Total Users",
    value: 1254,
    icon: Users,
    change: "+12%",
    changeType: "positive",
    color: "bg-blue-500",
    description: "Active users on platform",
  },
  {
    title: "Active Photographers",
    value: 87,
    icon: Camera,
    change: "+5%",
    changeType: "positive",
    color: "bg-purple-600",
    description: "Professional photographers",
  },
  {
    title: "Pending Applications",
    value: 23,
    icon: Clock,
    change: "-2%",
    changeType: "negative",
    color: "bg-amber-500",
    description: "Waiting for review",
  },
  {
    title: "Bookings This Month",
    value: 342,
    icon: Calendar,
    change: "+18%",
    changeType: "positive",
    color: "bg-green-500",
    description: "Photography sessions",
  },
  {
    title: "Revenue This Month",
    value: "$28,650",
    icon: DollarSign,
    change: "+22%",
    changeType: "positive",
    color: "bg-emerald-500",
    description: "Total earnings",
  },
  {
    title: "Avg. Session Price",
    value: "$125",
    icon: BarChart3,
    change: "+3%",
    changeType: "positive",
    color: "bg-indigo-500",
    description: "Per hour rate",
  },
];

const pendingPhotographers = [
  {
    id: 1,
    name: "James Wilson",
    email: "james.wilson@example.com",
    location: "Boston, MA",
    specialty: "Architecture & Real Estate",
    experience: "5-10 years",
    appliedDate: "2023-10-15",
    portfolio: ["portfolio1.jpg", "portfolio2.jpg", "portfolio3.jpg"],
    equipment: "Canon EOS R5, 24-70mm f/2.8, 70-200mm f/2.8, Profoto B10",
    hourlyRate: 150,
  },
  {
    id: 2,
    name: "Sophia Lee",
    email: "sophia.lee@example.com",
    location: "San Francisco, CA",
    specialty: "Food & Product",
    experience: "3-5 years",
    appliedDate: "2023-10-18",
    portfolio: ["portfolio1.jpg", "portfolio2.jpg"],
    equipment: "Sony A7R IV, 90mm Macro, 24-105mm f/4, Godox lighting kit",
    hourlyRate: 120,
  },
  {
    id: 3,
    name: "Marcus Johnson",
    email: "marcus.johnson@example.com",
    location: "Austin, TX",
    specialty: "Event & Concert",
    experience: "1-2 years",
    appliedDate: "2023-10-20",
    portfolio: [
      "portfolio1.jpg",
      "portfolio2.jpg",
      "portfolio3.jpg",
      "portfolio4.jpg",
    ],
    equipment: "Nikon Z6 II, 24-70mm f/2.8, 70-200mm f/2.8, Speedlights",
    hourlyRate: 100,
  },
];

const allUsers = [
  {
    id: 1,
    name: "Emily Davis",
    email: "emily.davis@example.com",
    role: "Client",
    status: "Active",
    joinDate: "2023-09-10",
    bookings: 3,
    lastActive: "2023-10-25",
  },
  {
    id: 2,
    name: "Alex Morgan",
    email: "alex.morgan@example.com",
    role: "Photographer",
    status: "Active",
    joinDate: "2023-08-15",
    bookings: 12,
    lastActive: "2023-10-26",
  },
  {
    id: 3,
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    role: "Photographer",
    status: "Active",
    joinDate: "2023-08-20",
    bookings: 8,
    lastActive: "2023-10-24",
  },
  {
    id: 4,
    name: "Michael Rodriguez",
    email: "michael.rodriguez@example.com",
    role: "Photographer",
    status: "Active",
    joinDate: "2023-09-05",
    bookings: 5,
    lastActive: "2023-10-23",
  },
  {
    id: 5,
    name: "John Smith",
    email: "john.smith@example.com",
    role: "Client",
    status: "Active",
    joinDate: "2023-09-15",
    bookings: 1,
    lastActive: "2023-10-20",
  },
  {
    id: 6,
    name: "Lisa Johnson",
    email: "lisa.johnson@example.com",
    role: "Client",
    status: "Inactive",
    joinDate: "2023-07-22",
    bookings: 0,
    lastActive: "2023-08-15",
  },
  {
    id: 7,
    name: "David Kim",
    email: "david.kim@example.com",
    role: "Photographer",
    status: "Active",
    joinDate: "2023-06-10",
    bookings: 4,
    lastActive: "2023-10-01",
  },
];

const recentBookings = [
  {
    id: "BKG20231025",
    client: "Emily Davis",
    photographer: "Alex Morgan",
    date: "2023-10-28",
    time: "10:00 AM - 12:00 PM",
    type: "Portrait",
    status: "Confirmed",
    amount: "$240",
  },
  {
    id: "BKG20231024",
    client: "John Smith",
    photographer: "Sarah Chen",
    date: "2023-10-30",
    time: "2:00 PM - 5:00 PM",
    type: "Wedding",
    status: "Pending",
    amount: "$450",
  },
  {
    id: "BKG20231023",
    client: "Robert Johnson",
    photographer: "Michael Rodriguez",
    date: "2023-10-27",
    time: "9:00 AM - 11:00 AM",
    type: "Commercial",
    status: "Completed",
    amount: "$200",
  },
  {
    id: "BKG20231022",
    client: "Amanda Wilson",
    photographer: "Alex Morgan",
    date: "2023-10-26",
    time: "3:00 PM - 5:00 PM",
    type: "Family",
    status: "Canceled",
    amount: "$220",
  },
];

const reportData = [
  { month: "Jan", bookings: 120, revenue: 15000 },
  { month: "Feb", bookings: 140, revenue: 17500 },
  { month: "Mar", bookings: 160, revenue: 20000 },
  { month: "Apr", bookings: 190, revenue: 23750 },
  { month: "May", bookings: 220, revenue: 27500 },
  { month: "Jun", bookings: 250, revenue: 31250 },
  { month: "Jul", bookings: 280, revenue: 35000 },
  { month: "Aug", bookings: 310, revenue: 38750 },
  { month: "Sep", bookings: 340, revenue: 42500 },
  { month: "Oct", bookings: 370, revenue: 46250 },
];

// Status mapping for bookings
const bookingStatusMap = {
  Pending: { color: "bg-yellow-100 text-yellow-800" },
  Confirmed: { color: "bg-blue-100 text-blue-800" },
  Completed: { color: "bg-green-100 text-green-800" },
  Canceled: { color: "bg-gray-100 text-gray-800" },
};

// Status mapping for users
const userStatusMap = {
  Active: { color: "bg-green-100 text-green-800" },
  Inactive: { color: "bg-gray-100 text-gray-800" },
  Suspended: { color: "bg-red-100 text-red-800" },
};

export default function AdminDashboardPage() {
  const [photographers, setPhotographers] = useState(pendingPhotographers);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const handleApprove = (id) => {
    setPhotographers(
      photographers.filter((photographer) => photographer.id !== id)
    );
    // In a real app, you would make an API call to update the database
  };

  const handleReject = (id) => {
    setPhotographers(
      photographers.filter((photographer) => photographer.id !== id)
    );
    // In a real app, you would make an API call to update the database
  };

  // Filter users based on search term and filters
  const filteredUsers = allUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus =
      filterStatus === "all" || user.status === filterStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-purple-800">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage users, photographers, and bookings
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow duration-200 rounded-lg"
              >
                <div className="flex flex-col">
                  <div className={`${stat.color} text-white p-4`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-white/80">
                          {stat.title}
                        </p>
                        <h3 className="text-2xl font-bold mt-1">
                          {stat.value}
                        </h3>
                      </div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-4 dark:bg-gray-950">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        {stat.description}
                      </p>
                      <div
                        className={`flex items-center text-xs ${
                          stat.changeType === "positive"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        <ArrowUpRight
                          className={`mr-1 h-3 w-3 ${
                            stat.changeType === "positive"
                              ? ""
                              : "transform rotate-90"
                          }`}
                        />
                        <span>{stat.change}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="w-full">
            <div className="grid w-full grid-cols-4">
              <button className="py-2 text-sm font-medium transition-colors rounded-l-md bg-purple-600 text-white">
                Photographer Applications
              </button>
              <button className="py-2 text-sm font-medium transition-colors bg-gray-100 text-gray-500 hover:bg-gray-200">
                User Management
              </button>
              <button className="py-2 text-sm font-medium transition-colors bg-gray-100 text-gray-500 hover:bg-gray-200">
                Booking Management
              </button>
              <button className="py-2 text-sm font-medium transition-colors rounded-r-md bg-gray-100 text-gray-500 hover:bg-gray-200">
                Reports & Analytics
              </button>
            </div>

            {/* Photographer Applications Tab */}
            <div className="mt-6">
              <div className="rounded-lg border bg-white shadow-sm">
                <div className="p-4">
                  <h3 className="text-lg font-medium">
                    Pending Photographer Applications
                  </h3>
                  <p className="text-muted-foreground">
                    Review and approve photographer applications
                  </p>
                </div>
                <div className="p-4">
                  {photographers.length > 0 ? (
                    <div className="space-y-6">
                      {photographers.map((photographer) => (
                        <div
                          key={photographer.id}
                          className="overflow-hidden rounded-lg border bg-white shadow-sm"
                        >
                          <div className="bg-muted/30 p-4">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold text-lg">
                                    {photographer.name}
                                  </h3>
                                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800">
                                    Pending
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  Applied: {photographer.appliedDate}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  className="py-1.5 px-3 border border-green-500 text-green-500 hover:bg-green-50 hover:text-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded-md text-sm font-medium"
                                  onClick={() => handleApprove(photographer.id)}
                                >
                                  <CheckCircle className="mr-1 h-4 w-4" />
                                  Approve
                                </button>
                                <button
                                  type="button"
                                  className="py-1.5 px-3 border border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-md text-sm font-medium"
                                  onClick={() => handleReject(photographer.id)}
                                >
                                  <XCircle className="mr-1 h-4 w-4" />
                                  Reject
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="grid gap-6 md:grid-cols-2">
                              <div className="space-y-4">
                                <div>
                                  <h4 className="text-sm font-medium text-muted-foreground">
                                    Contact Information
                                  </h4>
                                  <div className="mt-1 space-y-1">
                                    <p className="text-sm">
                                      Email: {photographer.email}
                                    </p>
                                    <p className="text-sm">
                                      Location: {photographer.location}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-muted-foreground">
                                    Professional Details
                                  </h4>
                                  <div className="mt-1 space-y-1">
                                    <p className="text-sm">
                                      Specialty: {photographer.specialty}
                                    </p>
                                    <p className="text-sm">
                                      Experience: {photographer.experience}
                                    </p>
                                    <p className="text-sm">
                                      Hourly Rate: ${photographer.hourlyRate}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-muted-foreground">
                                    Equipment
                                  </h4>
                                  <p className="mt-1 text-sm">
                                    {photographer.equipment}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                                  Portfolio Samples
                                </h4>
                                <div className="w-full whitespace-nowrap pb-3 overflow-x-auto">
                                  <div className="flex space-x-2">
                                    {photographer.portfolio.map(
                                      (image, index) => (
                                        <div
                                          key={index}
                                          className="aspect-square w-24 md:w-32 rounded-md overflow-hidden flex-shrink-0 transition-transform hover:scale-105"
                                        >
                                          <img
                                            src={`/placeholder.svg?height=150&width=150&text=Portfolio+${
                                              index + 1
                                            }`}
                                            alt={`Portfolio sample ${
                                              index + 1
                                            }`}
                                            className="h-full w-full object-cover"
                                          />
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                                <div className="mt-4 flex justify-end">
                                  <button
                                    type="button"
                                    className="py-1.5 px-3 border border-gray-300 bg-white text-sm rounded-md font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                  >
                                    <Eye className="mr-1 h-4 w-4" />
                                    View Full Application
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex h-60 flex-col items-center justify-center rounded-lg border border-dashed bg-muted/20">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle className="h-10 w-10 text-green-600" />
                      </div>
                      <h3 className="mt-4 text-xl font-medium">
                        All Caught Up!
                      </h3>
                      <p className="mt-2 text-center text-sm text-muted-foreground max-w-xs">
                        There are no pending photographer applications that need
                        your review at this time.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
