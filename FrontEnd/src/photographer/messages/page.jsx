import { useState, useEffect, useRef, useMemo } from "react";
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
import DashboardLayout from "../DashboardLayout";
import { useSelector } from "react-redux";
import { useSendMessageMutation } from "../../redux/api/messageApi";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useLocation } from "react-router-dom";
import {
  sendMessage,
  markMessagesAsRead,
  sendTypingIndicator,
} from "../../socketService";

// Extend dayjs with relative time plugin
dayjs.extend(relativeTime);

// Utility function to build full image URL
const getProfileImageUrl = (profileImage) => {
  return profileImage
    ? `http://localhost:3000${profileImage}`
    : "/placeholder.svg?height=64&width=64";
};

export default function PhotographerMessagesPage() {
  const [activeConversation, setActiveConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileViewingChat, setIsMobileViewingChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isTyping, setIsTyping] = useState({});
  const [typingTimeout, setTypingTimeout] = useState(null);
  const messagesEndRef = useRef(null);
  const location = useLocation();
  const initialLoadRef = useRef(true);
  const urlParamsProcessedRef = useRef(false);

  // Get the authenticated user
  const user = useSelector((state) => state.auth.user);

  // Mutation for sending messages
  const [sendMessageMutation, { isLoading: isSending }] =
    useSendMessageMutation();

  // =========================================================================
  // 1. Initialize Socket Event Listeners
  // =========================================================================
  useEffect(() => {
    const handleNewMessage = (event) => {
      const message = event.detail;
      if (
        activeConversation &&
        (message.senderId === activeConversation.id ||
          message.recipientId === activeConversation.id)
      ) {
        setMessages((prevMessages) => [...prevMessages, message]);
        if (message.senderId === activeConversation.id) {
          markMessagesAsRead(activeConversation.id);
        }
      }
      updateConversationWithMessage(message);
    };

    const handleMessageSent = (event) => {
      const message = event.detail;
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id?.toString().startsWith("temp-") &&
          msg.content === message.content
            ? message
            : msg
        )
      );
      updateConversationWithMessage(message);
    };

    const handleUserTyping = (event) => {
      const { userId, isTyping } = event.detail;
      setIsTyping((prev) => ({ ...prev, [userId]: isTyping }));
    };

    const getProfileImageUrl = (profileImage) => {
      return profileImage
        ? `http://localhost:3000${profileImage}`
        : "/placeholder.svg?height=64&width=64";
    };

    const handleMessagesRead = (event) => {
      const { by } = event.detail;
      if (activeConversation && by === activeConversation.id) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.senderId === user.id && !msg.read ? { ...msg, read: true } : msg
          )
        );
      }
    };

    window.addEventListener("new-message", handleNewMessage);
    window.addEventListener("message-sent", handleMessageSent);
    window.addEventListener("user-typing", handleUserTyping);
    window.addEventListener("messages-read", handleMessagesRead);

    return () => {
      window.removeEventListener("new-message", handleNewMessage);
      window.removeEventListener("message-sent", handleMessageSent);
      window.removeEventListener("user-typing", handleUserTyping);
      window.removeEventListener("messages-read", handleMessagesRead);
    };
  }, [activeConversation, user.id]);

  // Helper function to update the conversations list with a new message
  const updateConversationWithMessage = (message) => {
    const isIncoming = message.senderId !== user.id;
    const partnerId = isIncoming ? message.senderId : message.recipientId;

    setConversations((prevConversations) => {
      const existingConvIndex = prevConversations.findIndex(
        (conv) => conv.id === partnerId
      );
      if (existingConvIndex >= 0) {
        const updatedConversations = [...prevConversations];
        updatedConversations[existingConvIndex] = {
          ...updatedConversations[existingConvIndex],
          lastMessage: message.content,
          lastMessageTime: message.createdAt || new Date(),
          unread:
            isIncoming &&
            (!activeConversation || activeConversation.id !== partnerId)
              ? (updatedConversations[existingConvIndex].unread || 0) + 1
              : updatedConversations[existingConvIndex].unread || 0,
        };
        const [conversation] = updatedConversations.splice(
          existingConvIndex,
          1
        );
        return [conversation, ...updatedConversations];
      } else if (message.sender) {
        return [
          {
            id: partnerId,
            name: message.sender.name,
            image: getProfileImageUrl(message.sender.profileImage),
            lastMessage: message.content,
            lastMessageTime: message.createdAt || new Date(),
            unread: isIncoming ? 1 : 0,
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

    // Check for URL parameters
    const params = new URLSearchParams(location.search);
    const userId = params.get("userId");
    if (userId) {
      urlParamsProcessedRef.current = true;
      fetchUserDetails(userId);
    }
  }, [location.search]);

  // =========================================================================
  // 3. Filter Conversations Based on Search Term
  // =========================================================================
  const filteredConversations = useMemo(() => {
    return conversations.filter((conv) =>
      conv.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [conversations, searchTerm]);

  // =========================================================================
  // 4. Fetch All Conversations for this Photographer
  // =========================================================================
  const fetchConversations = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:3000/api/messages/conversations",
        { credentials: "include" }
      );
      if (response.ok) {
        const data = await response.json();
        const formattedConversations = (data.conversations || []).map(
          (conversation) => ({
            id: conversation.id,
            name: conversation.name || "Client",
            image: getProfileImageUrl(conversation.profileImage),
            lastMessage: conversation.lastMessage || "Click to start chatting",
            lastMessageTime: conversation.lastMessageTime || new Date(),
            unread: conversation.unreadCount || 0,
            bookingId: conversation.bookingId,
            bookingType: conversation.bookingType || "",
            bookingDate: conversation.bookingDate,
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
  // 5. Fetch User Details if in URL Parameter and get Client Profile Image
  // =========================================================================
  const fetchUserDetails = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/messages/conversations/${userId}`,
        { credentials: "include" }
      );
      if (response.ok) {
        const data = await response.json();
        const clientInfo = {
          id: userId,
          name: data.partner?.name || "Client",
          image: getProfileImageUrl(data.partner?.profileImage),
          lastMessage: "Click to start chatting",
          lastMessageTime: new Date().toISOString(),
          unread: 0,
          bookingType: data.partner?.bookingType || "",
          bookingDate: data.partner?.bookingDate,
        };
        setActiveConversation(clientInfo);
        setIsMobileViewingChat(true);
        setMessages(data.messages || []);
        localStorage.setItem(
          "photographer_active_conversation",
          JSON.stringify(clientInfo)
        );
        localStorage.setItem(
          `photographer_messages_${userId}`,
          JSON.stringify(data.messages || [])
        );
        setConversations((prevConversations) => {
          if (!prevConversations.some((c) => c.id === userId)) {
            return [...prevConversations, clientInfo];
          }
          return prevConversations;
        });
        markMessagesAsRead(userId);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  // =========================================================================
  // 6. Scroll to Bottom of Messages
  // =========================================================================
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // =========================================================================
  // 7. Load Saved Conversation on Initial Load
  // =========================================================================
  useEffect(() => {
    if (!urlParamsProcessedRef.current && initialLoadRef.current) {
      initialLoadRef.current = false;

      const savedConversation = localStorage.getItem(
        "photographer_active_conversation"
      );
      if (savedConversation) {
        try {
          const parsedConversation = JSON.parse(savedConversation);
          setActiveConversation(parsedConversation);
          setIsMobileViewingChat(true);

          const savedMessages = localStorage.getItem(
            `photographer_messages_${parsedConversation.id}`
          );
          if (savedMessages) {
            try {
              setMessages(JSON.parse(savedMessages));
            } catch (e) {
              console.error("Error parsing saved messages:", e);
            }
          }
        } catch (error) {
          console.error("Error parsing saved conversation:", error);
        }
      }
    }
  }, []);

  // =========================================================================
  // 8. Send a New Message
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
        `photographer_messages_${activeConversation.id}`,
        JSON.stringify(updatedMessages)
      );

      // Clear input
      setMessageText("");

      // Send via socket.io
      const socketSent = sendMessage(activeConversation.id, messageContent);

      // If socket fails, fall back to API
      if (!socketSent) {
        console.log("Socket send failed, using API fallback");
        await sendMessageMutation({
          recipientId: activeConversation.id,
          content: messageContent,
          messageType: "text",
        })
          .unwrap()
          .then((data) => {
            // Replace temp message with real one
            setMessages((prevMessages) =>
              prevMessages.map((msg) =>
                msg.id === tempMessage.id ? data.message : msg
              )
            );
          });
      }

      // Update the conversations list with latest message
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
  // 9. Handle typing indicator
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

  // =========================================================================
  // 10. Handle Enter Key to Send Message
  // =========================================================================
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // =========================================================================
  // 11. Select a Conversation
  // =========================================================================
  const selectConversation = (client) => {
    setActiveConversation(client);
    setIsMobileViewingChat(true);
    localStorage.setItem(
      "photographer_active_conversation",
      JSON.stringify(client)
    );

    // Mark messages as read if there are unread messages
    if (client.unread > 0) {
      markMessagesAsRead(client.id);
    }

    fetchMessagesForClient(client.id);
  };

  // =========================================================================
  // 12. Fetch Messages for Selected Client
  // =========================================================================
  const fetchMessagesForClient = async (clientId) => {
    setIsLoadingMessages(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/messages/conversations/${clientId}`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);

        // Store in localStorage
        localStorage.setItem(
          `photographer_messages_${clientId}`,
          JSON.stringify(data.messages || [])
        );

        // Mark as read via socket
        markMessagesAsRead(clientId);

        // Update unread count in conversations list
        setConversations((prevConversations) =>
          prevConversations.map((conv) =>
            conv.id === clientId ? { ...conv, unread: 0 } : conv
          )
        );
      }
    } catch (error) {
      console.error("Error fetching messages:", error);

      // Try to load from localStorage as fallback
      const savedMessages = localStorage.getItem(
        `photographer_messages_${clientId}`
      );
      if (savedMessages) {
        try {
          setMessages(JSON.parse(savedMessages));
        } catch (e) {
          console.error("Error parsing saved messages:", e);
        }
      }
    } finally {
      setIsLoadingMessages(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-16rem)]">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              Messages
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-300">
              Communicate with your clients
            </p>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex flex-1 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
          {/* Conversations List - Hidden on mobile when viewing a chat */}
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
                  className="pl-9 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                filteredConversations.map((client) => (
                  <div
                    key={client.id}
                    onClick={() => selectConversation(client)}
                    className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                      activeConversation?.id === client.id
                        ? "bg-purple-50 dark:bg-purple-900/20"
                        : ""
                    }`}
                  >
                    <div className="relative">
                      <div className="h-12 w-12 rounded-full overflow-hidden">
                        <img
                          src={client.image || "/placeholder.svg"}
                          alt={client.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      {client.unread > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-xs font-medium text-white">
                          {client.unread}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-gray-900 dark:text-white truncate">
                          {client.name}
                        </h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {dayjs(client.lastMessageTime).fromNow()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {client.lastMessage}
                        </p>
                        {client.bookingType && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                            {client.bookingType}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center p-4">
                  <div className="rounded-full bg-gray-100 dark:bg-gray-700 p-3 mb-2">
                    <Search className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    No conversations found
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {searchTerm
                      ? "Try a different search term"
                      : "You don't have any client messages yet"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Chat Area - Full width on mobile when viewing a chat */}
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
                        src={activeConversation.image || "/placeholder.svg"}
                        alt={activeConversation.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {activeConversation.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {activeConversation.bookingType && (
                          <>
                            Booking: {activeConversation.bookingType} •{" "}
                            {activeConversation.bookingDate &&
                              dayjs(activeConversation.bookingDate).format(
                                "MMM D, YYYY"
                              )}
                          </>
                        )}
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
                  {isLoadingMessages && messages.length === 0 ? (
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
                                      activeConversation.image ||
                                      "/placeholder.svg"
                                    }
                                    alt={activeConversation.name}
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
                        {activeConversation.bookingType && (
                          <>
                            {" "}
                            about their{" "}
                            {activeConversation.bookingType.toLowerCase()}{" "}
                            session
                          </>
                        )}
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
                      disabled={!messageText.trim() || isSending}
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
                  Select a conversation from the list to start chatting with
                  your clients about their photography sessions
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
