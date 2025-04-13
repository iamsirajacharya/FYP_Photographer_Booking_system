// socket-service.js
import { io } from "socket.io-client";
import { store } from "../src/redux/store";
import { incrementUnreadCount } from "../src/redux/slices/mesageSlice";

// Global socket instance
let socket = null;
let socketInitialized = false;
let socketInitializing = false;
let initCallbacks = [];

export const initializeSocket = (token) => {
  // If already initialized, return the existing socket
  if (socketInitialized && socket) {
    return socket;
  }

  // If initialization is in progress, don't start another one
  if (socketInitializing) {
    return null; // Return null instead of a promise to avoid the .on error
  }

  socketInitializing = true;

  try {
    // Create socket connection
    console.log("Initializing socket connection with token");
    socket = io("http://localhost:3000", {
      auth: { token },
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Connection events
    socket.on("connect", () => {
      console.log("Socket connected successfully");
      socketInitialized = true;
      socketInitializing = false;

      // Resolve any pending callbacks
      initCallbacks.forEach((callback) => callback(socket));
      initCallbacks = [];
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      socketInitializing = false;
      socketInitialized = false;

      // Reject any pending callbacks
      initCallbacks.forEach((callback) => callback(null));
      initCallbacks = [];
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      socketInitialized = false;
    });

    // Message events
    socket.on("receive_message", (message) => {
      console.log("New message received:", message);

      // Dispatch to Redux to increment unread count
      store.dispatch(incrementUnreadCount());

      // Trigger custom event that components can listen for
      const event = new CustomEvent("new-message", { detail: message });
      window.dispatchEvent(event);
    });

    socket.on("message_sent", (message) => {
      console.log("Message sent confirmation:", message);

      // Trigger custom event for sent message confirmation
      const event = new CustomEvent("message-sent", { detail: message });
      window.dispatchEvent(event);
    });

    socket.on("user_typing", (data) => {
      console.log("User typing:", data);

      // Trigger custom event for typing indicator
      const event = new CustomEvent("user-typing", { detail: data });
      window.dispatchEvent(event);
    });

    socket.on("messages_read", (data) => {
      console.log("Messages read by:", data);

      // Trigger custom event for read receipts
      const event = new CustomEvent("messages-read", { detail: data });
      window.dispatchEvent(event);
    });

    return socket;
  } catch (error) {
    console.error("Error initializing socket:", error);
    socketInitializing = false;
    socketInitialized = false;
    return null;
  }
};

export const getSocket = () => {
  if (!socket || !socketInitialized) {
    console.warn(
      "Socket not initialized or not connected. Call initializeSocket first."
    );
    return null;
  }
  return socket;
};

export const sendMessage = (recipientId, content) => {
  if (!socket || !socketInitialized) {
    console.warn(
      "Socket not initialized or not connected. Cannot send message."
    );
    return false;
  }

  try {
    console.log(`Sending message to ${recipientId}: ${content}`);
    socket.emit("send_message", { recipientId, content });
    return true;
  } catch (error) {
    console.error("Error sending message via socket:", error);
    return false;
  }
};

export const markMessagesAsRead = (conversationId) => {
  if (!socket || !socketInitialized) {
    console.warn(
      "Socket not initialized or not connected. Cannot mark messages as read."
    );
    return false;
  }

  try {
    socket.emit("mark_read", { conversationId });
    return true;
  } catch (error) {
    console.error("Error marking messages as read via socket:", error);
    return false;
  }
};

export const sendTypingIndicator = (recipientId, isTyping) => {
  if (!socket || !socketInitialized) {
    console.warn(
      "Socket not initialized or not connected. Cannot send typing indicator."
    );
    return false;
  }

  try {
    socket.emit("typing", { recipientId, isTyping });
    return true;
  } catch (error) {
    console.error("Error sending typing indicator via socket:", error);
    return false;
  }
};

// Check if socket is initialized
export const isSocketInitialized = () => {
  return socketInitialized && socket !== null;
};

// Wait for socket to be initialized
export const waitForSocketInitialization = (timeout = 5000) => {
  return new Promise((resolve) => {
    if (socketInitialized && socket) {
      resolve(socket);
      return;
    }

    const checkInterval = 100; // Check every 100ms
    let elapsed = 0;

    const intervalId = setInterval(() => {
      elapsed += checkInterval;

      if (socketInitialized && socket) {
        clearInterval(intervalId);
        resolve(socket);
      } else if (elapsed >= timeout) {
        clearInterval(intervalId);
        resolve(null); // Timeout reached
      }
    }, checkInterval);

    // Add to callbacks to be notified when socket is initialized
    initCallbacks.push((s) => {
      clearInterval(intervalId);
      resolve(s);
    });
  });
};
