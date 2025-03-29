import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MapPin, Search } from "lucide-react"

export default function MapLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-6">
        <div className="container px-4 md:px-6">
          <div className="mb-6">
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Map Skeleton */}
            <div className="w-full lg:w-2/3 h-[500px] rounded-lg border bg-gray-100 animate-pulse flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <div className="h-4 w-32 bg-gray-200 rounded mx-auto"></div>
              </div>
            </div>

            {/* Photographers List Skeleton */}
            <div className="w-full lg:w-1/3">
              <div className="mb-4 relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <div className="w-full h-10 bg-gray-200 rounded animate-pulse"></div>
              </div>

              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="rounded-lg border p-3 animate-pulse">
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-16 rounded-md bg-gray-200"></div>
                      <div className="flex-1">
                        <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 w-32 bg-gray-200 rounded mb-1"></div>
                        <div className="h-3 w-20 bg-gray-200 rounded mb-2"></div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="h-4 w-16 bg-gray-200 rounded"></div>
                          <div className="h-4 w-12 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

