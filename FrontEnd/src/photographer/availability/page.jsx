import React, { useState, useEffect } from "react";
import { Save } from "lucide-react";
import DashboardLayout from "../DashboardLayout";
import {
  useGetPhotographerAvailabilityQuery,
  useUpdateAvailabilityMutation,
} from "../../redux/api/photographerApi";
import { useSelector } from "react-redux";

export default function PhotographerAvailabilityPage() {
  // Retrieve the authenticated user from Redux store.
  // Ensure your auth reducer provides the user object.
  const { user } = useSelector((state) => state.auth);

  // Get photographer id from the user profile. Adjust based on your state shape.
  const photographerId = user?.photographerProfile?.id;

  // Skip fetching if photographerId is not available
  const {
    data: availabilitySettings,
    isLoading,
    error,
  } = useGetPhotographerAvailabilityQuery(
    { id: photographerId },
    { skip: !photographerId }
  );

  // Mutation hook to update availability
  const [updateAvailability, { isLoading: updating }] =
    useUpdateAvailabilityMutation();

  // Local state to manage working days (availableDays)
  const [workingDays, setWorkingDays] = useState({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: false,
  });

  // Pre-populate workingDays from API data if available
  useEffect(() => {
    if (availabilitySettings && availabilitySettings.photographer) {
      setWorkingDays(
        availabilitySettings.photographer.availableDays || workingDays
      );
    }
  }, [availabilitySettings]);

  // Toggle the availability for a given day
  const toggleDayAvailability = (day) => {
    setWorkingDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  // Save settings by updating only availableDays via the API
  const saveSettings = async () => {
    try {
      await updateAvailability({ workingDays }).unwrap();
      alert("Availability updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Error saving settings");
    }
  };

  if (!photographerId) {
    return (
      <div>No photographer profile found. Please complete your profile.</div>
    );
  }
  if (isLoading) return <div>Loading availability settings...</div>;
  if (error) return <div>Error loading availability settings.</div>;

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-purple-800">
            Manage Availability
          </h1>
          <p className="text-muted-foreground">Set your working days</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
            onClick={saveSettings}
            disabled={updating}
          >
            <Save className="mr-2 h-4 w-4" />
            {updating ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>

      {/* Working Days Card */}
      <div className="border rounded-lg shadow-sm p-4">
        <h3 className="mb-4 text-sm font-medium">Working Days</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {Object.entries(workingDays).map(([day, isWorking]) => (
            <div key={day} className="flex items-center space-x-2">
              <input
                id={`day-${day}`}
                type="checkbox"
                checked={isWorking}
                onChange={() => toggleDayAvailability(day)}
                className="form-checkbox"
              />
              <label htmlFor={`day-${day}`} className="capitalize">
                {day}
              </label>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
