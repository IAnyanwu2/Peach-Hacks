import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

document.title = "Chess Game";

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(<App />);
}