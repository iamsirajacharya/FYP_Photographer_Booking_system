import React, { useState, useEffect, useRef } from "react";
import { Header } from "../../UI/header";
import { Footer } from "../../UI/footer";
import { MapPin, Search, Star, Camera, ChevronRight } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";
import { useGetPhotographersQuery } from "../redux/api/photographerApi";

// Component to programmatically re-center the map
function Recenter({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function MapPage() {
  const { data, isLoading, isError } = useGetPhotographersQuery({
    page: 1,
    limit: 50,
    search: "",
  });

  // Parse a single string like "26.8075008,87.2873984" into [26.8075008, 87.2873984]
  const parseCoordinates = (locationString) => {
    if (!locationString) return null;

    const [latStr, lngStr] = locationString.split(",");
    if (!latStr || !lngStr) return null;

    const lat = parseFloat(latStr.trim());
    const lng = parseFloat(lngStr.trim());

    // Check if valid numbers
    if (isNaN(lat) || isNaN(lng)) return null;

    return [lat, lng];
  };

  const photographers =
    data?.photographers?.map((p) => {
      const coords = parseCoordinates(p.location);

      return {
        ...p,
        coordinates: coords, // either [lat, lng] or null
        image: p.users?.profileImage || "/placeholder.svg",
        name: p.users?.name || "Unknown",
        rating: p.averageRating || 0,
        reviews: p.totalReviews || 0,
        specialty: p.specialty || "General",
        location: p.location || "Unknown location",
        hourlyRate: p.hourlyRate || 0,
      };
    }) || [];

  const [selectedPhotographer, setSelectedPhotographer] = useState(null);
  // Default center remains New York if nothing is selected
  const [mapCenter, setMapCenter] = useState([40.7128, -74.006]);
  const [zoom, setZoom] = useState(12);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Ref to the map container so we can scroll to it
  const mapRef = useRef(null);

  useEffect(() => {
    setIsMapLoaded(true);
  }, []);

  const handleSelectPhotographer = (photographer) => {
    setSelectedPhotographer(photographer);
    if (photographer.coordinates) {
      setMapCenter(photographer.coordinates);
      setZoom(14);
      // Smoothly scroll to the map
      if (mapRef.current) {
        mapRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      console.warn("Selected photographer does not have valid coordinates.");
    }
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
      {/* Make the header sticky */}
      <div className="sticky top-0 z-50">
        <Header />
      </div>

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
            <div
              ref={mapRef}
              className="w-full lg:w-2/3 h-[500px] rounded-lg border overflow-hidden shadow-sm"
              style={{ zIndex: 0 }} // Ensure map is behind the sticky header
            >
              {isMapLoaded ? (
                <MapContainer
                  center={mapCenter}
                  zoom={zoom}
                  style={{ height: "100%", width: "100%" }}
                >
                  <Recenter center={mapCenter} zoom={zoom} />
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                  />
                  {photographers
                    .filter((photographer) => photographer.coordinates)
                    .map((photographer) => (
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
                                    {photographer.rating} (
                                    {photographer.reviews} reviews)
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
