import { useState } from "react";
import { MapPin, Loader, Search } from "lucide-react";
import axios from "axios";

const LocationSelector = ({ onLocationSelected }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [formattedAddress, setFormattedAddress] = useState("");
  const [manualLocation, setManualLocation] = useState("");

  const getCurrentLocation = () => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Got coordinates:", latitude, longitude);
        setCurrentLocation({ latitude, longitude });

        try {
          console.log(
            "Fetching place name for coordinates:",
            latitude,
            longitude
          );
          const response = await axios.get(
            "/api/photographers/geocode/reverse",
            {
              params: { latitude, longitude },
            }
          );
          console.log("Geocode response:", response.data);

          setFormattedAddress(response.data.formattedAddress);

          onLocationSelected({
            latitude,
            longitude,
            formattedAddress: response.data.formattedAddress,
          });
        } catch (error) {
          console.error("Error getting place name:", error);
          console.error("Error response:", error.response?.data);
          setFormattedAddress("Unknown location");

          onLocationSelected({
            latitude,
            longitude,
            formattedAddress: "Unknown location",
          });
        }

        setIsLoading(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        let errorMessage = "Error getting location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Location access denied. Please enable location permissions.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "The request to get your location timed out.";
            break;
          default:
            errorMessage = `Error getting location: ${error.message}`;
        }
        setError(errorMessage);
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const handleManualLocationSearch = async () => {
    if (!manualLocation) {
      setError("Please enter a location");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Use a geocoding API to convert the address to coordinates
      // For simplicity, we'll use OpenStreetMap's Nominatim API as a placeholder
      // Replace with your preferred geocoding service (e.g., Google Maps, Mapbox)
      const response = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: manualLocation,
            format: "json",
            limit: 1,
          },
        }
      );

      if (response.data.length === 0) {
        throw new Error("Location not found");
      }

      const { lat, lon } = response.data[0];
      const latitude = Number.parseFloat(lat);
      const longitude = Number.parseFloat(lon);

      setCurrentLocation({ latitude, longitude });
      setFormattedAddress(manualLocation);

      onLocationSelected({
        latitude,
        longitude,
        formattedAddress: manualLocation,
      });
    } catch (error) {
      console.error("Error geocoding manual location:", error);
      setError("Could not find the specified location");
    }

    setIsLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Your Location</h3>

      {currentLocation ? (
        <div className="mb-4">
          <div className="flex items-center text-gray-700 mb-2">
            <MapPin className="w-5 h-5 mr-2 text-blue-600" />
            <span className="text-sm">
              {formattedAddress || "Location detected"}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            Showing photographers near you
          </div>
        </div>
      ) : (
        <div className="mb-4 text-sm text-gray-600">
          Enable location or search for a location to find photographers near
          you
        </div>
      )}

      <div className="mb-4">
        <div className="flex">
          <input
            type="text"
            placeholder="Enter a location (e.g., New York, NY)"
            value={manualLocation}
            onChange={(e) => setManualLocation(e.target.value)}
            className="w-full px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleManualLocationSearch}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 rounded-r-md hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>

      <button
        onClick={getCurrentLocation}
        disabled={isLoading}
        className="w-full flex items-center justify-center py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader className="w-4 h-4 mr-2 animate-spin" />
            Detecting...
          </>
        ) : (
          <>
            <MapPin className="w-4 h-4 mr-2" />
            {currentLocation ? "Update Location" : "Use My Location"}
          </>
        )}
      </button>

      {error && <div className="mt-2 text-sm text-red-500">{error}</div>}
    </div>
  );
};

export default LocationSelector;
