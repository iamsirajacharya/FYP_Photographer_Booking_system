const axios = require("axios");

/**
 * Parse location string into latitude and longitude
 * @param {string} locationString - Location string in format "lat,lng"
 * @returns {{latitude: number, longitude: number} | null}
 */
const parseLocationString = (locationString) => {
  if (!locationString || typeof locationString !== "string") return null;

  const parts = locationString.split(",");
  if (parts.length !== 2) return null;

  const latitude = Number.parseFloat(parts[0].trim());
  const longitude = Number.parseFloat(parts[1].trim());

  if (isNaN(latitude) || isNaN(longitude)) return null;

  return { latitude, longitude };
};

/**
 * Convert coordinates to address using OpenStreetMap Nominatim API (reverse geocoding)
 * @param {number} latitude - The latitude
 * @param {number} longitude - The longitude
 * @returns {Promise<{formattedAddress: string}>}
 */
const reverseGeocode = async (latitude, longitude) => {
  try {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/reverse",
      {
        params: {
          lat: latitude,
          lon: longitude,
          format: "json",
        },
        headers: {
          "User-Agent": "PhotographerBookingApp/1.0",
        },
      }
    );

    if (response.data) {
      return {
        formattedAddress: response.data.display_name,
      };
    }

    throw new Error("No results found for the coordinates");
  } catch (error) {
    console.error("Reverse geocoding error:", error.message);
    throw new Error("Failed to reverse geocode coordinates");
  }
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} - Distance in kilometers
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km

  return distance;
};

module.exports = {
  parseLocationString,
  reverseGeocode,
  calculateDistance,
};
