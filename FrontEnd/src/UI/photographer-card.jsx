import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Star } from "lucide-react";

export const PhotographerCard = ({
  name,
  specialty,
  description,
  price,
  rating,
  image,
  location,
  id,
}) => {
  return (
    <div className="group relative overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md">
      <Link to={id ? `/photographers/${id}` : "#"} className="block">
        <div className="aspect-w-16 aspect-h-10 overflow-hidden bg-gray-100">
          <img
            src={image || "/placeholder.svg"}
            alt={`${name}'s profile`}
            className="h-48 w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">{name}</h3>
            <div className="flex items-center">
              <Star className="mr-1 h-4 w-4 text-yellow-400" />
              <span className="text-sm font-medium">{rating}</span>
            </div>
          </div>
          <p className="mt-1 text-sm font-medium text-purple-600">
            {specialty}
          </p>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <MapPin className="mr-1 h-4 w-4 text-gray-400" />
            <span>{location}</span>
          </div>
          <p className="mt-2 line-clamp-2 text-sm text-gray-600">
            {description}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-lg font-bold text-gray-900">
              ${price}
              <span className="text-sm font-normal text-gray-500">/hr</span>
            </p>
            <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
              Available
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};
