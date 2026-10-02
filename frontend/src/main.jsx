import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";
import "./styles.css";
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3500,
          style: { fontFamily: "inherit", borderRadius: "12px" },
        }}
      />
    </AuthProvider>
  </BrowserRouter>,
);
