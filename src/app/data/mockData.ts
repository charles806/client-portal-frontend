export type ProjectStatus = "active" | "completed" | "at-risk" | "on-hold" | "planning";

export interface Project {
  id: string;
  name: string;
  client: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  dueDate: string;
  team: { name: string; avatar: string }[];
  budget: string;
  spent: string;
  tags: string[];
}

export interface Milestone {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  description: string;
  date: string;
  status: "completed" | "in-progress" | "upcoming" | "overdue";
  assignee: string;
}

export interface Activity {
  id: string;
  user: string;
  avatar: string;
  action: string;
  target: string;
  time: string;
  type: "comment" | "update" | "upload" | "milestone" | "approval";
}

export interface Invoice {
  id: string;
  client: string;
  project: string;
  amount: string;
  status: "paid" | "pending" | "overdue" | "draft";
  dueDate: string;
  issuedDate: string;
}

export const projects: Project[] = [
  {
    id: "p1",
    name: "Enterprise CRM Redesign",
    client: "Meridian Financial",
    description: "Full redesign of the customer relationship management platform with modern UX and enhanced analytics.",
    status: "active",
    progress: 68,
    dueDate: "Mar 15, 2026",
    team: [
      { name: "Alex Chen", avatar: "AC" },
      { name: "Sara Kim", avatar: "SK" },
      { name: "Mike Ross", avatar: "MR" },
    ],
    budget: "$142,000",
    spent: "$96,560",
    tags: ["UX Design", "Development"],
  },
  {
    id: "p2",
    name: "Supply Chain Analytics Platform",
    client: "GlobalTrade Corp",
    description: "Building a real-time analytics dashboard to optimize supply chain operations and vendor management.",
    status: "active",
    progress: 42,
    dueDate: "Apr 30, 2026",
    team: [
      { name: "Jordan Lee", avatar: "JL" },
      { name: "Nina Patel", avatar: "NP" },
    ],
    budget: "$89,500",
    spent: "$37,590",
    tags: ["Data", "Analytics"],
  },
  {
    id: "p3",
    name: "HR Portal Migration",
    client: "Vertex Solutions",
    description: "Cloud migration of legacy HR systems to a modern SaaS platform with SSO and advanced reporting.",
    status: "at-risk",
    progress: 31,
    dueDate: "Feb 28, 2026",
    team: [
      { name: "Tom Grant", avatar: "TG" },
      { name: "Lisa Wong", avatar: "LW" },
      { name: "Ben Davis", avatar: "BD" },
    ],
    budget: "$67,000",
    spent: "$52,770",
    tags: ["Migration", "Cloud"],
  },
  {
    id: "p4",
    name: "Customer Loyalty App",
    client: "RetailMax Group",
    description: "Native mobile app for customer loyalty program with personalized rewards and push notifications.",
    status: "completed",
    progress: 100,
    dueDate: "Jan 20, 2026",
    team: [
      { name: "Chloe Adams", avatar: "CA" },
      { name: "Ryan Wu", avatar: "RW" },
    ],
    budget: "$54,000",
    spent: "$51,840",
    tags: ["Mobile", "iOS", "Android"],
  },
  {
    id: "p5",
    name: "Security Compliance Audit",
    client: "FinBank International",
    description: "Comprehensive SOC 2 Type II compliance audit and penetration testing across all infrastructure.",
    status: "on-hold",
    progress: 55,
    dueDate: "May 10, 2026",
    team: [
      { name: "Derek Hall", avatar: "DH" },
    ],
    budget: "$38,000",
    spent: "$20,900",
    tags: ["Security", "Compliance"],
  },
  {
    id: "p6",
    name: "AI-Powered Chatbot Integration",
    client: "TechNova Inc.",
    description: "Integration of LLM-based conversational AI into existing support platform to reduce ticket volume.",
    status: "planning",
    progress: 12,
    dueDate: "Jun 30, 2026",
    team: [
      { name: "Priya Sharma", avatar: "PS" },
      { name: "Leo Martinez", avatar: "LM" },
    ],
    budget: "$112,000",
    spent: "$13,440",
    tags: ["AI", "Integration"],
  },
];

export const milestones: Milestone[] = [
  {
    id: "m1",
    projectId: "p1",
    projectName: "Enterprise CRM Redesign",
    title: "Design System Approved",
    description: "Client sign-off on component library and brand guidelines",
    date: "Jan 8, 2026",
    status: "completed",
    assignee: "Alex Chen",
  },
  {
    id: "m2",
    projectId: "p1",
    projectName: "Enterprise CRM Redesign",
    title: "Backend API v1 Complete",
    description: "Core REST API endpoints for user management and data layer",
    date: "Feb 5, 2026",
    status: "completed",
    assignee: "Mike Ross",
  },
  {
    id: "m3",
    projectId: "p2",
    projectName: "Supply Chain Analytics Platform",
    title: "Data Pipeline Setup",
    description: "ETL pipeline configured for real-time inventory data ingestion",
    date: "Feb 20, 2026",
    status: "completed",
    assignee: "Jordan Lee",
  },
  {
    id: "m4",
    projectId: "p3",
    projectName: "HR Portal Migration",
    title: "Legacy Data Migration",
    description: "Migration of 5 years of employee records to new cloud schema",
    date: "Feb 14, 2026",
    status: "overdue",
    assignee: "Tom Grant",
  },
  {
    id: "m5",
    projectId: "p1",
    projectName: "Enterprise CRM Redesign",
    title: "Beta Testing Launch",
    description: "Internal QA and select client user testing phase",
    date: "Mar 1, 2026",
    status: "in-progress",
    assignee: "Sara Kim",
  },
  {
    id: "m6",
    projectId: "p2",
    projectName: "Supply Chain Analytics Platform",
    title: "Dashboard MVP Release",
    description: "First working version of analytics dashboard for client review",
    date: "Mar 10, 2026",
    status: "upcoming",
    assignee: "Nina Patel",
  },
  {
    id: "m7",
    projectId: "p6",
    projectName: "AI-Powered Chatbot Integration",
    title: "Requirements Sign-off",
    description: "Finalize functional and technical specifications with stakeholders",
    date: "Mar 5, 2026",
    status: "in-progress",
    assignee: "Priya Sharma",
  },
  {
    id: "m8",
    projectId: "p1",
    projectName: "Enterprise CRM Redesign",
    title: "Production Launch",
    description: "Full production deployment with monitoring and rollback plan",
    date: "Mar 15, 2026",
    status: "upcoming",
    assignee: "Alex Chen",
  },
  {
    id: "m9",
    projectId: "p2",
    projectName: "Supply Chain Analytics Platform",
    title: "User Training & Handoff",
    description: "Training sessions for client team and documentation delivery",
    date: "Apr 25, 2026",
    status: "upcoming",
    assignee: "Jordan Lee",
  },
];

export const activities: Activity[] = [
  {
    id: "a1",
    user: "Alex Chen",
    avatar: "AC",
    action: "approved the",
    target: "Design System v2 assets",
    time: "2 hours ago",
    type: "approval",
  },
  {
    id: "a2",
    user: "Nina Patel",
    avatar: "NP",
    action: "uploaded",
    target: "Q1 analytics report.pdf",
    time: "4 hours ago",
    type: "upload",
  },
  {
    id: "a3",
    user: "Tom Grant",
    avatar: "TG",
    action: "commented on",
    target: "HR Portal migration timeline",
    time: "6 hours ago",
    type: "comment",
  },
  {
    id: "a4",
    user: "Sara Kim",
    avatar: "SK",
    action: "completed milestone",
    target: "Beta Testing Launch",
    time: "Yesterday",
    type: "milestone",
  },
  {
    id: "a5",
    user: "Jordan Lee",
    avatar: "JL",
    action: "updated status of",
    target: "Supply Chain Analytics Platform",
    time: "Yesterday",
    type: "update",
  },
  {
    id: "a6",
    user: "Priya Sharma",
    avatar: "PS",
    action: "requested review for",
    target: "AI Chatbot scope document",
    time: "2 days ago",
    type: "approval",
  },
];

export const invoices: Invoice[] = [
  {
    id: "INV-2026-041",
    client: "Meridian Financial",
    project: "Enterprise CRM Redesign",
    amount: "$24,500.00",
    status: "paid",
    dueDate: "Feb 1, 2026",
    issuedDate: "Jan 15, 2026",
  },
  {
    id: "INV-2026-042",
    client: "GlobalTrade Corp",
    project: "Supply Chain Analytics Platform",
    amount: "$18,750.00",
    status: "pending",
    dueDate: "Mar 5, 2026",
    issuedDate: "Feb 20, 2026",
  },
  {
    id: "INV-2026-043",
    client: "Vertex Solutions",
    project: "HR Portal Migration",
    amount: "$9,200.00",
    status: "overdue",
    dueDate: "Feb 15, 2026",
    issuedDate: "Feb 1, 2026",
  },
  {
    id: "INV-2026-044",
    client: "RetailMax Group",
    project: "Customer Loyalty App",
    amount: "$15,000.00",
    status: "paid",
    dueDate: "Jan 30, 2026",
    issuedDate: "Jan 15, 2026",
  },
  {
    id: "INV-2026-045",
    client: "TechNova Inc.",
    project: "AI-Powered Chatbot Integration",
    amount: "$12,000.00",
    status: "draft",
    dueDate: "Mar 30, 2026",
    issuedDate: "Feb 24, 2026",
  },
  {
    id: "INV-2026-046",
    client: "FinBank International",
    project: "Security Compliance Audit",
    amount: "$8,500.00",
    status: "pending",
    dueDate: "Mar 10, 2026",
    issuedDate: "Feb 24, 2026",
  },
];

export const stats = {
  totalRevenue: "$502,500",
  revenueGrowth: "+18.2%",
  activeProjects: 4,
  projectsGrowth: "+2",
  pendingInvoices: "$36,450",
  invoiceCount: 3,
  clientSatisfaction: "97%",
  satisfactionChange: "+2.1%",
};
