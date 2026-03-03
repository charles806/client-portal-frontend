import { createBrowserRouter } from 'react-router';
import { Root, ProtectedRoute, PublicRoute } from './components/layout/Root';
import { Layout } from './components/layout/Layout';
import Landing from './pages/Landing';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Timeline from './pages/Timeline';
import Invoices from './pages/Invoices';
import Settings from './pages/Settings';
import WorkspaceSettings from './pages/WorkspaceSettings';
import ApiTest from './pages/ApiTest';
import NotFound from './pages/NotFound';
import SSOCallback from './pages/SSOCallback';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      // Public routes (redirect to dashboard if logged in)
      {
        Component: PublicRoute,
        children: [
          { index: true, Component: Landing },
          { path: 'signin', Component: SignIn },
          { path: 'signup', Component: SignUp },
          { path: 'sso-callback', Component: SSOCallback },
        ],
      },

      // Onboarding (auth required, not yet onboarded)
      { path: 'onboarding', Component: Onboarding },

      // Protected routes (auth + onboarding complete)
      {
        Component: ProtectedRoute,
        children: [
          {
            Component: Layout,
            children: [
              { path: 'dashboard', Component: Dashboard },
              { path: 'projects', Component: Projects },
              { path: 'projects/:id', Component: ProjectDetail },
              { path: 'timeline', Component: Timeline },
              { path: 'invoices', Component: Invoices },
              { path: 'settings', Component: Settings },
              { path: 'workspace', Component: WorkspaceSettings },
              { path: 'api-test', Component: ApiTest },
            ],
          },
        ],
      },

      // 404
      { path: '*', Component: NotFound },
    ],
  },
]);