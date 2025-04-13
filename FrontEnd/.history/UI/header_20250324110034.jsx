import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Home,
  LogIn,
  MapPin,
  Menu,
  Search,
  Calendar,
  Camera,
  X,
} from "lucide-react";

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-6">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-gray-100 md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </button>

          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden">
              <div className="fixed inset-y-0 left-0 z-50 h-full w-3/4 max-w-sm border-r bg-white p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <Link to="/" className="flex items-center space-x-2">
                    <span className="font-bold text-xl text-purple-600">
                      SnapBook
                    </span>
                  </Link>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-gray-100"
                  >
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close menu</span>
                  </button>
                </div>
                <nav className="mt-6 flex flex-col gap-4">
                  <Link
                    to="/"
                    className="flex items-center gap-2 text-lg font-medium"
                  >
                    <Home className="h-5 w-5 text-purple-600" />
                    Home
                  </Link>
                  <Link
                    to="/photographers"
                    className="flex items-center gap-2 text-lg font-medium"
                  >
                    <Search className="h-5 w-5 text-purple-600" />
                    Browse Photographers
                  </Link>
                  <Link
                    to="/map"
                    className="flex items-center gap-2 text-lg font-medium"
                  >
                    <MapPin className="h-5 w-5 text-purple-600" />
                    Map View
                  </Link>
                  <Link
                    to="/favorites"
                    className="flex items-center gap-2 text-lg font-medium"
                  >
                    <Heart className="h-5 w-5 text-purple-600" />
                    My Favorites
                  </Link>
                  <Link
                    to="/bookings"
                    className="flex items-center gap-2 text-lg font-medium"
                  >
                    <Calendar className="h-5 w-5 text-purple-600" />
                    My Bookings
                  </Link>
                  <Link
                    to="/apply"
                    className="flex items-center gap-2 text-lg font-medium"
                  >
                    <Camera className="h-5 w-5 text-purple-600" />
                    Become a Photographer
                  </Link>
                </nav>
              </div>
            </div>
          )}

          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl text-purple-600">SnapBook</span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link to="/" className="text-sm font-medium hover:text-purple-600">
              Home
            </Link>
            <Link
              to="/photographers"
              className="text-sm font-medium hover:text-purple-600"
            >
              Browse Photographers
            </Link>
            <Link
              to="/map"
              className="text-sm font-medium hover:text-purple-600"
            >
              Map View
            </Link>
            <Link
              to="/apply"
              className="text-sm font-medium hover:text-purple-600"
            >
              Become a Photographer
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <div className="relative">
              <button
                className="inline-flex h-10 w-10 items-center justify-center rounded-full overflow-hidden border border-gray-200"
                onClick={() => setIsLoggedIn(false)}
              >
                <img
                  src="/placeholder.svg"
                  alt="User avatar"
                  className="h-full w-full object-cover"
                />
              </button>
              {/* Dropdown menu can be implemented here */}
            </div>
          ) : (
            <button
              onClick={() => setIsLoggedIn(true)}
              className="inline-flex h-9 items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-100"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Login/Register
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
