import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import PracticeRoomPage from "../pages/PracticeRoomPage";
import ResultsPage from "../pages/ResultsPage";
import AdminPage from "../pages/AdminPage";
import TipsTricksPage from "../pages/TipsTricksPage";
import AppShell from "../components/AppShell";
import {
  RequireAuth,
  RequireAdmin,
  RedirectIfAuthenticated,
} from "./utils/requireAuth";

const router = createBrowserRouter([
  /* ================= PUBLIC (AUTH REDIRECT) ================= */
  {
    element: <RedirectIfAuthenticated />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/", element: <Navigate to="/login" replace /> },
    ],
  },

  /* ================= AUTHENTICATED USERS (WITH PWA SHELL) ================= */
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/practice", element: <PracticeRoomPage /> },
          { path: "/results", element: <ResultsPage /> },
          { path: "/tips-trik", element: <TipsTricksPage /> },

          /* ================= ADMIN ONLY ================= */
          {
            element: <RequireAdmin />,
            children: [{ path: "/admin", element: <AdminPage /> }],
          },
        ],
      },
    ],
  },

  /* ================= 404 CATCH-ALL ================= */
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
]);

export default router;
