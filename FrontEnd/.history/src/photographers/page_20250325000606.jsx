import React, { useState } from "react";
import { PhotographerCard } from "../../UI/photographer-card";
import { Header } from "../../UI/header";
import { Footer } from "../../UI/footer";
import { Search } from "lucide-react";
import { useGetPhotographersQuery } from "../redux/api/photographerApi";

export default function PhotographersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const {
    data: photographers,
    isLoading,
    isError,
    error,
  } = useGetPhotographersQuery();
  const photographerList = data?.photographers || [];
  // Filter photographers based on search term
  const filteredPhotographers = photographerList.filter((p) => {
        return (
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.location &&
            p.location.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      })
    , [];

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1 container py-8">
          <p className="text-center text-xl">Loading photographers...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1 container py-8">
          <p className="text-center text-xl text-red-600">
            Error loading photographers: {error?.message || "Unknown error"}
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container py-8">
          <h1 className="mb-6 text-3xl font-bold text-purple-800">
            Browse Photographers
          </h1>

          <div className="grid gap-6 md:grid-cols-[300px_1fr]">
            {/* Filter sidebar */}
            <div className="space-y-6">
              <div className="rounded-lg border bg-white shadow-sm">
                <div className="p-4 space-y-4">
                  <h3 className="text-lg font-medium">Search</h3>
                  <div className="flex items-center gap-2">
                    <input
                      placeholder="Enter keywords"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    />
                    <button className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-purple-600 text-white hover:bg-purple-700 transition-colors">
                      <Search className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="rounded-lg border bg-white shadow-sm">
                <div className="p-4 space-y-4">
                  <h3 className="text-lg font-medium">
                    Price Range (per hour)
                  </h3>
                  <input
                    type="range"
                    min="0"
                    max="300"
                    step="10"
                    defaultValue="100"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex items-center justify-between text-sm">
                    <span>$0</span>
                    <span>$100</span>
                    <span>$300+</span>
                  </div>
                </div>
              </div>

              {/* Photography Type Filter */}
              <div className="rounded-lg border bg-white shadow-sm">
                <div className="p-4 space-y-4">
                  <h3 className="text-lg font-medium">Photography Type</h3>
                  <div className="space-y-2">
                    {[
                      "Portrait",
                      "Wedding",
                      "Event",
                      "Family",
                      "Commercial",
                      "Landscape",
                      "Fine Art",
                    ].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`type-${type}`}
                          className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600"
                        />
                        <label htmlFor={`type-${type}`} className="text-sm">
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Equipment Filter */}
              <div className="rounded-lg border bg-white shadow-sm">
                <div className="p-4 space-y-4">
                  <h3 className="text-lg font-medium">Equipment</h3>
                  <div className="space-y-2">
                    {[
                      "DSLR",
                      "Mirrorless",
                      "Studio Lighting",
                      "Drone",
                      "Underwater",
                      "Video",
                    ].map((equipment) => (
                      <div
                        key={equipment}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          id={`equipment-${equipment}`}
                          className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600"
                        />
                        <label
                          htmlFor={`equipment-${equipment}`}
                          className="text-sm"
                        >
                          {equipment}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Photographer list */}
            <div className="space-y-6">
              <div className="w-full">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-gray-500">
                      Found {filteredPhotographers.length} photographers
                    </span>
                  </div>
                  <div className="inline-flex rounded-md border bg-white shadow-sm">
                    <button className="inline-flex items-center justify-center whitespace-nowrap rounded-l-md border-r px-3 py-2 text-sm font-medium bg-purple-600 text-white">
                      Grid View
                    </button>
                    <button className="inline-flex items-center justify-center whitespace-nowrap rounded-r-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                      List View
                    </button>
                  </div>
                </div>

                <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredPhotographers.map((photographer) => (
                    <PhotographerCard
                      key={photographer.id}
                      name={photographer.name}
                      specialty={photographer.specialty}
                      description={photographer.description}
                      price={photographer.price}
                      rating={photographer.rating}
                      image={photographer.image}
                      location={photographer.location}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
