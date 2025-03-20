import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";

console.log("Mounting App component"); // Log per debug

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("Root element not found!"); // Log per debug
} else {
  console.log("Root element found:", rootElement); // Log per debug
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  rootElement
);
