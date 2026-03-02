import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { registerSW } from "virtual:pwa-register";

// register service worker (via vite-plugin-pwa virtual module)
const updateSW = registerSW();

createRoot(document.getElementById("root")!).render(<App />);
