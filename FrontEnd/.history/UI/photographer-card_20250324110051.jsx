import React from "react";
import { Link } from "react-router-dom";
import { Heart, MapPin, Star, Camera } from "lucide-react";

export function PhotographerCard({
  name,
  specialty,
  description,
  price,
  rating,
  image,
  location,
  tags,
}) {
  return (
    <div className="overflow-hidden rounded-lg border bg-white shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="relative">
        <img
          src={image || "/placeholder.svg"}
          alt={name}
          className="h-48 w-full object-cover"
        />
        <button className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-red-500 hover:bg-white hover:text-red-600 transition-colors">
          <Heart className="h-5 w-5" />
          <span className="sr-only">Favorite</span>
        </button>
        {tags && tags.length > 0 && (
          <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg text-purple-800">{name}</h3>
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="ml-1 text-sm">{rating}</span>
            </div>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Camera className="mr-1 h-4 w-4 text-purple-600" />
            <span className="font-medium">{specialty}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="mr-1 h-4 w-4 text-purple-600" />
            {location}
          </div>
          <p className="text-sm text-gray-500 line-clamp-2">{description}</p>
        </div>
      </div>
      <div className="flex items-center justify-between bg-purple-50 p-4 border-t">
        <div className="flex items-end">
          <span className="text-xl font-bold text-purple-700">${price}</span>
          <span className="text-sm text-gray-500">/hour</span>
        </div>
        <Link
          to={`/photographers/${encodeURIComponent(name)}`}
          className="inline-flex items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-purple-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}
