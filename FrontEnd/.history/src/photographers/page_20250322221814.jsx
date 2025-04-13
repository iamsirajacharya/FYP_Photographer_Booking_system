import { PhotographerCard } from "../../UI/photographer-card";
import { Header } from "../../UI/header";
import { Footer } from "../../UI/footer";
import { Search } from "lucide-react";

// Mock photographer data
const photographers = [
  {
    id: 1,
    name: "Alex Morgan",
    specialty: "Portrait & Fashion",
    description:
      "Specializing in capturing the essence of individuals through creative portrait and fashion photography.",
    price: 120,
    rating: 4.9,
    image: "/placeholder.svg?height=400&width=600",
    location: "New York City",
  },
  {
    id: 2,
    name: "Sarah Chen",
    specialty: "Wedding & Events",
    description:
      "Documenting your special moments with a blend of candid and artistic photography styles.",
    price: 150,
    rating: 4.8,
    image: "/placeholder.svg?height=400&width=600",
    location: "Los Angeles",
  },
  {
    id: 3,
    name: "Michael Rodriguez",
    specialty: "Landscape & Travel",
    description:
      "Capturing breathtaking landscapes and travel moments with a unique perspective and vibrant colors.",
    price: 100,
    rating: 4.7,
    image: "/placeholder.svg?height=400&width=600",
    location: "Denver",
  },
  {
    id: 4,
    name: "Emma Wilson",
    specialty: "Family & Children",
    description:
      "Creating warm and natural family portraits that capture genuine connections and emotions.",
    price: 110,
    rating: 4.9,
    image: "/placeholder.svg?height=400&width=600",
    location: "Chicago",
  },
  {
    id: 5,
    name: "David Kim",
    specialty: "Commercial & Product",
    description:
      "Professional product and commercial photography with attention to detail and brand aesthetics.",
    price: 130,
    rating: 4.6,
    image: "/placeholder.svg?height=400&width=600",
    location: "Seattle",
  },
  {
    id: 6,
    name: "Olivia Martinez",
    specialty: "Fine Art & Conceptual",
    description:
      "Creating artistic and conceptual photography that tells stories and evokes emotions.",
    price: 140,
    rating: 4.7,
    image: "/placeholder.svg?height=400&width=600",
    location: "Portland",
  },
];

export default function PhotographersPage() {
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
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    />
                    <button className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-purple-600 text-white hover:bg-purple-700 transition-colors">
                      <Search className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

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
                      Found {photographers.length} photographers
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
                  {photographers.map((photographer) => (
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
