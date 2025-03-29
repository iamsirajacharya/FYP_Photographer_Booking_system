import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  X,
  Heart,
  MapPin,
  Share2,
  Star,
  Camera,
  Award,
  Clock,
} from "lucide-react";
import { useGetPhotographerByIdQuery } from "../../redux/api/photographerApi";

export default function PhotographerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useGetPhotographerByIdQuery(id);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p>Loading photographer details...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p>Error loading photographer details: {error?.message}</p>
        </div>
      </div>
    );
  }

  // Check if data exists and contains the photographer key
  if (!data || !data.photographer) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p>Photographer not found.</p>
        </div>
      </div>
    );
  }

  const { photographer, availability } = data;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-auto">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full mx-4 p-6 relative">
        {/* Close Icon */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Header Section */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-purple-800">
              {photographer.name}
            </h1>
            <div className="mt-2 flex items-center gap-2 text-sm">
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="ml-1">{photographer.rating}</span>
                <span className="ml-1 text-gray-500">
                  ({photographer.reviews} reviews)
                </span>
              </div>
              <span>•</span>
              <div className="flex items-center text-gray-500">
                <MapPin className="mr-1 h-4 w-4 text-purple-600" />
                {photographer.location}
              </div>
              <span>•</span>
              <div className="flex items-center text-gray-500">
                <Clock className="mr-1 h-4 w-4 text-purple-600" />
                {photographer.experience}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="inline-flex h-9 items-center rounded-md border bg-white px-4 py-2 text-sm shadow-sm hover:bg-gray-100">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </button>
            <button className="inline-flex h-9 items-center rounded-md border bg-white px-4 py-2 text-sm shadow-sm hover:bg-gray-100">
              <Heart className="mr-2 h-4 w-4" />
              Save
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <img
              src={
                photographer.profileImage ||
                "/placeholder.svg?height=400&width=400"
              }
              alt={photographer.name}
              className="rounded-lg object-cover w-full"
            />
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-purple-600" />
                <span>{photographer.specialty}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-600" />
                <span>{photographer.experience} experience</span>
              </div>
            </div>
          </div>
          <div className="md:col-span-2 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-purple-800 mb-4">
                About Me
              </h2>
              <p className="text-gray-600">{photographer.description}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-purple-800 mb-4">
                Services Offered
              </h2>
              <ul className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {photographer.services &&
                  photographer.services.map((service, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Camera className="h-4 w-4 text-purple-600" />
                      {service}
                    </li>
                  ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-purple-800 mb-4">
                My Equipment
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {photographer.equipment &&
                  photographer.equipment.map((item, idx) => (
                    <li
                      key={idx}
                      className="border rounded p-3 flex gap-3 items-center"
                    >
                      <Camera className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.category}</p>
                      </div>
                    </li>
                  ))}
              </ul>
            </section>
          </div>
        </div>

        {/* Portfolio Section */}
        <section className="mt-8">
          <h2 className="text-2xl font-bold text-purple-800 mb-4">Portfolio</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {photographer.portfolioImages &&
              photographer.portfolioImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Portfolio ${idx + 1}`}
                  className="h-60 object-cover rounded-lg shadow-sm hover:scale-105 transition-transform"
                />
              ))}
          </div>
        </section>

        {/* Reviews Section */}
        <section className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-purple-800">
              Client Reviews
            </h2>
            <Link to="#" className="text-purple-600 hover:underline">
              View all {photographer.reviews} reviews
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="border p-4 rounded shadow-sm bg-white">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-gray-200 rounded-full" />
                  <div>
                    <p className="font-medium">Client {i + 1}</p>
                    <p className="text-xs text-gray-500">October 2023</p>
                  </div>
                </div>
                <div className="flex my-2">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      className={`h-4 w-4 ${
                        j < 4 ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  Alex was amazing to work with! Highly recommend.
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Booking Button */}
        <div className="mt-8">
          <Link
            to={`/booking/${photographer.id}`}
            className="block w-full py-3 bg-purple-600 text-white text-center rounded hover:bg-purple-700 transition"
          >
            Book a Session - NPR {photographer.price}/hour
          </Link>
        </div>
      </div>
    </div>
  );
}
