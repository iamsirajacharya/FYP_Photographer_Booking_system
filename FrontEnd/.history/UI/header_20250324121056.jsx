import React, { useState, useRef, useEffect } from "react";
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
  // We'll assume user is always logged in since this is post-login header
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

        {/* Right section (User Profile) */}
        <div className="flex items-center gap-2">
          <div className="relative" ref={profileMenuRef}>
            {/* Profile avatar button */}
            <button
              className="inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-gray-200 hover:border-purple-400"
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
              <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="border-b border-gray-100 px-4 py-3">
                  <p className="text-sm font-medium text-gray-900">John Doe</p>
                  <p className="truncate text-sm text-gray-500">
                    johndoe@example.com
                  </p>
                </div>
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <User className="mr-2 h-4 w-4 text-gray-500" />
                  Profile
                </Link>
                <Link
                  to="/bookings"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                  My Bookings
                </Link>
                <Link
                  to="/favorites"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <Heart className="mr-2 h-4 w-4 text-gray-500" />
                  My Favorites
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <Settings className="mr-2 h-4 w-4 text-gray-500" />
                  Settings
                </Link>
                <div className="border-t border-gray-100">
                  <Link
                    to="/logout"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <LogOut className="mr-2 h-4 w-4 text-gray-500" />
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

            {/* User profile info in mobile menu */}
            <div className="mb-6 flex items-center space-x-3 border-b border-gray-200 pb-4">
              <img
                src="/placeholder.svg"
                alt="User avatar"
                className="h-12 w-12 rounded-full border border-gray-200"
              />
              <div>
                <h3 className="font-medium">John Doe</h3>
                <Link
                  to="/profile"
                  className="text-sm text-purple-600 hover:underline"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  View Profile
                </Link>
              </div>
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
              <div className="mt-4 border-t border-gray-200 pt-4">
                <Link
                  to="/settings"
                  className="flex items-center gap-2 text-lg font-medium text-gray-700 hover:text-purple-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Settings className="h-5 w-5 text-purple-600" />
                  Settings
                </Link>
                <Link
                  to="/logout"
                  className="mt-4 flex items-center gap-2 text-lg font-medium text-gray-700 hover:text-purple-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LogOut className="h-5 w-5 text-purple-600" />
                  Logout
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
