"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Clock, Save } from "lucide-react"

export default function PhotographerAvailabilityPage() {
  const [date, setDate] = useState(new Date())
  const [workingDays, setWorkingDays] = useState({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: false,
  })
  
  const [workingHours, setWorkingHours] = useState({
    start: "09:00",
    end: "17:00",
  })
  
  const [timeSlots, setTimeSlots] = useState([
    { id: 1, time: "09:00 - 11:00", available: true },
    { id: 2, time: "11:00 - 13:00", available: true },
    { id: 3, time: "13:00 - 15:00", available: true },
    { id: 4, time: "15:00 - 17:00", available: true },
    { id: 5, time: "17:00 - 19:00", available: false },
  ])
  
  const [unavailableDates, setUnavailableDates] = useState([
    new Date(2023, 10, 24), // November 24, 2023
    new Date(2023, 10, 25), // November 25, 2023
    new Date(2023, 11, 24), // December 24, 2023
    new Date(2023, 11, 25), // December 25, 2023
  ])

  const toggleDayAvailability = (day) => {
    setWorkingDays({
      ...workingDays,
      [day]: !workingDays[day],
    })
  }

  const toggleTimeSlotAvailability = (id) => {
    setTimeSlots(timeSlots.map(slot => 
      slot.id === id ? { ...slot, available: !slot.available } : slot
    ))
  }

  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate)
    
    // Check if date is already in unavailable dates
    const isUnavailable = unavailableDates.some(
      d => d.toDateString() === selectedDate.toDateString()
    )
    
    if (isUnavailable) {
      // Remove from unavailable dates
      setUnavailableDates(unavailableDates.filter(
        d => d.toDateString() !== selectedDate.toDateString()
      ))
    } else {
      // Add to unavailable dates
      setUnavailableDates([...unavailableDates, selectedDate])
    }
  }

  const isDateUnavailable = (date) => {
    return unavailableDates.some(d => d.toDateString() === date.toDateString())
  }

  const saveSettings = () => {
    // In a real app, this would save the settings to a database
    alert("Availability settings saved successfully!")
  }

  return (
    <div className="container py-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-purple-800">Manage Availability</h1>
          <p className="text-muted-foreground">Set your working hours and unavailable dates</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button className="bg-purple-600 hover:bg-purple-700" onClick={saveSettings}>
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
                      onChange={(e) => setWorkingHours({ ...workingHours, start: e.target.value })}
                    >
                      {Array.from({ length: 13 }, (_, i) => i + 6).map((hour) => (
                        <option key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                          {hour === 12 ? '12:00 PM' : hour < 12 ? `${hour}:00 AM` : `${hour - 12}:00 PM`}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-time">End Time</Label>
                    <select
                      id="end-time"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={workingHours.end}
                      onChange={(e) => setWorkingHours({ ...workingHours, end: e.target.value })}
                    >
                      {Array.from({ length: 13 }, (_, i) => i + 8).map((hour) => (
                        <option key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                          {hour === 12 ? '12:00 PM' : hour < 12 ? `${hour}:00 AM` : `${hour - 12}:00 PM`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="mb-4 text-sm font-medium">Time Slots</h3>
                <div className="space-y-2">
                  {timeSlots.map((slot) => (
                    <div key={slot.id} className="flex items-center justify-between rounded-md border p-3">
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-purple-600" />
                        <span>{slot.time}</span>
                      </div>
                      <Switch 
                        checked={slot.available}\

