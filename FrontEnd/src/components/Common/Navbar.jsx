import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../Redux/slice/authSlice";
import axios from "axios";
import ApiLink from "../../api";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  // Control profile dropdown
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  // Ref for the profile dropdown container
  const profileMenuRef = useRef(null);

  // Close the profile dropdown if user clicks outside of it
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind on cleanup
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      // Call the logout API
      const token = localStorage.getItem("token");
      await axios({
        method: ApiLink.logout.method,
        url: ApiLink.logout.url,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove token from localStorage
      localStorage.removeItem("token");

      // Dispatch logout action to Redux
      dispatch(logout());

      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Still remove token and logout from Redux in case of API failure
      localStorage.removeItem("token");
      dispatch(logout());
      navigate("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="bg-gray-900 fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main nav area */}
        <div className="flex items-center justify-between h-16">
          {/* Logo / Home Link */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-white text-xl font-bold">SnapShoot</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link to="/" className="text-gray-300 hover:text-white px-3 py-2">
                Home
              </Link>
              <Link
                to="/photographer"
                className="text-gray-300 hover:text-white px-3 py-2"
              >
                Photographers
              </Link>
              <Link
                to="/how-it-works"
                className="text-gray-300 hover:text-white px-3 py-2"
              >
                How It Works
              </Link>
              <Link
                to="/about"
                className="text-gray-300 hover:text-white px-3 py-2"
              >
                About
              </Link>

              {user ? (
                <div className="relative" ref={profileMenuRef}>
                  {/* Button to toggle profile menu */}
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-2 text-white focus:outline-none"
                  >
                    <img
                      src={user.profileImage}
                      alt="Profile"
                      className="w-8 h-8 rounded-full border-2 border-white"
                    />
                  </button>

                  {/* Dropdown menu, shown if isProfileMenuOpen */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 bg-gray-800 text-white rounded-md shadow-lg mt-2 w-40">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 hover:bg-gray-700"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="block px-4 py-2 text-left w-full hover:bg-gray-700"
                      >
                        {isLoggingOut ? "Logging out..." : "Logout"}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-300 hover:text-white px-3 py-2"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="text-gray-300 hover:text-white block px-3 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/photographer"
              className="text-gray-300 hover:text-white block px-3 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Photographers
            </Link>
            <Link
              to="/how-it-works"
              className="text-gray-300 hover:text-white block px-3 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              to="/about"
              className="text-gray-300 hover:text-white block px-3 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>

            {user ? (
              <div className="flex flex-col space-y-2">
                <Link
                  to="/profile"
                  className="bg-white text-blue-600 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="bg-red-500 px-3 py-2 rounded-md text-sm font-medium hover:bg-red-600 text-white"
                >
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link
                  to="/login"
                  className="bg-white text-blue-600 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-green-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
