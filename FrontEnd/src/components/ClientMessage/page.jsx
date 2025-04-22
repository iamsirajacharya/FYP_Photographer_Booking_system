import { useState, useEffect, useRef } from "react";
import {
  Search,
  Send,
  ImageIcon,
  Paperclip,
  Phone,
  Video,
  Info,
  ChevronLeft,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Header } from "../../../UI/header";
import {
  getSocket,
  sendMessage,
  markMessagesAsRead,
  sendTypingIndicator,
} from "../../socketService";

// Extend dayjs with relativeTime plugin
dayjs.extend(relativeTime);

// Helper function to build full URL for images stored in the /uploads folder
const getImageUrl = (
  filename,
  placeholder = "/placeholder.svg?height=48&width=48"
) => {
  if (!filename) return placeholder;

  // If filename already starts with /uploads/, don't add it again
  const baseUrl = "http://localhost:3000";
  const path = filename.startsWith("/uploads/")
    ? filename
    : `/uploads/${filename}`;
  return `${baseUrl}${path}`;
};

export default function ClientMessagesPage() {
  const [activeConversation, setActiveConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileViewingChat, setIsMobileViewingChat] = useState(false);
  const [isTyping, setIsTyping] = useState({});
  const [typingTimeout, setTypingTimeout] = useState(null);

  // Loading flags
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // For auto-scrolling to newest message
  const messagesEndRef = useRef(null);

  // Allows reading of URL query params (e.g., ?userId=123)
  const location = useLocation();

  // Get the authenticated user from Redux
  const user = useSelector((state) => state.auth.user);
  const socket = getSocket();

  // =========================================================================
  // 1. Initialize Socket Event Listeners
  // =========================================================================
  useEffect(() => {
    // Listen for new messages
    const handleNewMessage = (event) => {
      const message = event.detail;

      // Only process if it's relevant to the current conversation
      if (
        activeConversation &&
        (message.senderId === activeConversation.id ||
          message.recipientId === activeConversation.id)
      ) {
        setMessages((prevMessages) => [...prevMessages, message]);

        // Mark as read immediately if we're in this conversation
        if (message.senderId === activeConversation.id) {
          markMessagesAsRead(activeConversation.id);
        }
      }

      // Update conversations list with new message
      updateConversationWithMessage(message);
    };

    // Listen for sent message confirmations
    const handleMessageSent = (event) => {
      const message = event.detail;

      // Replace temporary message with confirmed one
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id?.toString().startsWith("temp-") &&
          msg.content === message.content
            ? message
            : msg
        )
      );

      // Update conversations list
      updateConversationWithMessage(message);
    };

    // Listen for typing indicators
    const handleUserTyping = (event) => {
      const { userId, isTyping } = event.detail;
      setIsTyping((prev) => ({ ...prev, [userId]: isTyping }));
    };

    // Listen for read receipts
    const handleMessagesRead = (event) => {
      const { by } = event.detail;

      // Update read status of messages sent to this user
      if (activeConversation && by === activeConversation.id) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.senderId === user.id && !msg.read ? { ...msg, read: true } : msg
          )
        );
      }
    };

    // Add event listeners
    window.addEventListener("new-message", handleNewMessage);
    window.addEventListener("message-sent", handleMessageSent);
    window.addEventListener("user-typing", handleUserTyping);
    window.addEventListener("messages-read", handleMessagesRead);

    // Clean up
    return () => {
      window.removeEventListener("new-message", handleNewMessage);
      window.removeEventListener("message-sent", handleMessageSent);
      window.removeEventListener("user-typing", handleUserTyping);
      window.removeEventListener("messages-read", handleMessagesRead);
    };
  }, [activeConversation, user.id]);

  // Helper function to update conversations list with a new message
  const updateConversationWithMessage = (message) => {
    const isIncoming = message.senderId !== user.id;
    const partnerId = isIncoming ? message.senderId : message.recipientId;

    setConversations((prevConversations) => {
      // Check if conversation exists
      const existingConvIndex = prevConversations.findIndex(
        (conv) => conv.id === partnerId
      );

      if (existingConvIndex >= 0) {
        // Update existing conversation
        const updatedConversations = [...prevConversations];
        updatedConversations[existingConvIndex] = {
          ...updatedConversations[existingConvIndex],
          lastMessage: message.content,
          lastMessageTime: message.createdAt || new Date(),
          unreadCount:
            isIncoming &&
            (!activeConversation || activeConversation.id !== partnerId)
              ? (updatedConversations[existingConvIndex].unreadCount || 0) + 1
              : updatedConversations[existingConvIndex].unreadCount || 0,
        };

        // Move this conversation to the top
        const [conversation] = updatedConversations.splice(
          existingConvIndex,
          1
        );
        return [conversation, ...updatedConversations];
      } else if (message.sender) {
        // Create new conversation if we have sender info
        return [
          {
            id: partnerId,
            name: message.sender.name,
            profileImage: message.sender.profileImage,
            lastMessage: message.content,
            lastMessageTime: message.createdAt || new Date(),
            unreadCount: isIncoming ? 1 : 0,
          },
          ...prevConversations,
        ];
      }

      return prevConversations;
    });
  };

  // =========================================================================
  // 2. Fetch Existing Conversations on Mount
  // =========================================================================
  useEffect(() => {
    fetchConversations();

    // Check if there's a query parameter to open a direct conversation
    const params = new URLSearchParams(location.search);
    const userId = params.get("userId");
    if (userId) {
      fetchUserDetails(userId);
    }
  }, [location]);

  // =========================================================================
  // 3. Filter Conversations Based on Search Term
  // =========================================================================
  const filteredConversations = conversations.filter((conversation) => {
    const name = conversation.name || "";
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // =========================================================================
  // 4. Fetch Existing Conversations from the API
  // =========================================================================
  const fetchConversations = async () => {
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
        // Format conversations for display
        const formattedConversations = (data.conversations || []).map(
          (conversation) => ({
            id: conversation.id,
            name: conversation.name || "Photographer",
            profileImage: conversation.profileImage,
            lastMessage: conversation.lastMessage || "No messages yet",
            lastMessageTime: conversation.lastMessageTime || new Date(),
            unreadCount: conversation.unreadCount || 0,
            specialty: conversation.specialty || "",
          })
        );
        setConversations(formattedConversations);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================================
  // 5. If a userId is in the URL, fetch that user's details and messages
  // =========================================================================
  const fetchUserDetails = async (recipientUserId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/messages/conversations/${recipientUserId}`,
        {
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        // Set active conversation info using partner's details
        setActiveConversation({
          id: recipientUserId,
          name: data.partner?.name || "Photographer",
          profileImage: data.partner?.profileImage, // stored as filename
          specialty: data.partner?.specialty || "",
        });
        setMessages(data.messages || []);
        setIsMobileViewingChat(true);

        // Store the active conversation in localStorage for persistence
        localStorage.setItem(
          "activeConversation",
          JSON.stringify({
            id: recipientUserId,
            name: data.partner?.name || "Photographer",
            profileImage: data.partner?.profileImage,
            specialty: data.partner?.specialty || "",
          })
        );

        // Store messages in localStorage for persistence
        localStorage.setItem(
          `messages_${recipientUserId}`,
          JSON.stringify(data.messages || [])
        );

        // Add this conversation to our list if it's not already there
        setConversations((prevConversations) => {
          if (!prevConversations.some((c) => c.id === recipientUserId)) {
            return [
              ...prevConversations,
              {
                id: recipientUserId,
                name: data.partner?.name || "Photographer",
                profileImage: data.partner?.profileImage,
                lastMessage:
                  data.messages?.[data.messages.length - 1]?.content ||
                  "No messages yet",
                lastMessageTime:
                  data.messages?.[data.messages.length - 1]?.createdAt ||
                  new Date(),
                unreadCount: 0,
                specialty: data.partner?.specialty || "",
              },
            ];
          }
          return prevConversations;
        });

        // Mark messages as read via socket
        markMessagesAsRead(recipientUserId);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  // =========================================================================
  // 6. When activeConversation changes, fetch messages
  // =========================================================================
  useEffect(() => {
    if (activeConversation?.id) {
      fetchMessages(activeConversation.id);
    }
  }, [activeConversation]);

  // =========================================================================
  // 7. Auto-scroll to bottom on new messages
  // =========================================================================
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // =========================================================================
  // 8. Fetch messages for the active conversation
  // =========================================================================
  const fetchMessages = async (conversationId) => {
    setIsLoadingMessages(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/messages/conversations/${conversationId}`,
        {
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);

        // Store messages in localStorage for persistence
        localStorage.setItem(
          `messages_${conversationId}`,
          JSON.stringify(data.messages || [])
        );

        // Mark messages as read via socket
        markMessagesAsRead(conversationId);

        // Update unread count for this conversation in our list
        setConversations((prevConversations) =>
          prevConversations.map((conv) =>
            conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
          )
        );
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // =========================================================================
  // 9. Send a new message
  // =========================================================================
  const handleSendMessage = async () => {
    if (!messageText.trim() || !activeConversation) return;

    try {
      // Create a temporary message to show immediately
      const tempMessage = {
        id: `temp-${Date.now()}`,
        content: messageText,
        senderId: user.id,
        recipientId: activeConversation.id,
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        read: false,
      };

      // Store the message text before clearing the input
      const messageContent = messageText;

      // Update UI immediately
      const updatedMessages = [...messages, tempMessage];
      setMessages(updatedMessages);

      // Store in localStorage
      localStorage.setItem(
        `messages_${activeConversation.id}`,
        JSON.stringify(updatedMessages)
      );

      // Clear input
      setMessageText("");

      // Send via socket.io
      const socketSent = sendMessage(activeConversation.id, messageContent);

      // If socket fails, fall back to API
      if (!socketSent) {
        console.log("Socket send failed, using API fallback");
        const response = await fetch("http://localhost:3000/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recipientId: activeConversation.id,
            content: messageContent,
          }),
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          // Replace temp message with real one
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.id === tempMessage.id ? data.message : msg
            )
          );
        }
      }

      // Update conversations list with latest message
      updateConversationWithMessage({
        ...tempMessage,
        sender: {
          id: user.id,
          name: user.name,
          profileImage: user.profileImage,
        },
      });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  // =========================================================================
  // 10. Handle typing indicator
  // =========================================================================
  const handleTyping = (e) => {
    setMessageText(e.target.value);

    // Send typing indicator
    if (activeConversation) {
      // Clear existing timeout
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }

      // Send typing true
      sendTypingIndicator(activeConversation.id, true);

      // Set timeout to send typing false after 2 seconds of inactivity
      const timeout = setTimeout(() => {
        sendTypingIndicator(activeConversation.id, false);
      }, 2000);

      setTypingTimeout(timeout);
    }
  };

  // For sending on Enter (without Shift)
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // =========================================================================
  // 11. Select a conversation to chat with
  // =========================================================================
  const selectConversation = (conversation) => {
    setActiveConversation(conversation);
    setIsMobileViewingChat(true);

    // Store the active conversation in localStorage
    localStorage.setItem("activeConversation", JSON.stringify(conversation));

    // Mark messages as read
    if (conversation.unreadCount > 0) {
      markMessagesAsRead(conversation.id);
    }

    // Fetch messages
    fetchMessages(conversation.id);
  };

  // =========================================================================
  // 12. Load conversation and messages from localStorage on page load
  // =========================================================================
  useEffect(() => {
    // Only restore from localStorage if we don't have an active conversation from URL
    const params = new URLSearchParams(location.search);
    const urlUserId = params.get("userId");

    if (!urlUserId) {
      const savedConversation = localStorage.getItem("activeConversation");
      if (savedConversation) {
        const parsedConversation = JSON.parse(savedConversation);
        setActiveConversation(parsedConversation);

        // Load messages for this conversation
        const savedMessages = localStorage.getItem(
          `messages_${parsedConversation.id}`
        );
        if (savedMessages) {
          setMessages(JSON.parse(savedMessages));
        }
      }
    }
  }, []);

  // =========================================================================
  // RENDER
  // =========================================================================
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header />

      <div className="flex-1 container mx-auto px-4 py-6 flex flex-col">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Your Messages
        </h1>

        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden flex flex-col md:flex-row">
          {/* =========================================
              1) Conversations List + Search 
             ========================================= */}
          <div
            className={`w-full md:w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col ${
              isMobileViewingChat ? "hidden md:flex" : "flex"
            }`}
          >
            {/* Search Bar */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                <input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-solid border-purple-600 border-r-transparent"></div>
                </div>
              ) : filteredConversations.length > 0 ? (
                filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => selectConversation(conversation)}
                    className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      activeConversation &&
                      activeConversation.id === conversation.id
                        ? "bg-purple-50 dark:bg-purple-900/20"
                        : ""
                    }`}
                  >
                    <div className="relative">
                      <div className="h-12 w-12 rounded-full overflow-hidden">
                        <img
                          src={
                            getImageUrl(
                              conversation.profileImage,
                              "/placeholder.svg?height=48&width=48"
                            ) ||
                            "/placeholder.svg" ||
                            "/placeholder.svg" ||
                            "/placeholder.svg"
                          }
                          alt={conversation.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      {conversation.unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-xs font-medium text-white">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-gray-900 dark:text-white truncate">
                          {conversation.name}
                        </h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {dayjs(conversation.lastMessageTime).fromNow()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {conversation.lastMessage}
                      </p>
                      {conversation.specialty && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {conversation.specialty} Photographer
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center p-4">
                  <div className="rounded-full bg-gray-100 dark:bg-gray-700 p-3 mb-2">
                    <Search className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    No conversations yet
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {searchTerm
                      ? "Try a different search term"
                      : "Browse photographers to start a conversation"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* =========================================
              2) Chat Area
             ========================================= */}
          <div
            className={`w-full md:w-2/3 flex flex-col ${
              !isMobileViewingChat ? "hidden md:flex" : "flex"
            }`}
          >
            {activeConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      className="md:hidden p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsMobileViewingChat(false)}
                    >
                      <ChevronLeft className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    </button>
                    <div className="h-10 w-10 rounded-full overflow-hidden">
                      <img
                        src={
                          getImageUrl(
                            activeConversation.profileImage,
                            "/placeholder.svg?height=40&width=40"
                          ) ||
                          "/placeholder.svg" ||
                          "/placeholder.svg" ||
                          "/placeholder.svg"
                        }
                        alt={activeConversation.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {activeConversation.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {activeConversation.specialty
                          ? `${activeConversation.specialty} Photographer`
                          : "Photographer"}
                        {isTyping[activeConversation.id] && (
                          <span className="ml-2 text-purple-600 animate-pulse">
                            typing...
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
                      <Phone className="h-5 w-5" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
                      <Video className="h-5 w-5" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
                      <Info className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto">
                  {isLoadingMessages ? (
                    <div className="flex justify-center items-center h-full">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-solid border-purple-600 border-r-transparent"></div>
                    </div>
                  ) : messages.length > 0 ? (
                    <div className="space-y-4">
                      {messages.map((message, index) => {
                        const isOwnMessage = message.senderId === user.id;
                        return (
                          <div
                            key={message.id || index}
                            className={`flex ${
                              isOwnMessage ? "justify-end" : "justify-start"
                            }`}
                          >
                            <div className="flex gap-2 max-w-[80%]">
                              {!isOwnMessage && (
                                <div className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0 mt-1">
                                  <img
                                    src={
                                      getImageUrl(
                                        message.sender?.profileImage,
                                        "/placeholder.svg?height=32&width=32"
                                      ) || "/placeholder.svg"
                                    }
                                    alt={
                                      message.sender?.name ||
                                      activeConversation.name
                                    }
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              )}
                              <div>
                                <div
                                  className={`rounded-2xl px-4 py-2 ${
                                    isOwnMessage
                                      ? "bg-purple-600 text-white"
                                      : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                                  }`}
                                >
                                  {message.content}
                                </div>
                                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                  {dayjs(
                                    message.timestamp || message.createdAt
                                  ).format("h:mm A")}
                                  {isOwnMessage && (
                                    <span className="ml-2">
                                      {message.read ? (
                                        <span className="text-blue-500">
                                          ✓✓
                                        </span>
                                      ) : message.id
                                          ?.toString()
                                          .startsWith("temp-") ? (
                                        <span className="text-gray-400">
                                          sending...
                                        </span>
                                      ) : (
                                        <span className="text-gray-400">✓</span>
                                      )}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-3 mb-2">
                        <Send className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        No messages yet
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xs">
                        Send your first message to {activeConversation.name}
                      </p>
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-end gap-2">
                    <div className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus-within:border-purple-500 dark:focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/20">
                      <textarea
                        placeholder={`Message ${activeConversation.name}...`}
                        className="block w-full resize-none border-0 bg-transparent px-3 py-2 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none sm:text-sm"
                        rows={1}
                        value={messageText}
                        onChange={handleTyping}
                        onKeyDown={handleKeyPress}
                      />
                      <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 px-3 py-2">
                        <div className="flex gap-2">
                          <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
                            <ImageIcon className="h-5 w-5" />
                          </button>
                          <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
                            <Paperclip className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      className="rounded-full bg-purple-600 p-3 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-70"
                      onClick={handleSendMessage}
                      disabled={!messageText.trim()}
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-4 mb-3">
                  <Send className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Your Messages
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">
                  Select a conversation from the list to start chatting.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
