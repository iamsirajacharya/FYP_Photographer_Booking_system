"use client";

import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Home,
  MapPin,
  Menu,
  Search,
  Calendar,
  Camera,
  X,
  User,
  Settings,
  LogOut,
} from "lucide-react";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white shadow-sm backdrop-blur-md bg-white/90">
      <div className="mx-auto flex h-16 w-full max-w-screen-xl items-center justify-between px-4 lg:px-6">
        {/* Left section (Brand + Menu) */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Mobile menu button (Hamburger) */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Brand / Logo */}
          <Link to="/user/dashboard" className="flex items-center space-x-2">
            <span className="text-2xl font-black text-purple-700 tracking-tight">
              SnapBook
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 md:flex">
            <Link
              to="/user/dashboard"
              className="flex items-center gap-1.5 text-sm font-medium text-gray-700 transition-colors hover:text-purple-600"
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link
              to="/photographers"
              className="flex items-center gap-1.5 text-sm font-medium text-gray-700 transition-colors hover:text-purple-600"
            >
              <Search className="h-4 w-4" />
              Browse Photographers
            </Link>
            <Link
              to="/map"
              className="flex items-center gap-1.5 text-sm font-medium text-gray-700 transition-colors hover:text-purple-600"
            >
              <MapPin className="h-4 w-4" />
              Map View
            </Link>
            <Link
              to="/apply"
              className="flex items-center gap-1.5 text-sm font-medium text-gray-700 transition-colors hover:text-purple-600"
            >
              <Camera className="h-4 w-4" />
              Become a Photographer
            </Link>
          </nav>
        </div>

        {/* Right section (User Profile) */}
        <div className="flex items-center gap-4">
          {/* Notification badge could go here */}

          <div className="relative" ref={profileMenuRef}>
            {/* Profile avatar button */}
            <button
              className="inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-50 transition-all hover:border-purple-400 hover:ring-2 hover:ring-purple-100"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              aria-expanded={isProfileMenuOpen}
              aria-haspopup="true"
            >
              <img
                src="/placeholder.svg"
                alt="User avatar"
                className="h-full w-full object-cover"
              />
            </button>

            {/* Profile dropdown menu */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="border-b border-gray-100 px-4 py-3">
                  <p className="text-sm font-medium text-gray-900">John Doe</p>
                  <p className="truncate text-sm text-gray-500">
                    johndoe@example.com
                  </p>
                </div>
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <User className="mr-3 h-4 w-4 text-gray-500" />
                  Profile
                </Link>
                <Link
                  to="/bookings"
                  className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <Calendar className="mr-3 h-4 w-4 text-gray-500" />
                  My Bookings
                </Link>
                <Link
                  to="/favorites"
                  className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <Heart className="mr-3 h-4 w-4 text-gray-500" />
                  My Favorites
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <Settings className="mr-3 h-4 w-4 text-gray-500" />
                  Settings
                </Link>
                <div className="border-t border-gray-100 mt-1">
                  <Link
                    to="/logout"
                    className="flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <LogOut className="mr-3 h-4 w-4 text-red-500" />
                    Logout
                  </Link>
                </div>
              </div>
            )}
          </div>
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
          <div className="relative flex h-full w-3/4 max-w-sm flex-col border-r border-gray-200 bg-white p-6 shadow-xl">
            {/* Header in the drawer */}
            <div className="mb-6 flex items-center justify-between">
              <Link
                to="/user/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center"
              >
                <span className="text-xl font-black tracking-tight text-purple-700">
                  SnapBook
                </span>
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* User profile info in mobile menu */}
            <div className="mb-6 flex items-center space-x-4 border-b border-gray-100 pb-6">
              <img
                src="/placeholder.svg"
                alt="User avatar"
                className="h-14 w-14 rounded-full border border-gray-200 bg-gray-50"
              />
              <div>
                <h3 className="font-medium text-gray-900">John Doe</h3>
                <Link
                  to="/profile"
                  className="text-sm text-purple-600 hover:text-purple-700 hover:underline"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  View Profile
                </Link>
              </div>
            </div>

            {/* Mobile nav links */}
            <nav className="flex flex-col gap-1.5">
              <Link
                to="/user/dashboard"
                className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-purple-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="h-5 w-5 text-purple-600" />
                Home
              </Link>
              <Link
                to="/photographers"
                className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-purple-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Search className="h-5 w-5 text-purple-600" />
                Browse Photographers
              </Link>
              <Link
                to="/map"
                className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-purple-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <MapPin className="h-5 w-5 text-purple-600" />
                Map View
              </Link>
              <Link
                to="/favorites"
                className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-purple-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Heart className="h-5 w-5 text-purple-600" />
                My Favorites
              </Link>
              <Link
                to="/bookings"
                className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-purple-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Calendar className="h-5 w-5 text-purple-600" />
                My Bookings
              </Link>
              <Link
                to="/apply"
                className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-purple-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Camera className="h-5 w-5 text-purple-600" />
                Become a Photographer
              </Link>

              <div className="my-2 border-t border-gray-100"></div>

              <Link
                to="/settings"
                className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-purple-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Settings className="h-5 w-5 text-purple-600" />
                Settings
              </Link>
              <Link
                to="/logout"
                className="flex items-center gap-3 rounded-md px-3 py-2.5 mt-1 text-sm font-medium text-red-600 hover:bg-red-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <LogOut className="h-5 w-5 text-red-500" />
                Logout
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
