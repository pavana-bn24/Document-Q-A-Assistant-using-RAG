import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { SourceProvider } from "./context/SourceContext";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <SourceProvider>
      <App />
    </SourceProvider>
  </React.StrictMode>
);