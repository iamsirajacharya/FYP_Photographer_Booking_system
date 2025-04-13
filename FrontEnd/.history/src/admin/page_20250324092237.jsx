import { useState } from "react";
import { Header } from "../../UI/header";
import { Footer } from "../../UI/footer";
import { CheckCircle, XCircle, Users, Camera, Clock } from "lucide-react";

const pendingPhotographers = [
  {
    id: 1,
    name: "James Wilson",
    email: "james.wilson@example.com",
    location: "Boston, MA",
    specialty: "Architecture & Real Estate",
    experience: "5-10 years",
    appliedDate: "2023-10-15",
  },
  {
    id: 2,
    name: "Sophia Lee",
    email: "sophia.lee@example.com",
    location: "San Francisco, CA",
    specialty: "Food & Product",
    experience: "3-5 years",
    appliedDate: "2023-10-18",
  },
  {
    id: 3,
    name: "Marcus Johnson",
    email: "marcus.johnson@example.com",
    location: "Austin, TX",
    specialty: "Event & Concert",
    experience: "1-2 years",
    appliedDate: "2023-10-20",
  },
];

const allUsers = [
  {
    id: 1,
    name: "Emily Davis",
    email: "emily.davis@example.com",
    role: "Client",
    joinDate: "2023-09-10",
    bookings: 3,
  },
  {
    id: 2,
    name: "Alex Morgan",
    email: "alex.morgan@example.com",
    role: "Photographer",
    joinDate: "2023-08-15",
    bookings: 12,
  },
  {
    id: 3,
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    role: "Photographer",
    joinDate: "2023-08-20",
    bookings: 8,
  },
  {
    id: 4,
    name: "Michael Rodriguez",
    email: "michael.rodriguez@example.com",
    role: "Photographer",
    joinDate: "2023-09-05",
    bookings: 5,
  },
  {
    id: 5,
    name: "John Smith",
    email: "john.smith@example.com",
    role: "Client",
    joinDate: "2023-09-15",
    bookings: 1,
  },
];

export default function AdminDashboardPage() {
  const [photographers, setPhotographers] = useState(pendingPhotographers);

  // State for switching between the two sections
  const [activeSection, setActiveSection] = useState("applications");

  const handleApprove = (id) => {
    setPhotographers((prevPhotographers) =>
      prevPhotographers.filter((photographer) => photographer.id !== id)
    );
    // In a real app, you would make an API call to update the database
  };

  const handleReject = (id) => {
    setPhotographers((prevPhotographers) =>
      prevPhotographers.filter((photographer) => photographer.id !== id)
    );
    // In a real app, you would make an API call to update the database
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <div className="container">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-purple-800">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage users and photographer applications
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* 1 - Total Users */}
            <div className="rounded-lg border bg-white p-6 shadow-sm flex flex-col items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h2 className="mt-3 text-2xl font-bold">{allUsers.length}</h2>
              <p className="text-muted-foreground">Total Users</p>
            </div>

            {/* 2 - Active Photographers */}
            <div className="rounded-lg border bg-white p-6 shadow-sm flex flex-col items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <Camera className="h-6 w-6 text-purple-600" />
              </div>
              <h2 className="mt-3 text-2xl font-bold">
                {allUsers.filter((user) => user.role === "Photographer").length}
              </h2>
              <p className="text-muted-foreground">Active Photographers</p>
            </div>

            {/* 3 - Pending Applications */}
            <div className="rounded-lg border bg-white p-6 shadow-sm flex flex-col items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <h2 className="mt-3 text-2xl font-bold">
                {photographers.length}
              </h2>
              <p className="text-muted-foreground">Pending Applications</p>
            </div>
          </div>

          {/* Custom Button Switcher for Sections */}
          <div className="mt-8 mb-4 flex items-center justify-center gap-2">
            <button
              className={`px-4 py-2 rounded-md font-medium ${
                activeSection === "applications"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
              onClick={() => setActiveSection("applications")}
            >
              Photographer Applications
            </button>
            <button
              className={`px-4 py-2 rounded-md font-medium ${
                activeSection === "users"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
              onClick={() => setActiveSection("users")}
            >
              All Users
            </button>
          </div>

          {/* Conditionally render one section or the other */}
          {activeSection === "applications" && (
            <div className="rounded-lg border bg-white shadow-sm">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">
                  Pending Photographer Applications
                </h2>
                <p className="text-sm text-muted-foreground">
                  Review and approve photographer applications
                </p>
              </div>
              <div className="p-4">
                {photographers.length > 0 ? (
                  <div className="space-y-4">
                    {photographers.map((photographer) => (
                      <div
                        key={photographer.id}
                        className="rounded-lg border bg-white p-4 shadow-sm"
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">
                                {photographer.name}
                              </h3>
                              <Badge className="bg-yellow-100 text-yellow-800">
                                Pending
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Email: {photographer.email}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Location: {photographer.location}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Specialty: {photographer.specialty}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Experience: {photographer.experience}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Applied: {photographer.appliedDate}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-green-500 text-green-500 hover:bg-green-50 hover:text-green-600"
                              onClick={() => handleApprove(photographer.id)}
                            >
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
                              onClick={() => handleReject(photographer.id)}
                            >
                              <XCircle className="mr-1 h-4 w-4" />
                              Reject
                            </Button>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed">
                    <p className="text-muted-foreground">
                      No pending applications
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeSection === "users" && (
            <div className="rounded-lg border bg-white shadow-sm">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">All Users</h2>
                <p className="text-sm text-muted-foreground">
                  Manage all users on the platform
                </p>
              </div>
              <div className="p-4">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-2 text-left">User</th>
                        <th className="px-4 py-2 text-left">Email</th>
                        <th className="px-4 py-2 text-left">Role</th>
                        <th className="px-4 py-2 text-left">Join Date</th>
                        <th className="px-4 py-2 text-left">Bookings</th>
                        <th className="px-4 py-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allUsers.map((user) => (
                        <tr key={user.id} className="border-b">
                          <td className="px-4 py-2">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src="/placeholder.svg"
                                  alt={user.name}
                                />
                                <AvatarFallback>
                                  {user.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span>{user.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-2">{user.email}</td>
                          <td className="px-4 py-2">
                            <Badge
                              className={
                                user.role === "Photographer"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-blue-100 text-blue-800"
                              }
                            >
                              {user.role}
                            </Badge>
                          </td>
                          <td className="px-4 py-2">{user.joinDate}</td>
                          <td className="px-4 py-2">{user.bookings}</td>
                          <td className="px-4 py-2">
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
