import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./lib/i18n";
import { initializeTheme } from "./stores/themeStore";
import { AuthProvider } from "./hooks/useAuth";

// Initialize theme before render
initializeTheme();

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
