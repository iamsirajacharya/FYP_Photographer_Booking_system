export default function Loading() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 space-y-4">
        <div className="h-8 w-1/4 animate-pulse rounded-md bg-muted"></div>
        <div className="h-4 w-2/3 animate-pulse rounded-md bg-muted"></div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array(8)
          .fill(null)
          .map((_, index) => (
            <div
              key={index}
              className="flex flex-col overflow-hidden rounded-lg border border-border bg-background shadow-sm"
            >
              {/* Image skeleton */}
              <div className="h-48 w-full animate-pulse bg-muted"></div>

              {/* Content skeleton */}
              <div className="p-4 space-y-3">
                {/* Name skeleton */}
                <div className="h-6 w-3/4 animate-pulse rounded-md bg-muted"></div>

                {/* Specialization skeleton */}
                <div className="flex gap-2">
                  <div className="h-5 w-16 animate-pulse rounded-full bg-muted"></div>
                  <div className="h-5 w-20 animate-pulse rounded-full bg-muted"></div>
                </div>

                {/* Rating skeleton */}
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-pulse rounded-full bg-muted"></div>
                  <div className="h-4 w-24 animate-pulse rounded-md bg-muted"></div>
                </div>

                {/* Price skeleton */}
                <div className="h-4 w-16 animate-pulse rounded-md bg-muted"></div>

                {/* Button skeleton */}
                <div className="mt-2 h-9 w-full animate-pulse rounded-md bg-muted"></div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

