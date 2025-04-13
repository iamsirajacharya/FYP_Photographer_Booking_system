import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Camera,
  CalendarRange,
  BarChart3,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function AdminSidebar() {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Check if viewport is mobile-sized
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  // Toggle sidebar visibility on mobile
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Sidebar navigation items
  const navItems = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      title: "Photographers",
      href: "/admin/photographers",
      icon: Camera,
    },
    {
      title: "Bookings",
      href: "/admin/bookings",
      icon: CalendarRange,
    },
    {
      title: "Reports",
      href: "/admin/reports",
      icon: BarChart3,
    },
  ];

  // Determine if a nav item is active
  const isActive = (href) => location.pathname === href;

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-purple-600 text-white"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out
          ${
            isMobile
              ? isOpen
                ? "translate-x-0"
                : "-translate-x-full"
              : "translate-x-0"
          }
        `}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-purple-800">Admin Panel</h2>
        </div>

        {/* Navigation Links */}
        <nav className="p-2">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.title}>
                <Link
                  to={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors
                    ${
                      isActive(item.href)
                        ? "bg-purple-600 text-white font-medium"
                        : "hover:bg-gray-100 text-gray-700"
                    }
                  `}
                >
                  <item.icon size={18} />
                  <span>{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}
