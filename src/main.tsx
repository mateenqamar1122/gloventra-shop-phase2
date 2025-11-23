import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { CurrencyProvider } from "@/features/phase2/currency/CurrencyContext";
import { UserProvider } from "@/context/UserContext";

createRoot(document.getElementById("root")!).render(
  <CurrencyProvider>
    <UserProvider>
      <App />
    </UserProvider>
  </CurrencyProvider>
);
