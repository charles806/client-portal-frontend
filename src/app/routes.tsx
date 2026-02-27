import { createBrowserRouter, Navigate, replace } from "react-router";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Layout } from "./components/layout/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Projects } from "./pages/Projects";
import { ProjectDetail } from "./pages/ProjectDetail";
import { Timeline } from "./pages/Timeline";
import { Invoices } from "./pages/Invoices";
import { Settings } from "./pages/Settings";
import { SignInPage } from "./pages/SignIn";
import { SignUpPage } from "./pages/SignUp";
import { NotFound } from "./pages/NotFound";

function ProtectedLayout() {
  return (
    <>
    <SignedIn>
    <Layout />
    </SignedIn>
    < SignedOut >
    <Navigate to= "/sign-in" replace />
      </SignedOut>
      </>
  );
}

export const router = createBrowserRouter([
  {
    path: "/sign-in/*",
    Component: SignInPage,
  },
  {
    path: "/sign-up/*",
    Component: SignUpPage,
  },
  {
    path: "/",
    Component: ProtectedLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "projects", Component: Projects },
      { path: "projects/:id", Component: ProjectDetail },
      { path: "timeline", Component: Timeline },
      { path: "invoices", Component: Invoices },
      { path: "settings", Component: Settings },
      { path: "*", Component: NotFound },
    ],
  },
]);