import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { CurrencyProvider } from "@/features/phase2/currency/CurrencyContext";

createRoot(document.getElementById("root")!).render(
  <CurrencyProvider>
    <App />
  </CurrencyProvider>
);
