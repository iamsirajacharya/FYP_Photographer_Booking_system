import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../Redux/slice/authSlice";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-white text-xl font-bold">SnapShoot</span>
            </Link>
          </div>

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
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-white focus:outline-none">
                    <img
                      src={user.profileImage}
                      alt="Profile"
                      className="w-8 h-8 rounded-full border-2 border-white"
                    />
                  </button>
                  <div className="absolute right-0 hidden group-hover:block bg-gray-800 text-white rounded-md shadow-lg mt-2">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-gray-700"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block px-4 py-2 text-left w-full hover:bg-gray-700"
                    >
                      Logout
                    </button>
                  </div>
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
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 px-3 py-2 rounded-md text-sm font-medium hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link
                  to="/login"
                  className="bg-white text-blue-600 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-green-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-600"
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
