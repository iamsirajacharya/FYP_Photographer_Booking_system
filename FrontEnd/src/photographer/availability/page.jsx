import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import DashboardLayout from "../DashboardLayout";
import {
  useGetPhotographerAvailabilityQuery,
  useUpdateAvailabilityMutation,
} from "../../redux/api/photographerApi";
import { useSelector } from "react-redux";

export default function PhotographerAvailabilityPage() {
  // Retrieve the authenticated user from Redux store
  const { user } = useSelector((state) => state.auth);

  // Get photographer id from the user profile
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

  // Default working hours
  const [workingHours, setWorkingHours] = useState({
    start: "09:00",
    end: "17:00",
  });

  // Pre-populate workingDays from API data if available
  useEffect(() => {
    if (availabilitySettings && availabilitySettings.photographer) {
      setWorkingDays(
        availabilitySettings.photographer.availableDays || workingDays
      );
      setWorkingHours(
        availabilitySettings.photographer.workingHours || workingHours
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

  // Save settings by updating via the API
  const saveSettings = async () => {
    try {
      await updateAvailability({ workingDays, workingHours }).unwrap();
      // Show success notification
      alert("Availability updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Error saving settings");
    }
  };

  if (!photographerId) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
          <div className="mx-auto max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No photographer profile found
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Please complete your profile to manage availability.
            </p>
            <a
              href="/photographer/profile"
              className="inline-flex items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Complete Profile
            </a>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl bg-red-50 dark:bg-red-900/20 p-8 text-center">
          <h2 className="text-xl font-semibold text-red-700 dark:text-red-300 mb-2">
            Error loading availability settings
          </h2>
          <p className="text-red-600 dark:text-red-300">
            {error.message || "Unknown error"}
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Manage Availability
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-300">
            Configure your working days and hours
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            className="inline-flex items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            onClick={saveSettings}
            disabled={updating}
          >
            <Save className="mr-2 h-4 w-4" />
            {updating ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Working Days Card */}
        <div className="rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Working Days
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Select the days you're available for bookings
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Object.entries(workingDays).map(([day, isWorking]) => (
                <label
                  key={day}
                  className="flex items-center space-x-3 cursor-pointer"
                >
                  <div className="relative">
                    <input
                      id={`day-${day}`}
                      type="checkbox"
                      checked={isWorking}
                      onChange={() => toggleDayAvailability(day)}
                      className="peer appearance-none h-5 w-5 rounded border border-gray-300 dark:border-gray-600 checked:border-purple-500 dark:checked:border-purple-500 checked:bg-purple-500 dark:checked:bg-purple-500"
                    />
                    <svg
                      className="absolute top-0.5 left-0.5 h-4 w-4 text-white opacity-0 peer-checked:opacity-100"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-800 dark:text-gray-300 capitalize">
                    {day}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Working Hours Card */}
        <div className="rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Working Hours
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Set your standard working hours
            </p>
          </div>
          <div className="p-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="start-time"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Start Time
                </label>
                <input
                  id="start-time"
                  type="time"
                  value={workingHours.start}
                  onChange={(e) =>
                    setWorkingHours((prev) => ({
                      ...prev,
                      start: e.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 p-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div>
                <label
                  htmlFor="end-time"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  End Time
                </label>
                <input
                  id="end-time"
                  type="time"
                  value={workingHours.end}
                  onChange={(e) =>
                    setWorkingHours((prev) => ({
                      ...prev,
                      end: e.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 p-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>
            </div>

            <div className="mt-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <h3 className="font-medium text-purple-800 dark:text-purple-300 mb-1">
                Working Hours Summary
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                You're available from{" "}
                <span className="font-semibold">{workingHours.start}</span> to{" "}
                <span className="font-semibold">{workingHours.end}</span> on
                your selected working days.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Break Time & Booking Settings */}
      <div className="mt-8">
        <div className="rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Advanced Settings
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Configure additional availability preferences
            </p>
          </div>
          <div className="p-6 grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                Booking Preferences
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Minimum Notice Period
                  </label>
                  <select
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 p-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    defaultValue="24"
                  >
                    <option value="2">2 hours</option>
                    <option value="6">6 hours</option>
                    <option value="12">12 hours</option>
                    <option value="24">24 hours</option>
                    <option value="48">48 hours</option>
                    <option value="72">72 hours</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Minimum time before a session that clients can book
                  </p>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Maximum Advance Booking
                  </label>
                  <select
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 p-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    defaultValue="3"
                  >
                    <option value="1">1 month</option>
                    <option value="2">2 months</option>
                    <option value="3">3 months</option>
                    <option value="6">6 months</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    How far in advance clients can book sessions
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                Break Time
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Break Between Sessions
                  </label>
                  <select
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 p-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    defaultValue="30"
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Minimum time between consecutive photography sessions
                  </p>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Lunch Break
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="time"
                      className="rounded-md border border-gray-300 dark:border-gray-600 p-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      defaultValue="12:00"
                    />
                    <input
                      type="time"
                      className="rounded-md border border-gray-300 dark:border-gray-600 p-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      defaultValue="13:00"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Set your daily lunch break time
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            <button
              className="inline-flex items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              onClick={saveSettings}
              disabled={updating}
            >
              <Save className="mr-2 h-4 w-4" />
              {updating ? "Saving..." : "Save All Changes"}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
