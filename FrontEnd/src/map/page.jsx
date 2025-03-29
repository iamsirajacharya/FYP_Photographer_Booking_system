import React, { useState, useEffect } from "react";
import { Header } from "../../UI/header";
import { Footer } from "../../UI/footer";
import { MapPin, Search, Star, Camera, ChevronRight } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";
import { useGetPhotographersQuery } from "../redux/api/photographerApi";

export default function MapPage() {
  const { data, isLoading, isError } = useGetPhotographersQuery({
    page: 1,
    limit: 50,
    search: "",
  });

  const photographers =
    data?.photographers?.map((p) => ({
      ...p,
      coordinates:
        p.latitude != null &&
        p.longitude != null &&
        !isNaN(p.latitude) &&
        !isNaN(p.longitude)
          ? [Number(p.latitude), Number(p.longitude)]
          : [40.7128, -74.006],

      image: p.users?.profileImage || "/placeholder.svg?height=400&width=400",
      name: p.users?.name || "Unknown",
      rating: p.averageRating || 0,
      reviews: p.totalReviews || 0,
      specialty: p.specialty || "General",
    })) || [];

  const [selectedPhotographer, setSelectedPhotographer] = useState(null);
  const [mapCenter, setMapCenter] = useState([40.7128, -74.006]);
  const [zoom, setZoom] = useState(12);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    setIsMapLoaded(true);
  }, []);

  const handleSelectPhotographer = (photographer) => {
    setSelectedPhotographer(photographer);
    setMapCenter(photographer.coordinates);
    setZoom(14);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-purple-600 border-r-transparent"></div>
          <p className="mt-2 text-sm text-gray-500">Loading photographers...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
        Failed to load photographers.
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-6">
        <div className="container px-4 md:px-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-purple-800">
              Find Photographers Near You
            </h1>
            <p className="text-gray-500">
              Discover talented photographers in your area
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Map Section */}
            <div className="w-full lg:w-2/3 h-[500px] rounded-lg border overflow-hidden shadow-sm">
              {isMapLoaded ? (
                <MapContainer
                  center={mapCenter}
                  zoom={zoom}
                  style={{ height: "100%", width: "100%" }}
                  key={`${mapCenter[0]}-${mapCenter[1]}-${zoom}`}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                  />
                  {photographers.map((photographer) => (
                    <Marker
                      key={photographer.id}
                      position={photographer.coordinates}
                    >
                      <Popup>
                        <div className="p-1">
                          <div className="flex items-center gap-2 mb-2">
                            <img
                              src={photographer.image}
                              alt={photographer.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                              <h3 className="font-medium text-sm">
                                {photographer.name}
                              </h3>
                              <div className="flex items-center text-xs text-gray-500">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                                <span>
                                  {photographer.rating} ({photographer.reviews}{" "}
                                  reviews)
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-xs mb-2">
                            <div className="flex items-center text-gray-500 mb-1">
                              <Camera className="h-3 w-3 mr-1 text-purple-600" />
                              {photographer.specialty}
                            </div>
                            <div className="flex items-center text-gray-500">
                              <MapPin className="h-3 w-3 mr-1 text-purple-600" />
                              {photographer.location}
                            </div>
                          </div>
                          <div className="text-sm font-medium text-purple-700 mb-2">
                            ${photographer.hourlyRate}/hour
                          </div>
                          <button
                            onClick={() =>
                              handleSelectPhotographer(photographer)
                            }
                            className="w-full text-center text-xs bg-purple-600 text-white py-1 px-2 rounded hover:bg-purple-700 transition-colors"
                          >
                            View Profile
                          </button>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-r-transparent"></div>
                    <p className="mt-2 text-sm text-gray-500">Loading map...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Photographers List */}
            <div className="w-full lg:w-1/3">
              <div className="mb-4 relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search photographers by name or location"
                  className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-purple-600 outline-none"
                  disabled
                />
              </div>

              <div className="space-y-3 h-[440px] overflow-y-auto pr-2">
                {photographers.map((photographer) => (
                  <div
                    key={photographer.id}
                    className={`rounded-lg border-l-4 ${
                      selectedPhotographer?.id === photographer.id
                        ? "border-purple-600 bg-purple-50"
                        : "border-transparent hover:border-purple-300 hover:bg-gray-50"
                    } p-3 cursor-pointer transition shadow-sm`}
                    onClick={() => handleSelectPhotographer(photographer)}
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={photographer.image}
                        alt={photographer.name}
                        className="w-16 h-16 rounded-md object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{photographer.name}</h3>
                          <div className="flex items-center text-xs">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                            {photographer.rating}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          <div className="flex items-center">
                            <Camera className="h-3 w-3 mr-1 text-purple-600" />
                            {photographer.specialty}
                          </div>
                          <div className="flex items-center mt-1">
                            <MapPin className="h-3 w-3 mr-1 text-purple-600" />
                            {photographer.location}
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-medium text-purple-700">
                            ${photographer.hourlyRate}/hour
                          </span>
                          <Link
                            to={`/photographers/${photographer.id}`}
                            className="inline-flex items-center text-xs text-purple-600 hover:text-purple-800"
                          >
                            Details <ChevronRight className="h-3 w-3 ml-1" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
