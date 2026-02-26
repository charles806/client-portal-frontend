import { createBrowserRouter } from "react-router";
import { Layout } from "./components/layout/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Projects } from "./pages/Projects";
import { ProjectDetail } from "./pages/ProjectDetail";
import { Timeline } from "./pages/Timeline";
import { Invoices } from "./pages/Invoices";
import { Settings } from "./pages/Settings";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
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