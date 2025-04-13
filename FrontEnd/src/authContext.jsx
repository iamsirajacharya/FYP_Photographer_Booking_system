import { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  initializeSocket,
  isSocketInitialized,
  waitForSocketInitialization,
} from "./socketService";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socketReady, setSocketReady] = useState(false);
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    // Initialize socket when user is authenticated
    if (token) {
      console.log("Initializing socket with token in SocketProvider");

      // First check if socket is already initialized
      if (isSocketInitialized()) {
        console.log("Socket already initialized");
        setSocketReady(true);
        return;
      }

      // Try to initialize socket
      const socketInstance = initializeSocket(token);

      // If we got a socket instance back, set up event listeners
      if (socketInstance) {
        // Check if socket is already connected
        if (socketInstance.connected) {
          console.log("Socket already connected");
          setSocketReady(true);
        } else {
          // Set up event listeners for connect/disconnect
          socketInstance.on("connect", () => {
            console.log("Socket connected in SocketProvider");
            setSocketReady(true);
          });

          socketInstance.on("disconnect", () => {
            console.log("Socket disconnected in SocketProvider");
            setSocketReady(false);
          });
        }

        // Clean up function
        return () => {
          if (socketInstance) {
            socketInstance.off("connect");
            socketInstance.off("disconnect");
          }
        };
      } else {
        // Socket initialization failed or is in progress
        // Wait for socket to be initialized
        waitForSocketInitialization().then((socket) => {
          if (socket) {
            console.log("Socket initialized after waiting");
            setSocketReady(true);
          } else {
            console.log("Socket initialization timed out");
            setSocketReady(false);
          }
        });
      }
    } else {
      setSocketReady(false);
    }
  }, [token]);

  return (
    <SocketContext.Provider value={{ socketReady }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
