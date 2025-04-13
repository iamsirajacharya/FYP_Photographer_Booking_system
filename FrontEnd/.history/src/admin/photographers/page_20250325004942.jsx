import React, { useState } from "react";
import { Footer } from "../../../UI/footer";
import { AdminSidebar } from "../../../UI/admin-sidebar";
import { CheckCircle, XCircle, Eye } from "lucide-react";

export default function PhotographersPage() {
  const [photographers, setPhotographers] = useState([
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
  ]);

  const handleApprove = (id) => {
    setPhotographers((prev) => prev.filter((p) => p.id !== id));
    // In production, call your API/mutation here
  };

  const handleReject = (id) => {
    setPhotographers((prev) => prev.filter((p) => p.id !== id));
    // In production, call your API/mutation here
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Wrap the sidebar and main content in a flex container */}
      <div className="flex flex-1">
        <AdminSidebar />
        {/* Add md:ml-64 to create space for the fixed sidebar on desktop */}
        <main className="flex-1 p-6 md:ml-64 md:p-8">
          <h1 className="text-3xl font-bold text-purple-800">
            Photographer Management
          </h1>
          <p className="text-gray-500 mb-6">
            Review applications and manage photographers.
          </p>
          <div className="rounded-lg border bg-white shadow-sm">
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium">
                Pending Photographer Applications ({photographers.length})
              </h3>
              <p className="text-gray-500">
                Review and approve photographer applications
              </p>
            </div>
            <div className="p-6 space-y-6">
              {photographers.length > 0 ? (
                photographers.map((photographer) => (
                  <div
                    key={photographer.id}
                    className="rounded-lg border shadow-sm hover:shadow transition-shadow"
                  >
                    <div className="bg-purple-50 p-4 flex justify-between items-center">
                      <div>
                        <h4 className="text-lg font-semibold">
                          {photographer.name}
                        </h4>
                        <p className="text-gray-500 text-sm">
                          Applied on {photographer.appliedDate}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(photographer.id)}
                          className="px-3 py-1.5 rounded border border-green-500 text-green-500 hover:bg-green-50 flex items-center"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" /> Approve
                        </button>
                        <button
                          onClick={() => handleReject(photographer.id)}
                          className="px-3 py-1.5 rounded border border-red-500 text-red-500 hover:bg-red-50 flex items-center"
                        >
                          <XCircle className="h-4 w-4 mr-1" /> Reject
                        </button>
                      </div>
                    </div>
                    <div className="p-6 grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-100 rounded">
                          <h5 className="text-purple-700 font-medium mb-2">
                            Contact Info
                          </h5>
                          <p>Email: {photographer.email}</p>
                          <p>Location: {photographer.location}</p>
                        </div>
                        <div className="p-4 bg-gray-100 rounded">
                          <h5 className="text-purple-700 font-medium mb-2">
                            Professional Details
                          </h5>
                          <p>Specialty: {photographer.specialty}</p>
                          <p>Experience: {photographer.experience}</p>
                          <p>
                            Hourly Rate:{" "}
                            <span className="text-green-600 font-medium">
                              ${photographer.hourlyRate}
                            </span>
                          </p>
                        </div>
                        <div className="p-4 bg-gray-100 rounded">
                          <h5 className="text-purple-700 font-medium mb-2">
                            Equipment
                          </h5>
                          <p>{photographer.equipment}</p>
                        </div>
                      </div>
                      <div>
                        <h5 className="text-purple-700 font-medium mb-2">
                          Portfolio Samples
                        </h5>
                        <div className="grid grid-cols-2 gap-2">
                          {photographer.portfolio.map((img, idx) => (
                            <img
                              key={idx}
                              src={`/placeholder.svg?text=Portfolio+${idx + 1}`}
                              alt={`Portfolio ${idx + 1}`}
                              className="rounded-md shadow-sm aspect-square object-cover"
                            />
                          ))}
                        </div>
                        <div className="mt-4 flex justify-end">
                          <button className="px-3 py-1.5 border rounded hover:bg-gray-50 flex items-center">
                            <Eye className="h-4 w-4 mr-1" /> View Full
                            Application
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-16 flex flex-col items-center justify-center">
                  <CheckCircle className="text-green-500 h-12 w-12 mb-4" />
                  <h4 className="text-xl font-medium">All caught up!</h4>
                  <p className="text-gray-500 text-center">
                    No pending applications at this time.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
