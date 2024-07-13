import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./routes/AppRouter";
import { ConfigProvider } from "antd";
import { customTheme } from "../antd.config.js";
import "./index.css";
import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
  onNeedRefresh() {},
  onOfflineReady() {},
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ConfigProvider theme={customTheme}>
      <AppRouter />
    </ConfigProvider>
  </React.StrictMode>
);
