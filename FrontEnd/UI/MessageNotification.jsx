import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { setUnreadCount } from "../src/redux/slices/mesageSlice";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// Extend dayjs with relative time plugin
dayjs.extend(relativeTime);

const MessageNotification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();

  // Get unread count from Redux store
  const { unreadCount } = useSelector((state) => state.messages);
  const { user } = useSelector((state) => state.auth);

  // Fetch notifications when dropdown is opened
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch unread count on component mount
  useEffect(() => {
    fetchUnreadCount();

    // Set up interval to periodically check for new messages
    const interval = setInterval(fetchUnreadCount, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Fetch unread message count
  const fetchUnreadCount = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/messages/unread",
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        dispatch(setUnreadCount(data.unreadCount));
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  // Fetch recent messages/notifications
  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:3000/api/messages/conversations",
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.conversations.slice(0, 5)); // Show only 5 most recent
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-purple-600 text-xs font-medium text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg z-50 animate-in fade-in slide-in-from-top-5 duration-200">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="font-medium text-gray-900 dark:text-white">
              Notifications
            </h3>
            <Link
              to={
                user?.role === "photographer"
                  ? "/photographer/messages"
                  : "/messages"
              }
              className="text-xs text-purple-600 dark:text-purple-400 hover:underline"
              onClick={() => setIsOpen(false)}
            >
              View All
            </Link>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center items-center p-4">
                <div className="h-5 w-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((notification) => (
                <Link
                  key={notification.id}
                  to={
                    user?.role === "photographer"
                      ? `/photographer/messages?userId=${notification.id}`
                      : `/messages?userId=${notification.id}`
                  }
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-800"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src={
                        notification.profileImage ||
                        "/placeholder.svg?height=40&width=40"
                      }
                      alt={notification.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {notification.name}
                      </p>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {dayjs(notification.lastMessageTime).fromNow()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                      {notification.lastMessage}
                    </p>
                  </div>
                  {notification.unreadCount > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-purple-600 px-1.5 text-xs font-medium text-white">
                      {notification.unreadCount}
                    </span>
                  )}
                </Link>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No new notifications
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageNotification;
