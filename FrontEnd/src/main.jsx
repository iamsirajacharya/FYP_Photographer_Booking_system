import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "./redux/store.js";
import { SocketProvider } from "./authContext.jsx";
import { initializeSocket } from "./socketService.js";
import { useSelector } from "react-redux";

// Create a component to initialize socket early
const SocketInitializer = () => {
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      console.log("Pre-initializing socket in App component");

      // Initialize socket and wait for it to connect
      const socketInstance = initializeSocket(token);

      if (!socketInstance) {
        console.log("Socket initialization failed or in progress, waiting...");
        waitForSocketInitialization().then((socket) => {
          if (socket) {
            console.log("Socket initialized successfully after waiting");
          } else {
            console.log("Socket initialization timed out");
          }
        });
      }
    }
  }, [token]);

  return null;
};

createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <BrowserRouter>
    <Provider store={store}>
      {" "}
      <SocketInitializer />
      <SocketProvider>
        <App />
      </SocketProvider>
    </Provider>
  </BrowserRouter>
  // </React.StrictMode>
);
