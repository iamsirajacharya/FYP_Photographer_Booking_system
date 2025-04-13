"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Clock, Save, X } from "lucide-react";

export default function PhotographerAvailabilityPage() {
  const [date, setDate] = useState(new Date());
  const [workingDays, setWorkingDays] = useState({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: false,
  });

  const [workingHours, setWorkingHours] = useState({
    start: "09:00",
    end: "17:00",
  });

  const [timeSlots, setTimeSlots] = useState([
    { id: 1, time: "09:00 - 11:00", available: true },
    { id: 2, time: "11:00 - 13:00", available: true },
    { id: 3, time: "13:00 - 15:00", available: true },
    { id: 4, time: "15:00 - 17:00", available: true },
    { id: 5, time: "17:00 - 19:00", available: false },
  ]);

  const [unavailableDates, setUnavailableDates] = useState([
    new Date(2023, 10, 24), // November 24, 2023
    new Date(2023, 10, 25), // November 25, 2023
    new Date(2023, 11, 24), // December 24, 2023
    new Date(2023, 11, 25), // December 25, 2023
  ]);

  const toggleDayAvailability = (day) => {
    setWorkingDays({
      ...workingDays,
      [day]: !workingDays[day],
    });
  };

  const toggleTimeSlotAvailability = (id) => {
    setTimeSlots(
      timeSlots.map((slot) =>
        slot.id === id ? { ...slot, available: !slot.available } : slot
      )
    );
  };

  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate);

    // Check if date is already in unavailable dates
    const isUnavailable = unavailableDates.some(
      (d) => d.toDateString() === selectedDate.toDateString()
    );

    if (isUnavailable) {
      // Remove from unavailable dates
      setUnavailableDates(
        unavailableDates.filter(
          (d) => d.toDateString() !== selectedDate.toDateString()
        )
      );
    } else {
      // Add to unavailable dates
      setUnavailableDates([...unavailableDates, selectedDate]);
    }
  };

  const isDateUnavailable = (date) => {
    return unavailableDates.some(
      (d) => d.toDateString() === date.toDateString()
    );
  };

  const saveSettings = () => {
    // In a real app, this would save the settings to a database
    alert("Availability settings saved successfully!");
  };

  return (
    <div className="container py-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-purple-800">
            Manage Availability
          </h1>
          <p className="text-muted-foreground">
            Set your working hours and unavailable dates
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button
            className="bg-purple-600 hover:bg-purple-700"
            onClick={saveSettings}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Working Days & Hours</CardTitle>
            <CardDescription>Set your regular working schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="mb-4 text-sm font-medium">Working Days</h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {Object.entries(workingDays).map(([day, isWorking]) => (
                    <div key={day} className="flex items-center space-x-2">
                      <Switch
                        id={`day-${day}`}
                        checked={isWorking}
                        onCheckedChange={() => toggleDayAvailability(day)}
                      />
                      <Label htmlFor={`day-${day}`} className="capitalize">
                        {day}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-sm font-medium">Working Hours</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-time">Start Time</Label>
                    <select
                      id="start-time"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={workingHours.start}
                      onChange={(e) =>
                        setWorkingHours({
                          ...workingHours,
                          start: e.target.value,
                        })
                      }
                    >
                      {Array.from({ length: 13 }, (_, i) => i + 6).map(
                        (hour) => (
                          <option
                            key={hour}
                            value={`${hour.toString().padStart(2, "0")}:00`}
                          >
                            {hour === 12
                              ? "12:00 PM"
                              : hour < 12
                              ? `${hour}:00 AM`
                              : `${hour - 12}:00 PM`}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-time">End Time</Label>
                    <select
                      id="end-time"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={workingHours.end}
                      onChange={(e) =>
                        setWorkingHours({
                          ...workingHours,
                          end: e.target.value,
                        })
                      }
                    >
                      {Array.from({ length: 13 }, (_, i) => i + 8).map(
                        (hour) => (
                          <option
                            key={hour}
                            value={`${hour.toString().padStart(2, "0")}:00`}
                          >
                            {hour === 12
                              ? "12:00 PM"
                              : hour < 12
                              ? `${hour}:00 AM`
                              : `${hour - 12}:00 PM`}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-sm font-medium">Time Slots</h3>
                <div className="space-y-2">
                  {timeSlots.map((slot) => (
                    <div
                      key={slot.id}
                      className="flex items-center justify-between rounded-md border p-3"
                    >
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-purple-600" />
                        <span>{slot.time}</span>
                      </div>
                      <Switch
                        checked={slot.available}
                        onCheckedChange={() =>
                          toggleTimeSlotAvailability(slot.id)
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Unavailable Dates</CardTitle>
            <CardDescription>
              Mark specific dates when you're not available
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Click on dates in the calendar to mark them as unavailable.
                Click again to make them available.
              </p>

              <div className="rounded-md border">
                <div className="p-4">
                  <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium">
                    <div className="text-gray-500">Sun</div>
                    <div className="text-gray-500">Mon</div>
                    <div className="text-gray-500">Tue</div>
                    <div className="text-gray-500">Wed</div>
                    <div className="text-gray-500">Thu</div>
                    <div className="text-gray-500">Fri</div>
                    <div className="text-gray-500">Sat</div>
                  </div>

                  <div className="mt-2 grid grid-cols-7 gap-2">
                    {/* This is a simplified calendar view - in a real app, you'd use a proper calendar component */}
                    {Array.from({ length: 31 }, (_, i) => {
                      const day = i + 1;
                      const currentDate = new Date(
                        date.getFullYear(),
                        date.getMonth(),
                        day
                      );
                      const isUnavailable = isDateUnavailable(currentDate);
                      const isCurrentMonth =
                        currentDate.getMonth() === date.getMonth();

                      if (!isCurrentMonth)
                        return <div key={`empty-${i}`} className="h-10"></div>;

                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => handleDateSelect(currentDate)}
                          className={`flex h-10 w-full items-center justify-center rounded-md text-sm font-medium ${
                            isUnavailable
                              ? "bg-red-100 text-red-600 hover:bg-red-200"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="mb-2 text-sm font-medium">
                  Currently Unavailable Dates
                </h3>
                <div className="space-y-2">
                  {unavailableDates.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {unavailableDates.map((date, index) => (
                        <div
                          key={index}
                          className="flex items-center rounded-full bg-red-100 px-3 py-1 text-xs text-red-600"
                        >
                          {date.toLocaleDateString()}
                          <button
                            onClick={() => handleDateSelect(date)}
                            className="ml-1.5 text-red-500 hover:text-red-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No unavailable dates selected
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Booking Preferences</CardTitle>
            <CardDescription>
              Set additional preferences for your bookings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="advance-notice">Require Advance Notice</Label>
                  <p className="text-sm text-muted-foreground">
                    Require bookings to be made at least 24 hours in advance
                  </p>
                </div>
                <Switch id="advance-notice" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-confirm">Auto-Confirm Bookings</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically confirm bookings without manual approval
                  </p>
                </div>
                <Switch id="auto-confirm" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="buffer-time">Add Buffer Time</Label>
                  <p className="text-sm text-muted-foreground">
                    Add 30 minutes buffer time between bookings
                  </p>
                </div>
                <Switch id="buffer-time" defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          className="bg-purple-600 hover:bg-purple-700"
          onClick={saveSettings}
        >
          <Save className="mr-2 h-4 w-4" />
          Save All Settings
        </Button>
      </div>
    </div>
  );
}
