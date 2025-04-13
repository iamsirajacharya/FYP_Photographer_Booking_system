"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar, ChevronRight, Clock, Download, MapPin, Search, Video } from "lucide-react"

// Mock booking data
const bookings = [
  {
    id: "BKG20231025",
    clientName: "Emily Davis",
    clientImage: "/placeholder.svg?height=100&width=100",
    location: "Central Park, New York",
    date: "2023-10-25",
    time: "10:00 AM - 12:00 PM",
    duration: 2,
    price: 120,
    totalPrice: 240,
    status: "confirmed",
    createTime: "2023-09-30 14:30",
    payTime: "2023-09-30 14:35",
    type: "Portrait Session",
  },
  {
    id: "BKG20231028",
    clientName: "Michael Johnson",
    clientImage: "/placeholder.svg?height=100&width=100",
    location: "Studio 42, Brooklyn",
    date: "2023-10-28",
    time: "2:00 PM - 5:00 PM",
    duration: 3,
    price: 150,
    totalPrice: 450,
    status: "confirmed",
    createTime: "2023-09-25 10:15",
    payTime: "2023-09-25 10:20",
    type: "Fashion Shoot",
  },
  {
    id: "BKG20231102",
    clientName: "Sarah Wilson",
    clientImage: "/placeholder.svg?height=100&width=100",
    location: "Client's Home, Manhattan",
    date: "2023-11-02",
    time: "9:00 AM - 11:00 AM",
    duration: 2,
    price: 110,
    totalPrice: 220,
    status: "pending",
    createTime: "2023-10-12 09:20",
    type: "Family Portrait",
  },
  {
    id: "BKG20231015",
    clientName: "John Smith",
    clientImage: "/placeholder.svg?height=100&width=100",
    location: "Times Square, New York",
    date: "2023-10-15",
    time: "4:00 PM - 6:00 PM",
    duration: 2,
    price: 120,
    totalPrice: 240,
    status: "completed",
    createTime: "2023-09-20 11:30",
    payTime: "2023-09-20 11:35",
    type: "Urban Photography",
  },
  {
    id: "BKG20231010",
    clientName: "Lisa Johnson",
    clientImage: "/placeholder.svg?height=100&width=100",
    location: "Battery Park, New York",
    date: "2023-10-10",
    time: "1:00 PM - 3:00 PM",
    duration: 2,
    price: 120,
    totalPrice: 240,
    status: "canceled",
    createTime: "2023-09-18 11:30",
    cancelTime: "2023-09-18 15:45",
    type: "Engagement Photos",
  },
]

// Status mapping
const statusMap = {
  pending: { label: "Pending Confirmation", color: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-800" },
  completed: { label: "Completed", color: "bg-green-100 text-green-800" },
  canceled: { label: "Canceled", color: "bg-gray-100 text-gray-800" },
}

export default function PhotographerBookingsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  // Filter bookings based on active tab and search term
  const filteredBookings = bookings.filter((booking) => {
    const matchesTab = activeTab === "all" || booking.status === activeTab
    const matchesSearch =
      booking.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.type.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesTab && matchesSearch
  })

  return (
    <div className="container py-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-purple-800">My Bookings</h1>
          <p className="text-muted-foreground">Manage your photography sessions</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search bookings..."
              className="pl-9 w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="canceled">Canceled</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6 space-y-6">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <div key={booking.id} className="rounded-lg border bg-white shadow-sm overflow-hidden">
                    <div className="bg-muted/30 p-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-medium">{booking.id}</h3>
                            <Badge className={`${statusMap[booking.status].color}`}>
                              {statusMap[booking.status].label}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">Booking time: {booking.createTime}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {booking.status === "pending" && (
                            <>
                              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                Decline
                              </Button>
                            </>
                          )}
                          {booking.status === "confirmed" && (
                            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                              <Video className="mr-1 h-4 w-4" />
                              Contact Client
                            </Button>
                          )}
                          {booking.status === "completed" && (
                            <Button size="sm" variant="outline">
                              <Download className="mr-1 h-4 w-4" />
                              Upload Photos
                            </Button>
                          )}
                          <Link href={`/photographer/bookings/${booking.id}`}>
                            <Button size="sm" variant="outline">
                              Details
                              <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="p-0">
                      <div className="grid md:grid-cols-[200px_1fr]">
                        <div className="relative">
                          <div className="flex h-full items-center justify-center bg-purple-50 p-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-purple-700">{booking.date.split("-")[2]}</div>
                              <div className="text-sm text-gray-500">
                                {new Date(booking.date).toLocaleString("default", { month: "short" })}
                              </div>
                              <div className="mt-2 text-sm font-medium">{booking.type}</div>
                            </div>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <h3 className="font-semibold text-lg">Client: {booking.clientName}</h3>
                              <div className="flex items-center text-sm text-gray-500">
                                <MapPin className="mr-1 h-4 w-4 text-purple-600" />
                                {booking.location}
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="flex items-center text-sm">
                                  <Calendar className="mr-1 h-4 w-4 text-purple-600" />
                                  <span>{booking.date}</span>
                                </div>
                                <div className="flex items-center text-sm">
                                  <Clock className="mr-1 h-4 w-4 text-purple-600" />
                                  <span>{booking.time}</span>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-2 md:text-right">
                              <div className="text-sm text-gray-500">Duration</div>
                              <div className="font-medium">{booking.duration} hours</div>
                              <div className="text-sm text-gray-500">Total Price</div>
                              <div className="text-xl font-bold text-purple-700">${booking.totalPrice}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex h-60 flex-col items-center justify-center rounded-lg border border-dashed">
                  <Calendar className="h-12 w-12 text-gray-300" />
                  <h3 className="mt-4 text-lg font-medium">No {activeTab !== "all" ? activeTab : ""} bookings</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    You don't have any {activeTab !== "all" ? activeTab : ""} bookings at the moment
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

