import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./routes/AppRouter";
import { ConfigProvider } from "antd";
import { customTheme } from "../antd.config.js";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ConfigProvider theme={customTheme}>
      <AppRouter />
    </ConfigProvider>
  </React.StrictMode>
);
