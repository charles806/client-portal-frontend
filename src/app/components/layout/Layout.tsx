import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";

export function Layout() {
  return (
    <div
      className="min-h-screen bg-gray-50 flex"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <Sidebar />
      <div className="flex-1 lg:ml-60 min-w-0">
        <Outlet />
      </div>
    </div>
  );
}
