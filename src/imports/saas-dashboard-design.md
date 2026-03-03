Task: Design a professional B2B SaaS client portal dashboard UI with the following specifications.

Project Context: The web application currently consists of the following structure (completely excluding purely generic UI components):

Pages (src/app/pages/):

ApiTest.tsx

Dashboard.tsx

Invoices.tsx

NotFound.tsx

Onboarding.tsx

ProjectDetail.tsx

Projects.tsx

Settings.tsx

SignIn.tsx

SignUp.tsx

Timeline.tsx

WorkspaceSettings.tsx

Components (src/app/components/):

OnboardingGuard.tsx

dashboard/ProjectCard.tsx

dashboard/StatsCard.tsx

dashboard/StatusBadge.tsx

layout/Header.tsx

layout/Layout.tsx

layout/Root.tsx

layout/Sidebar.tsx

modals/AddProjectModal.tsx

modals/EditProjectModal.tsx

figma/ImageWithFallback.tsx

Backend Integration & State Management (src/app/):

services/api.ts

services/projectService.ts

hooks/useProjects.ts

hooks/useWorkspaces.ts

store/projectStore.ts

store/themeStore.ts

store/workspaceStore.ts

Visual Style

Strict glassmorphism for cards, buttons, and interactive elements.

Minimalist layout with generous white space.

Card-based interface with subtle shadows and soft, translucent borders.

Professional and enterprise-focused tone (not consumer-style).

High visual clarity, hierarchy, and scannability.

Brand & Color System

Primary brand color: Indigo #4F46E5

Hover state: #6366F1

Active state: #4338CA

Neutral UI Colors:

Background: Gray 50 (#F9FAFB)

Primary text: Gray 900 (#111827)

Status Colors:

Success: #10B981

Warning: #F59E0B

Error: #EF4444

Info: #3B82F6

Typography

Font family: Inter

Headings: 600–700 weight

Body text: 400 weight

Core UI Components

Dashboard with project cards:

Each card shows: project name, progress bar, and status badge.

Glassmorphic design.

Timeline view with milestones and completion states.

Clear call-to-action buttons.

Loading and empty states.

All clickable elements should use cursor:pointer, hover states, and active states.

Design Principles

Clean, minimal, and professional B2B tone.

Clear visual hierarchy.

Easy to scan and understand.

Feedback-driven interactions (hover effects, active states, loading indicators).

Style References: Linear, Notion, Vercel Dashboard.

Output:

High-fidelity UI layout suitable for SaaS implementation.

Use real data from the backend (not dummy data). The pages and hooks to connect to the backend are provided in the Project Context section.

Include pages that connect to the backend (workspace, projects, users, settings, etc.).

Additional Requirements

Landing Page:

Create a dummy landing page that connects to the main dashboard after sign-up/sign-in.

Include space for a pricing section where users must choose and pay for one of three plans before accessing the dashboard.

Ensure smooth transition from landing → signup → payment → dashboard.

Interactive Details:

All buttons, cards, and clickable elements should have glassmorphism styling and proper hover/cursor feedback.

Maintain visual consistency across the dashboard and landing page.

✅ Goal: Deliver a clean, modern, and professional B2B SaaS portal with real backend integration, fully interactive glassmorphic components, and an onboarding/payment flow from landing page to dashboard.