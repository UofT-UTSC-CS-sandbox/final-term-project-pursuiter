import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { UserProvider } from "./contexts/UserContext";
import "./index.css";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <UserProvider>
    <App />
  </UserProvider>,
);
