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
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex h-16 w-full max-w-screen-xl items-center justify-between px-4">
        {/* Left section (Brand + Menu) */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Mobile menu button (Hamburger) */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-gray-100 md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </button>

          {/* Brand / Logo */}
          <Link to="/user/dashboard" className="flex items-center space-x-2">
            <span className="text-2xl font-black text-purple-700 tracking-wide">
              SnapBook
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              to="/user/dashboard"
              className="text-sm font-medium text-gray-700 transition-colors hover:text-purple-600"
            >
              Home
            </Link>
            <Link
              to="/photographers"
              className="text-sm font-medium text-gray-700 transition-colors hover:text-purple-600"
            >
              Browse Photographers
            </Link>
            <Link
              to="/map"
              className="text-sm font-medium text-gray-700 transition-colors hover:text-purple-600"
            >
              Map View
            </Link>
            <Link
              to="/apply"
              className="text-sm font-medium text-gray-700 transition-colors hover:text-purple-600"
            >
              Become a Photographer
            </Link>
          </nav>
        </div>

        {/* Right section (User/Login) */}
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <div className="relative">
              {/* Example avatar button */}
              <button
                className="inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-gray-200"
                onClick={() => setIsLoggedIn(false)}
              >
                <img
                  src="/placeholder.svg"
                  alt="User avatar"
                  className="h-full w-full object-cover"
                />
              </button>
              {/* TODO: A dropdown menu can be placed here if desired */}
            </div>
          ) : (
            <button
              onClick={() => setIsLoggedIn(true)}
              className="inline-flex items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-purple-700"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Login/Register
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Dark/blur background */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Side drawer */}
          <div className="relative flex h-full w-3/4 max-w-sm flex-col border-r border-gray-200 bg-white p-6 shadow-lg">
            {/* Header in the drawer */}
            <div className="mb-4 flex items-center justify-between">
              <Link
                to="/user/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="text-xl font-black tracking-wide text-purple-700">
                  SnapBook
                </span>
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-600" />
                <span className="sr-only">Close menu</span>
              </button>
            </div>

            {/* Mobile nav links */}
            <nav className="flex flex-col gap-4">
              <Link
                to="/user/dashboard"
                className="flex items-center gap-2 text-lg font-medium text-gray-700 hover:text-purple-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="h-5 w-5 text-purple-600" />
                Home
              </Link>
              <Link
                to="/photographers"
                className="flex items-center gap-2 text-lg font-medium text-gray-700 hover:text-purple-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Search className="h-5 w-5 text-purple-600" />
                Browse Photographers
              </Link>
              <Link
                to="/map"
                className="flex items-center gap-2 text-lg font-medium text-gray-700 hover:text-purple-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <MapPin className="h-5 w-5 text-purple-600" />
                Map View
              </Link>
              <Link
                to="/favorites"
                className="flex items-center gap-2 text-lg font-medium text-gray-700 hover:text-purple-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Heart className="h-5 w-5 text-purple-600" />
                My Favorites
              </Link>
              <Link
                to="/bookings"
                className="flex items-center gap-2 text-lg font-medium text-gray-700 hover:text-purple-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Calendar className="h-5 w-5 text-purple-600" />
                My Bookings
              </Link>
              <Link
                to="/apply"
                className="flex items-center gap-2 text-lg font-medium text-gray-700 hover:text-purple-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Camera className="h-5 w-5 text-purple-600" />
                Become a Photographer
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
