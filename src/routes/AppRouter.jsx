import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RedirectIfAuthenticated } from "./RedirectIfAuthenticated";
import { ProtectedRoute } from "./ProtectedRoute";

// Pages
import Home from "../pages";
import Login from "../pages/login";
import Signup from "../pages/signup";
import Dashboard from "../pages/dashboard";
import Profile from "../pages/profile";
import Transactions from "../pages/transactions";
import Accounts from "../pages/accounts";
import Categories from "../pages/categories";
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
  { path: "/dashboard", element: <Dashboard />, isProtected: true },
  { path: "/profile", element: <Profile />, isProtected: true },
  { path: "/transactions", element: <Transactions />, isProtected: true },
  { path: "/accounts", element: <Accounts />, isProtected: true },
  { path: "/categories", element: <Categories />, isProtected: true },
];

const AppRouter = () => (
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
);

export default AppRouter;
