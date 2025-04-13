import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="w-full border-t bg-background py-6 md:py-10">
      <div className="container grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-purple-600">SnapBook</h3>
          <p className="text-sm text-gray-500">
            Connecting talented photographers with clients looking for quality
            photography services.
          </p>
        </div>
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className="text-sm text-gray-500 hover:text-purple-600"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/photographers"
                className="text-sm text-gray-500 hover:text-purple-600"
              >
                Browse Photographers
              </Link>
            </li>
            <li>
              <Link
                to="/map"
                className="text-sm text-gray-500 hover:text-purple-600"
              >
                Map View
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="text-sm text-gray-500 hover:text-purple-600"
              >
                About Us
              </Link>
            </li>
          </ul>
        </div>
        <div className="space-y-3">
          <h3 className="text-lg font-medium">User Services</h3>
          <ul className="space-y-2">
            <li>
              <Link
                to="/login"
                className="text-sm text-gray-500 hover:text-purple-600"
              >
                Login/Register
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className="text-sm text-gray-500 hover:text-purple-600"
              >
                My Account
              </Link>
            </li>
            <li>
              <Link
                to="/bookings"
                className="text-sm text-gray-500 hover:text-purple-600"
              >
                Booking Management
              </Link>
            </li>
            <li>
              <Link
                to="/apply"
                className="text-sm text-gray-500 hover:text-purple-600"
              >
                Become a Photographer
              </Link>
            </li>
          </ul>
        </div>
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Contact Us</h3>
          <ul className="space-y-2">
            <li className="text-sm text-gray-500">
              Email: contact@snapbook.com
            </li>
            <li className="text-sm text-gray-500">Phone: 800-123-4567</li>
            <li className="text-sm text-gray-500">
              Address: 123 Photography St, New York, NY 10001
            </li>
          </ul>
        </div>
      </div>
      <div className="container mt-8 border-t pt-6">
        <p className="text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} SnapBook Photography Booking. All
          rights reserved.
        </p>
      </div>
    </footer>
  );
}
