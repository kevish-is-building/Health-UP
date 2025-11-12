import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { Toaster } from "sonner";
import "./index.css";
import Layout from "./Layout.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Layout />
        <Toaster 
          position="top-right" 
          richColors 
          closeButton
          duration={4000}
          toastOptions={{
            style: {
              fontSize: '14px',
            },
            className: 'toaster-custom',
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
