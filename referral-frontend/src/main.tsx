import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import { AdminPanel } from "./pages/AdminPanel";
import BusinessDashboard from "./pages/BusinessDashboard";
import ReferralTracking from "./pages/ReferralTracking";
import Register from "./pages/Register";
import Campaigns from "./pages/Campaigns";
const appRouter = createBrowserRouter([
  { path: "/", element: <Dashboard /> },
  { path: "/register", element: <Register /> },
  { path: "/login", element: <Login /> },
  { path: "/admin", element: <AdminPanel /> },
  {
    path: "/Business-Panel",
    element: <BusinessDashboard />,
  },
  { path: "/referral-tracking", element: <ReferralTracking /> },
  { path: "/campaigns", element: <Campaigns /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={appRouter}></RouterProvider>
    </AuthProvider>
  </StrictMode>
);
