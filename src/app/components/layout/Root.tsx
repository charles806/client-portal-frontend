import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";

export function Root() {
  return (
    <div
      className="flex min-h-screen"
      style={{ backgroundColor: "#F9FAFB", fontFamily: "Inter, sans-serif" }}
    >
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}
