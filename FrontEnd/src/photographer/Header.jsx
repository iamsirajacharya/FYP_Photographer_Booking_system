import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Handle click outside of dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // Implement logout logic
    // This could involve:
    // 1. Clearing authentication token
    // 2. Clearing user session
    // 3. Redirecting to login page
    localStorage.removeItem("authToken");
    sessionStorage.clear();
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  return (
    <header className="bg-white shadow py-4 relative">
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Logo & Branding */}
        <Link to="/photographer/dashboard" className="flex items-center">
          <span className="text-xl font-bold text-purple-800">SnapShoot</span>
        </Link>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-gray-600 hover:text-purple-600"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:block">
          <ul className="flex space-x-4">
            <li>
              <NavLink
                to="/photographer/dashboard"
                end
                className={({ isActive }) =>
                  isActive
                    ? "text-purple-600 font-medium"
                    : "text-gray-600 hover:text-purple-600"
                }
              >
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/photographer/bookings"
                className={({ isActive }) =>
                  isActive
                    ? "text-purple-600 font-medium"
                    : "text-gray-600 hover:text-purple-600"
                }
              >
                Bookings
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/photographer/availability"
                className={({ isActive }) =>
                  isActive
                    ? "text-purple-600 font-medium"
                    : "text-gray-600 hover:text-purple-600"
                }
              >
                Availability
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/photographer/portfolio"
                className={({ isActive }) =>
                  isActive
                    ? "text-purple-600 font-medium"
                    : "text-gray-600 hover:text-purple-600"
                }
              >
                Portfolio
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/photographer/reviews"
                className={({ isActive }) =>
                  isActive
                    ? "text-purple-600 font-medium"
                    : "text-gray-600 hover:text-purple-600"
                }
              >
                Reviews
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Profile Avatar with Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleProfileDropdown}
            className="focus:outline-none"
          >
            <img
              src="/placeholder.svg?height=100&width=100"
              alt="User Avatar"
              className="h-10 w-10 rounded-full"
            />
          </button>

          {/* Dropdown Menu */}
          {isProfileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-20">
              <ul className="py-1">
                <li>
                  <Link
                    to="/photographer/profile"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="/photographer/settings"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    Settings
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu - Slide Out */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg z-20">
          <ul className="flex flex-col space-y-2 p-4">
            <li>
              <NavLink
                to="/photographer/dashboard"
                end
                className={({ isActive }) =>
                  isActive
                    ? "text-purple-600 font-medium block"
                    : "text-gray-600 hover:text-purple-600 block"
                }
                onClick={toggleMobileMenu}
              >
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/photographer/bookings"
                className={({ isActive }) =>
                  isActive
                    ? "text-purple-600 font-medium block"
                    : "text-gray-600 hover:text-purple-600 block"
                }
                onClick={toggleMobileMenu}
              >
                Bookings
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/photographer/availability"
                className={({ isActive }) =>
                  isActive
                    ? "text-purple-600 font-medium block"
                    : "text-gray-600 hover:text-purple-600 block"
                }
                onClick={toggleMobileMenu}
              >
                Availability
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/photographer/portfolio"
                className={({ isActive }) =>
                  isActive
                    ? "text-purple-600 font-medium block"
                    : "text-gray-600 hover:text-purple-600 block"
                }
                onClick={toggleMobileMenu}
              >
                Portfolio
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/photographer/reviews"
                className={({ isActive }) =>
                  isActive
                    ? "text-purple-600 font-medium block"
                    : "text-gray-600 hover:text-purple-600 block"
                }
                onClick={toggleMobileMenu}
              >
                Reviews
              </NavLink>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
