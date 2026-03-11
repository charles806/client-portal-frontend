import { createBrowserRouter } from "react-router";
import { Root, ProtectedRoute, PublicRoute } from "./components/layout/Root";
import { OnboardingGuard } from "./components/OnboardingGuard";
import { AppLayout } from "./components/layout/AppLayout";
import { AuthOnlyRoute } from "./components/layout/Root";

// Pages
import LandingPage from "./pages/Landing";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import SetupAccount from "./pages/SetupAccount";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Timeline from "./pages/Timeline";
import Invoices from "./pages/Invoices";
import Settings from "./pages/Settings";
import WorkspaceSettings from "./pages/WorkspaceSettings";
import InvoiceDetail from "./pages/InvoiceDetail";
import CreateInvoice from "./pages/CreateInvoice";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      // Landing page - accessible to everyone
      {
        index: true,
        element: <LandingPage />
      },

      // Public routes (NOT logged in)
      {
        element: <PublicRoute />,
        children: [
          { path: "/signin", element: <SignIn /> },
          { path: "/signup", element: <SignUp /> },
          { path: "/forgot-password", element: <ForgotPassword /> },
          { path: "/reset-password", element: <ResetPassword /> },
        ],
      },

      // Email verification (accessible anytime)
      { path: "/verify-email", element: <VerifyEmail /> },

      // Auth-only routes (NO workspace check) - NEW SECTION!
      {
        element: <AuthOnlyRoute />,  // ← CHANGE THIS!
        children: [
          { path: "/setup-account", element: <SetupAccount /> },
          { path: "/onboarding", element: <Onboarding /> },  // ← NO workspace check!
        ],
      },

      // Protected routes (NEED auth AND workspace)
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <OnboardingGuard />,
            children: [
              {
                element: <AppLayout />,
                children: [
                  { path: "/dashboard", element: <Dashboard /> },
                  { path: "/projects", element: <Projects /> },
                  { path: "/projects/:id", element: <ProjectDetail /> },
                  { path: "/timeline", element: <Timeline /> },
                  { path: "/invoices", element: <Invoices /> },
                  { path: "/invoices/new", element: <CreateInvoice /> },
                  { path: "/invoices/:id", element: <InvoiceDetail /> },

                  { path: "/settings", element: <Settings /> },
                  { path: "/workspace-settings", element: <WorkspaceSettings /> },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]);