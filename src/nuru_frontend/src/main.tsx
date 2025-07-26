import React from "react"
import ReactDOM from "react-dom/client"
import { App } from "./App.tsx" // We will create this App.tsx
import "./globals.css" // Your global CSS

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
