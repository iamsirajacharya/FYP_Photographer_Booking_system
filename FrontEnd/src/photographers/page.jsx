import { useState, useEffect } from "react";
import { Search, Star, MapPin } from "lucide-react";
import {
  useGetPhotographersQuery,
  useGetPhotographerDetailsQuery,
  useGetNearbyPhotographersQuery,
} from "../redux/api/photographerApi";
import PhotographerProfileModal from "./PhotographerProfileModal";
import { Header } from "../../UI/header";
import LocationSelector from "../components/LocationSelector";

const BACKEND_URL = "http://localhost:3000";

export default function PhotographerPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPhotographerId, setSelectedPhotographerId] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [useNearbySearch, setUseNearbySearch] = useState(false);
  const [searchRadius, setSearchRadius] = useState(50);

  const {
    data: photographerData,
    isLoading: isLoadingAll,
    isError: isErrorAll,
    error: errorAll,
  } = useGetPhotographersQuery(undefined, { skip: useNearbySearch });

  const {
    data: nearbyData,
    isLoading: isLoadingNearby,
    isError: isErrorNearby,
    error: errorNearby,
  } = useGetNearbyPhotographersQuery(
    userLocation
      ? {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          radius: searchRadius,
        }
      : undefined,
    { skip: !useNearbySearch || !userLocation }
  );

  useEffect(() => {
    if (userLocation) {
      console.log("User location set:", userLocation);
      console.log("Using nearby search:", useNearbySearch);
    }

    if (nearbyData) {
      console.log("Nearby photographers data:", nearbyData);
    }

    if (isErrorNearby) {
      console.error("Nearby photographers error:", errorNearby);
    }
  }, [userLocation, useNearbySearch, nearbyData, isErrorNearby, errorNearby]);

  const { data: photographerDetails } = useGetPhotographerDetailsQuery(
    selectedPhotographerId,
    {
      skip: !selectedPhotographerId,
    }
  );

  const isLoading = useNearbySearch ? isLoadingNearby : isLoadingAll;
  const isError = useNearbySearch ? isErrorNearby : isErrorAll;
  const error = useNearbySearch ? errorNearby : errorAll;

  const photographerList = useNearbySearch
    ? nearbyData?.photographers || []
    : photographerData?.photographers || [];

  const filteredPhotographers = photographerList.filter((p) => {
    const userName = p.users?.name?.toLowerCase() || "";
    const pSpecialty = p.specialty?.toLowerCase() || "";
    const pLocation = p.location?.toLowerCase() || "";
    const term = searchTerm.toLowerCase();

    return (
      userName.includes(term) ||
      pSpecialty.includes(term) ||
      pLocation.includes(term)
    );
  });

  const handleLocationSelected = (location) => {
    console.log("Location selected:", location);
    setUserLocation(location);
    setUseNearbySearch(true);
  };

  const handleRadiusChange = (e) => {
    setSearchRadius(Number.parseInt(e.target.value));
  };

  const handleViewProfile = (photographerId) => {
    console.log("View profile clicked:", photographerId);
    setSelectedPhotographerId(photographerId);
  };

  const handleCloseProfile = () => {
    setSelectedPhotographerId(null);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <p className="text-center text-xl text-gray-600">
            Loading photographers...
          </p>
        </main>
      </div>
    );
  }

  if (isError) {
    console.error("API Error:", error);
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-xl text-red-600 mb-4">
              Error loading photographers
            </p>
            <p className="text-gray-600">
              {error?.data?.message ||
                error?.error ||
                "Unknown error occurred. Please try again."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-[300px_1fr] gap-8">
          <div className="space-y-6">
            <LocationSelector onLocationSelected={handleLocationSelected} />
            {userLocation && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Search Radius</h3>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={searchRadius}
                  onChange={handleRadiusChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>5km</span>
                  <span>{searchRadius}km</span>
                  <span>100km</span>
                </div>
              </div>
            )}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">
                Search Photographers
              </h3>
              <div className="flex">
                <input
                  type="text"
                  placeholder="Name, specialty, location"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="bg-blue-600 text-white px-4 rounded-r-md hover:bg-blue-700 transition">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Photography Types</h3>
              <div className="space-y-2">
                {["Portrait", "Wedding", "Event", "Family", "Commercial"].map(
                  (type) => (
                    <label key={type} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="form-checkbox text-blue-600"
                      />
                      <span>{type}</span>
                    </label>
                  )
                )}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Price Range</h3>
              <input
                type="range"
                min="0"
                max="300"
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>$0</span>
                <span>$150</span>
                <span>$300+</span>
              </div>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                {filteredPhotographers.length} Photographers Found
                {useNearbySearch && userLocation && (
                  <span className="ml-2 text-sm text-blue-600">
                    within {searchRadius}km of your location
                  </span>
                )}
              </p>
              <div className="flex space-x-2">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  Grid View
                </button>
                <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">
                  List View
                </button>
              </div>
            </div>
            {filteredPhotographers.length === 0 && useNearbySearch ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  No Photographers Found Nearby
                </h3>
                <p className="text-gray-600 mb-4">
                  Try increasing the search radius or search for photographers
                  in a different location.
                </p>
                <button
                  onClick={() => setUseNearbySearch(false)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  View All Photographers
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPhotographers.map((photographer) => {
                  const photographerName =
                    photographer.users?.name || "No Name";
                  const photographerRating =
                    photographer.averageRating?.toFixed(1) || "N/A";
                  const rawProfileImage =
                    photographer.users?.profileImage ||
                    "/placeholder-profile.jpg";
                  const displayProfileImage = rawProfileImage.startsWith(
                    "/uploads"
                  )
                    ? `${BACKEND_URL}${rawProfileImage}`
                    : rawProfileImage;

                  return (
                    <div
                      key={photographer.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                    >
                      <img
                        src={displayProfileImage || "/placeholder.svg"}
                        alt={photographerName}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold text-lg">
                          {photographerName}
                        </h3>
                        <p className="text-gray-600 mb-2">
                          {photographer.specialty || "No specialty provided"}
                        </p>
                        <div className="flex items-center mb-2">
                          <MapPin className="w-4 h-4 text-gray-500 mr-1" />
                          <p className="text-gray-600 truncate">
                            {photographer.formattedAddress ||
                              photographer.location ||
                              "No location provided"}
                          </p>
                        </div>
                        {photographer.dataValues?.distance != null && (
                          <p className="text-sm text-blue-600 mb-2">
                            {photographer.dataValues.distance} km away
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1 text-yellow-500">
                            <Star className="w-4 h-4 fill-current" />
                            <span>{photographerRating}</span>
                          </div>
                          <button
                            onClick={() => handleViewProfile(photographer.id)}
                            className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700"
                          >
                            View Profile
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        {selectedPhotographerId && (
          <PhotographerProfileModal
            photographerId={selectedPhotographerId}
            isOpen={!!selectedPhotographerId}
            onClose={handleCloseProfile}
          />
        )}
      </main>
      <footer className="bg-white shadow-md mt-8">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-gray-600">© 2024 Photographer Booking Platform</p>
        </div>
      </footer>
    </div>
  );
}
