import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

//Wrappers
import { RedirectIfAuthenticated } from "./RedirectIfAuthenticated";
import { ProtectedRoute } from "./ProtectedRoute";
import PanelWrapper from "../components/PanelWrapper";

// Pages
import Home from "../pages";
import Login from "../pages/login";
import Signup from "../pages/signup";
import Dashboard from "../pages/dashboard";
import Profile from "../pages/profile";
import Transactions from "../pages/transactions";
import Accounts from "../pages/accounts";
import Categories from "../pages/categories";
import Settings from "../pages/settings";
import PageNotFound from "../pages/PageNotFound";

const routes = [
  { path: "/", element: <Home /> },
  {
    path: "/signup",
    element: (
      <RedirectIfAuthenticated>
        <Signup />
      </RedirectIfAuthenticated>
    ),
    isProtected: false,
  },
  {
    path: "/login",
    element: (
      <RedirectIfAuthenticated>
        <Login />
      </RedirectIfAuthenticated>
    ),
    isProtected: false,
  },
  {
    path: "/dashboard",
    element: (
      <PanelWrapper>
        <Dashboard />
      </PanelWrapper>
    ),
    isProtected: true,
  },
  {
    path: "/profile",
    element: (
      <PanelWrapper>
        <Profile />
      </PanelWrapper>
    ),
    isProtected: true,
  },
  {
    path: "/transactions",
    element: (
      <PanelWrapper>
        <Transactions />
      </PanelWrapper>
    ),
    isProtected: true,
  },
  {
    path: "/accounts",
    element: (
      <PanelWrapper>
        {" "}
        <Accounts />
      </PanelWrapper>
    ),
    isProtected: true,
  },
  {
    path: "/categories",
    element: (
      <PanelWrapper>
        <Categories />
      </PanelWrapper>
    ),
    isProtected: true,
  },
  {
    path: "/settings",
    element: (
      <PanelWrapper>
        <Settings />
      </PanelWrapper>
    ),
  },
];

const AppRouter = () => (
  <>
    <Toaster />
    <Router>
      <Routes>
        {routes.map(({ path, element, isProtected }) => (
          <Route
            key={path}
            path={path}
            element={
              isProtected ? <ProtectedRoute>{element}</ProtectedRoute> : element
            }
          />
        ))}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  </>
);

export default AppRouter;
