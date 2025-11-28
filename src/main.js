"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("react-dom/client");
var react_1 = require("react");
var App_tsx_1 = require("./App.tsx");
require("./index.css");
// Create root and render App component
(0, client_1.createRoot)(document.getElementById("root")).render(<react_1.default.StrictMode>
    <App_tsx_1.default />
  </react_1.default.StrictMode>);
