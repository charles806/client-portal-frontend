import { useState } from "react";
import {
  Download,
  Search,
  FileText,
  Send,
  MoreHorizontal,
  Plus,
  ChevronDown,
} from "lucide-react";
import { Header } from "../components/layout/Header";
import { StatusBadge } from "../components/ui/StatusBadge";
import { invoices } from "../data/mockData";

export function Invoices() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = invoices.filter((inv) => {
    const matchStatus = statusFilter === "all" || inv.status === statusFilter;
    const matchSearch =
      search === "" ||
      inv.client.toLowerCase().includes(search.toLowerCase()) ||
      inv.id.toLowerCase().includes(search.toLowerCase()) ||
      inv.project.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalRevenue = invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + parseFloat(i.amount.replace(/[$,]/g, "")), 0);

  const totalPending = invoices
    .filter((i) => i.status === "pending" || i.status === "overdue")
    .reduce((sum, i) => sum + parseFloat(i.amount.replace(/[$,]/g, "")), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Invoices"
        subtitle={`${invoices.length} invoices`}
        actions={
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors shadow-sm">
            <Plus size={14} />
            <span style={{ fontSize: "13px", fontWeight: 500 }}>
              New Invoice
            </span>
          </button>
        }
      />

      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Total Collected",
              value: `$${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
              color: "text-emerald-600",
              bg: "bg-emerald-50",
              count: `${invoices.filter((i) => i.status === "paid").length} invoices`,
            },
            {
              label: "Outstanding",
              value: `$${totalPending.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
              color: "text-amber-600",
              bg: "bg-amber-50",
              count: `${invoices.filter((i) => i.status === "pending").length} pending`,
            },
            {
              label: "Overdue",
              value: `$${invoices
                .filter((i) => i.status === "overdue")
                .reduce(
                  (s, i) => s + parseFloat(i.amount.replace(/[$,]/g, "")),
                  0,
                )
                .toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
              color: "text-red-600",
              bg: "bg-red-50",
              count: `${invoices.filter((i) => i.status === "overdue").length} overdue`,
            },
            {
              label: "Drafts",
              value: `${invoices.filter((i) => i.status === "draft").length}`,
              color: "text-gray-600",
              bg: "bg-gray-100",
              count: "ready to send",
            },
          ].map((card) => (
            <div
              key={card.label}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-5"
            >
              <p
                className="text-gray-500 mb-2"
                style={{ fontSize: "12px", fontWeight: 500 }}
              >
                {card.label}
              </p>
              <p
                className={`${card.color} mb-1`}
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                }}
              >
                {card.value}
              </p>
              <p className="text-gray-400" style={{ fontSize: "11.5px" }}>
                {card.count}
              </p>
            </div>
          ))}
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg p-1 overflow-x-auto">
            {["all", "paid", "pending", "overdue", "draft"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-md transition-all duration-150 capitalize whitespace-nowrap ${
                  statusFilter === s
                    ? "bg-indigo-600 text-white"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
                style={{ fontSize: "12.5px", fontWeight: 500 }}
              >
                {s === "all"
                  ? "All Invoices"
                  : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:flex-none">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search invoices..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-white border border-gray-200 rounded-lg pl-8 pr-4 py-1.5 text-gray-700 placeholder-gray-400 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-50 transition-all w-full md:w-auto"
                style={{ fontSize: "13px" }}
              />
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-gray-700 transition-colors whitespace-nowrap cursor-pointer">
              <Download size={13} />
              <span
                className="hidden sm:inline"
                style={{ fontSize: "12.5px", fontWeight: 500 }}
              >
                Export
              </span>
            </button>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="hidden md:block bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Table Header */}
          <div
            className="grid px-5 py-3 bg-gray-50 border-b border-gray-100"
            style={{ gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr 1fr auto" }}
          >
            {[
              "Invoice",
              "Client / Project",
              "Amount",
              "Status",
              "Issued",
              "Due Date",
              "",
            ].map((h) => (
              <div key={h} className="flex items-center gap-1">
                <span
                  className="text-gray-400 uppercase tracking-wider"
                  style={{ fontSize: "11px", fontWeight: 600 }}
                >
                  {h}
                </span>
                {h && h !== "" && (
                  <ChevronDown size={10} className="text-gray-300" />
                )}
              </div>
            ))}
          </div>

          {/* Rows */}
          {filtered.map((invoice, i) => (
            <div
              key={invoice.id}
              className={`grid px-5 py-4 items-center hover:bg-gray-50 transition-colors cursor-pointer ${
                i < filtered.length - 1 ? "border-b border-gray-50" : ""
              }`}
              style={{ gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr 1fr auto" }}
            >
              {/* Invoice ID */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                  <FileText size={13} className="text-gray-400" />
                </div>
                <div className="min-w-0">
                  <p
                    className="text-gray-900 truncate"
                    style={{ fontSize: "13px", fontWeight: 600 }}
                  >
                    {invoice.id}
                  </p>
                </div>
              </div>

              {/* Client / Project */}
              <div className="min-w-0 pr-2">
                <p
                  className="text-gray-900 truncate"
                  style={{ fontSize: "12.5px", fontWeight: 500 }}
                >
                  {invoice.client}
                </p>
                <p
                  className="text-gray-400 truncate mt-0.5"
                  style={{ fontSize: "11.5px" }}
                >
                  {invoice.project}
                </p>
              </div>

              {/* Amount */}
              <div>
                <span
                  className="text-gray-900"
                  style={{ fontSize: "13px", fontWeight: 700 }}
                >
                  {invoice.amount}
                </span>
              </div>

              {/* Status */}
              <div>
                <StatusBadge status={invoice.status as any} />
              </div>

              {/* Issued */}
              <div>
                <span className="text-gray-500" style={{ fontSize: "12px" }}>
                  {invoice.issuedDate}
                </span>
              </div>

              {/* Due Date */}
              <div>
                <span
                  className={
                    invoice.status === "overdue"
                      ? "text-red-600"
                      : "text-gray-500"
                  }
                  style={{
                    fontSize: "12px",
                    fontWeight: invoice.status === "overdue" ? 600 : 400,
                  }}
                >
                  {invoice.dueDate}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5">
                {invoice.status === "draft" && (
                  <button
                    className="p-1.5 rounded-md hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition-colors cursor-pointer"
                    title="Send"
                  >
                    <Send size={13} />
                  </button>
                )}
                {invoice.status !== "draft" && (
                  <button
                    className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    title="Download"
                  >
                    <Download size={13} />
                  </button>
                )}
                <button className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                  <MoreHorizontal size={13} />
                </button>
              </div>
            </div>
          ))}

          {/* Empty */}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <FileText size={24} className="text-gray-300 mb-3" />
              <p
                className="text-gray-500"
                style={{ fontSize: "13.5px", fontWeight: 500 }}
              >
                No invoices found
              </p>
            </div>
          )}
        </div>

        {/* Invoices Cards - Mobile */}
        <div className="md:hidden space-y-3">
          {filtered.map((invoice) => (
            <div
              key={invoice.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 cursor-pointer hover:border-indigo-200 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-gray-900 font-semibold text-sm">
                    {invoice.id}
                  </p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {invoice.client}
                  </p>
                </div>
                <StatusBadge status={invoice.status as any} />
              </div>

              <p className="text-gray-600 text-sm mb-3 truncate">
                {invoice.project}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div>
                  <p className="text-gray-900 font-bold text-lg">
                    {invoice.amount}
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    Due {invoice.dueDate}
                  </p>
                </div>

                <div className="flex gap-2">
                  {invoice.status === "draft" && (
                    <button className="p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 cursor-pointer">
                      <Send size={14} />
                    </button>
                  )}
                  {invoice.status !== "draft" && (
                    <button className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer">
                      <Download size={14} />
                    </button>
                  )}
                  <button className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer">
                    <MoreHorizontal size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-gray-100">
              <FileText size={24} className="text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm">No invoices found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
