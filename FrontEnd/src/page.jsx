import React from "react";
import { Link } from "react-router-dom";
import { PhotographerCard } from "../UI/photographer-card";
import { MapPin, Search, Star, Camera } from "lucide-react";
import { Header } from "../UI/header";
import { Footer } from "../UI/footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full bg-gradient-to-r from-purple-50 to-purple-100 py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter text-purple-900 sm:text-5xl">
                    Find Your Perfect Photographer
                  </h1>
                  <p className="max-w-[600px] text-gray-600 md:text-xl lg:text-base xl:text-xl">
                    Discover talented photographers, explore their portfolios,
                    and book your perfect photoshoot with ease.
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Link
                    to="/photographers"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-purple-600 px-8 text-sm font-medium text-white shadow transition hover:bg-purple-700"
                  >
                    Browse Photographers
                  </Link>
                  <Link
                    to="/about"
                    className="inline-flex h-10 items-center justify-center rounded-md border bg-white px-8 text-sm font-medium shadow-sm transition hover:bg-gray-100"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
              <div className="mx-auto rounded-lg border bg-white shadow-sm p-6">
                <div className="grid grid-cols-2">
                  <button className="rounded-l-md border-b-2 border-purple-600 bg-white px-3 py-1.5 text-sm font-medium text-purple-700">
                    Search Photographers
                  </button>
                  <button className="rounded-r-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-500">
                    Map View
                  </button>
                </div>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-purple-600" />
                    <input
                      placeholder="Location or photographer name"
                      className="flex-1 rounded-md border px-3 py-2 text-sm"
                      type="text"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="mb-2 text-sm font-medium">Booking date</p>
                      <div className="rounded-md border p-3 bg-white">
                        <div className="grid grid-cols-7 gap-2">
                          {Array.from({ length: 31 }, (_, i) => (
                            <div
                              key={i}
                              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${
                                i === 14
                                  ? "bg-purple-600 text-white"
                                  : "hover:bg-gray-100 cursor-pointer"
                              }`}
                            >
                              {i + 1}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="mb-2 text-sm font-medium">
                        Photography type
                      </p>
                      <select className="w-full rounded-md border bg-white px-3 py-2 text-sm">
                        <option value="">All types</option>
                        <option value="portrait">Portrait</option>
                        <option value="wedding">Wedding</option>
                        <option value="event">Event</option>
                        <option value="commercial">Commercial</option>
                        <option value="landscape">Landscape</option>
                      </select>
                    </div>
                  </div>
                  <button className="inline-flex h-10 w-full items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-700">
                    <Search className="mr-2 h-4 w-4" /> Find Photographers
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Photographers Section */}
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-purple-800 sm:text-5xl">
                Featured Photographers
              </h2>
              <p className="text-gray-500 md:text-xl">
                Explore our top photographers and book your perfect photoshoot
              </p>
            </div>
            <div className="grid gap-6 py-12 lg:grid-cols-3">
              <PhotographerCard
                name="Alex Morgan"
                specialty="Portrait & Fashion"
                description="Creative portrait and fashion photography."
                price={120}
                rating={4.9}
                image="/placeholder.svg?height=400&width=600"
                location="New York City"
              />
              <PhotographerCard
                name="Sarah Chen"
                specialty="Wedding & Events"
                description="Candid and artistic photography styles."
                price={150}
                rating={4.8}
                image="/placeholder.svg?height=400&width=600"
                location="Los Angeles"
              />
              <PhotographerCard
                name="Michael Rodriguez"
                specialty="Landscape & Travel"
                description="Capturing landscapes with vibrant colors."
                price={100}
                rating={4.7}
                image="/placeholder.svg?height=400&width=600"
                location="Denver"
              />
            </div>
            <div className="text-center">
              <Link
                to="/photographers"
                className="inline-flex h-10 rounded-md border bg-white px-8 text-sm font-medium shadow-sm transition hover:bg-gray-100"
              >
                View All Photographers
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full bg-purple-50 py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter text-purple-800 sm:text-5xl">
                  Our Special Services
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We provide comprehensive services to ensure your photography
                  experience is perfect
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <div className="flex flex-col items-center space-y-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                    <Star className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold">Verified Photographers</h3>
                  <p className="text-center text-sm text-gray-500">
                    All photographers are vetted and approved by our team to
                    ensure quality service
                  </p>
                </div>
              </div>
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <div className="flex flex-col items-center space-y-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                    <MapPin className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold">Location Services</h3>
                  <p className="text-center text-sm text-gray-500">
                    Find photographers near you or at your desired location for
                    your convenience
                  </p>
                </div>
              </div>
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <div className="flex flex-col items-center space-y-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                    <Camera className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold">Personalized Matching</h3>
                  <p className="text-center text-sm text-gray-500">
                    Get matched with photographers based on your style
                    preferences and requirements
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter text-purple-800 sm:text-5xl">
                  Client Reviews
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  See what our clients say about our photographers
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-lg border bg-white overflow-hidden shadow-sm"
                >
                  <div className="p-6">
                    <div className="flex items-center space-x-1">
                      {Array(5)
                        .fill(null)
                        .map((_, j) => (
                          <Star
                            key={j}
                            className={`h-4 w-4 ${
                              j < 4
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-200 text-gray-200"
                            }`}
                          />
                        ))}
                    </div>
                    <blockquote className="mt-4 border-l-2 border-purple-500 pl-4">
                      <p className="text-sm text-gray-500">
                        "The photographer was amazing! They captured exactly
                        what I wanted and were professional throughout the
                        entire shoot. The photos turned out better than I could
                        have imagined."
                      </p>
                    </blockquote>
                    <div className="mt-4 flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-gray-200" />
                      <div>
                        <p className="text-sm font-medium">Emily Johnson</p>
                        <p className="text-xs text-gray-500">
                          Portrait Session, June 2023
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="w-full bg-purple-600 py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-5xl">
                  Subscribe to Our Updates
                </h2>
                <p className="max-w-[900px] text-purple-50 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Get the latest photography tips and exclusive offers
                </p>
              </div>
              <div className="mx-auto w-full max-w-md space-y-2">
                <form className="flex space-x-2">
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-purple-900 placeholder:text-purple-900/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="Enter your email"
                    type="email"
                  />
                  <button
                    type="submit"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-purple-600 transition-colors hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
