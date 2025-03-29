//admin/photographer/page.jsx
import React from "react";
import { Footer } from "../../../UI/footer";
import { AdminSidebar } from "../../../UI/admin-sidebar";
import { CheckCircle, XCircle, Eye } from "lucide-react";
import {
  useGetPhotographerApplicationsQuery,
  useApprovePhotographerApplicationMutation,
  useRejectPhotographerApplicationMutation,
} from "../../redux/api/adminApi";

export default function AdminPhotographersPage() {
  const { data, isLoading, refetch } = useGetPhotographerApplicationsQuery({
    page: 1,
    limit: 10,
  });

  const [approveApplication] = useApprovePhotographerApplicationMutation();
  const [rejectApplication] = useRejectPhotographerApplicationMutation();

  const handleApprove = async (id) => {
    await approveApplication(id);
    refetch();
  };

  const handleReject = async (id) => {
    await rejectApplication(id);
    refetch();
  };

  if (isLoading) return <div className="p-6">Loading applications...</div>;

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <div className="flex flex-1">
        <AdminSidebar />
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
                Pending Photographer Applications ({data.applications.length})
              </h3>
              <p className="text-gray-500">
                Review and approve photographer applications
              </p>
            </div>
            <div className="p-6 space-y-6">
              {data.applications.length > 0 ? (
                data.applications.map((photographer) => (
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
                          Applied on{" "}
                          {new Date(
                            photographer.applicationDate
                          ).toLocaleDateString()}
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
                        {Array.isArray(photographer.portfolio) &&
                            photographer.portfolio.map((img, idx) => (

                            <img
                              key={idx}
                              src={img}
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
