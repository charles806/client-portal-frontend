import { useState } from 'react';
import { FileText, Plus, Download, Send, Eye, Search, DollarSign, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { useProjects } from '../hooks/useProjects';
import { toast } from 'sonner';
import { Input } from '../components/ui/input';

type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';

interface Invoice {
  id: string;
  number: string;
  projectId: string;
  projectName: string;
  client: string;
  amount: number;
  status: InvoiceStatus;
  issuedDate: string;
  dueDate: string;
  items: { description: string; qty: number; rate: number }[];
}

const mockInvoices: Invoice[] = [
  {
    id: 'inv1',
    number: 'INV-2026-001',
    projectId: 'p1',
    projectName: 'Client Portal Redesign',
    client: 'Acme Corp',
    amount: 15000,
    status: 'paid',
    issuedDate: '2026-01-31',
    dueDate: '2026-02-28',
    items: [
      { description: 'UX Research & Discovery', qty: 1, rate: 5000 },
      { description: 'Wireframes & Prototypes', qty: 1, rate: 7500 },
      { description: 'Revisions', qty: 5, rate: 500 },
    ],
  },
  {
    id: 'inv2',
    number: 'INV-2026-002',
    projectId: 'p2',
    projectName: 'Data Analytics Platform',
    client: 'TechFlow Inc',
    amount: 22000,
    status: 'sent',
    issuedDate: '2026-02-28',
    dueDate: '2026-03-28',
    items: [
      { description: 'Architecture Design', qty: 1, rate: 8000 },
      { description: 'API Development (Phase 1)', qty: 1, rate: 14000 },
    ],
  },
  {
    id: 'inv3',
    number: 'INV-2026-003',
    projectId: 'p4',
    projectName: 'E-Commerce Migration',
    client: 'RetailBrand Co',
    amount: 26500,
    status: 'paid',
    issuedDate: '2026-02-15',
    dueDate: '2026-03-15',
    items: [
      { description: 'Data Migration', qty: 1, rate: 12000 },
      { description: 'Frontend Rebuild', qty: 1, rate: 14500 },
    ],
  },
  {
    id: 'inv4',
    number: 'INV-2026-004',
    projectId: 'p3',
    projectName: 'Mobile App — iOS & Android',
    client: 'ServicePro Ltd',
    amount: 14400,
    status: 'draft',
    issuedDate: '2026-03-01',
    dueDate: '2026-03-31',
    items: [
      { description: 'Requirements Gathering', qty: 1, rate: 6000 },
      { description: 'Initial Setup & Architecture', qty: 1, rate: 8400 },
    ],
  },
  {
    id: 'inv5',
    number: 'INV-2026-005',
    projectId: 'p5',
    projectName: 'Internal HR System',
    client: 'Global Dynamics',
    amount: 18500,
    status: 'overdue',
    issuedDate: '2026-01-30',
    dueDate: '2026-02-28',
    items: [
      { description: 'System Architecture & Setup', qty: 1, rate: 10000 },
      { description: 'Core Module Development', qty: 1, rate: 8500 },
    ],
  },
];

const statusConfig: Record<InvoiceStatus, { label: string; icon: typeof CheckCircle; className: string }> = {
  draft: { label: 'Draft', icon: FileText, className: 'bg-slate-100 text-slate-600 border-slate-200' },
  sent: { label: 'Sent', icon: Send, className: 'bg-blue-50 text-blue-600 border-blue-200' },
  paid: { label: 'Paid', icon: CheckCircle, className: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
  overdue: { label: 'Overdue', icon: AlertCircle, className: 'bg-red-50 text-red-600 border-red-200' },
};

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'all'>('all');
  const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null);

  const filtered = invoices.filter((inv) => {
    const matchSearch =
      inv.number.toLowerCase().includes(search.toLowerCase()) ||
      inv.client.toLowerCase().includes(search.toLowerCase()) ||
      inv.projectName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPaid = invoices.filter((i) => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
  const totalPending = invoices.filter((i) => i.status === 'sent').reduce((s, i) => s + i.amount, 0);
  const totalOverdue = invoices.filter((i) => i.status === 'overdue').reduce((s, i) => s + i.amount, 0);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  const handleSend = (id: string) => {
    setInvoices((prev) => prev.map((inv) => (inv.id === id ? { ...inv, status: 'sent' } : inv)));
    toast.success('Invoice sent to client');
  };

  const handleDownload = (inv: Invoice) => {
    toast.success(`Downloading ${inv.number}...`);
  };

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Invoices"
        subtitle={`${invoices.length} total · ${formatCurrency(totalPaid)} collected`}
        action={
          <button
            onClick={() => toast.info('Invoice creation coming soon')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700 transition-colors cursor-pointer shadow-md shadow-indigo-200 text-sm"
            style={{ fontWeight: 600 }}
          >
            <Plus className="size-3.5" /> New Invoice
          </button>
        }
      />

      <div className="flex-1 p-6 overflow-y-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Invoiced', value: formatCurrency(invoices.reduce((s, i) => s + i.amount, 0)), icon: DollarSign, color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200' },
            { label: 'Collected', value: formatCurrency(totalPaid), icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
            { label: 'Pending', value: formatCurrency(totalPending), icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
            { label: 'Overdue', value: formatCurrency(totalOverdue), icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
          ].map(({ label, value, icon: Icon, color, bg, border }) => (
            <div key={label} className={`rounded-2xl p-5 border ${border} ${bg} backdrop-blur`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`size-4 ${color}`} />
                <p className="text-xs text-slate-500" style={{ fontWeight: 600 }}>{label}</p>
              </div>
              <p className={`text-xl ${color}`} style={{ fontWeight: 800 }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-5">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search invoices..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/80 border border-slate-200 text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all text-sm font-normal"
            />
          </div>
          <div className="flex items-center gap-1.5 bg-white/70 backdrop-blur border border-slate-200 rounded-xl p-1">
            {(['all', 'draft', 'sent', 'paid', 'overdue'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-all cursor-pointer ${statusFilter === f ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
                style={{ fontWeight: 600 }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Invoice table */}
        <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-5 py-3.5 text-slate-500 text-xs" style={{ fontWeight: 600 }}>Invoice</th>
                <th className="text-left px-5 py-3.5 text-slate-500 text-xs" style={{ fontWeight: 600 }}>Client</th>
                <th className="text-left px-5 py-3.5 text-slate-500 text-xs hidden md:table-cell" style={{ fontWeight: 600 }}>Project</th>
                <th className="text-left px-5 py-3.5 text-slate-500 text-xs" style={{ fontWeight: 600 }}>Status</th>
                <th className="text-left px-5 py-3.5 text-slate-500 text-xs hidden lg:table-cell" style={{ fontWeight: 600 }}>Due Date</th>
                <th className="text-right px-5 py-3.5 text-slate-500 text-xs" style={{ fontWeight: 600 }}>Amount</th>
                <th className="text-right px-5 py-3.5 text-slate-500 text-xs" style={{ fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <FileText className="size-8 text-slate-200 mx-auto mb-2" />
                    <p className="text-slate-400 text-sm">No invoices found</p>
                  </td>
                </tr>
              ) : (
                filtered.map((inv) => {
                  const StatusIcon = statusConfig[inv.status].icon;
                  return (
                    <tr key={inv.id} className="border-b border-slate-50 hover:bg-indigo-50/30 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>{inv.number}</p>
                        <p className="text-slate-400 text-xs">
                          Issued {new Date(inv.issuedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </td>
                      <td className="px-5 py-3.5 text-slate-700 text-sm">{inv.client}</td>
                      <td className="px-5 py-3.5 text-slate-500 text-xs hidden md:table-cell">{inv.projectName}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${statusConfig[inv.status].className}`} style={{ fontWeight: 600 }}>
                          <StatusIcon className="size-3" />
                          {statusConfig[inv.status].label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 text-sm hidden lg:table-cell">
                        {new Date(inv.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-5 py-3.5 text-right text-slate-900 text-sm" style={{ fontWeight: 700 }}>
                        {formatCurrency(inv.amount)}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setViewInvoice(inv)}
                            className="size-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                            title="View"
                          >
                            <Eye className="size-3.5" />
                          </button>
                          {inv.status === 'draft' && (
                            <button
                              onClick={() => handleSend(inv.id)}
                              className="size-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                              title="Send"
                            >
                              <Send className="size-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDownload(inv)}
                            className="size-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Download"
                          >
                            <Download className="size-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice view modal */}
      {viewInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setViewInvoice(null)} />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Invoice header */}
            <div className="bg-indigo-600 px-6 py-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-200 text-xs mb-0.5">INVOICE</p>
                  <h2 style={{ fontWeight: 700, fontSize: '1.25rem' }}>{viewInvoice.number}</h2>
                </div>
                <div className="text-right">
                  <p className="text-indigo-200 text-xs">Total Due</p>
                  <p style={{ fontWeight: 800, fontSize: '1.5rem' }}>{formatCurrency(viewInvoice.amount)}</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-slate-400 text-xs mb-1" style={{ fontWeight: 600 }}>BILLED TO</p>
                  <p className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>{viewInvoice.client}</p>
                  <p className="text-slate-500 text-xs">{viewInvoice.projectName}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 text-xs mb-1" style={{ fontWeight: 600 }}>DATES</p>
                  <p className="text-slate-700 text-xs">Issued: {new Date(viewInvoice.issuedDate).toLocaleDateString()}</p>
                  <p className="text-slate-700 text-xs">Due: {new Date(viewInvoice.dueDate).toLocaleDateString()}</p>
                </div>
              </div>

              <table className="w-full mb-4">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left text-xs text-slate-400 pb-2" style={{ fontWeight: 600 }}>Description</th>
                    <th className="text-right text-xs text-slate-400 pb-2" style={{ fontWeight: 600 }}>Qty</th>
                    <th className="text-right text-xs text-slate-400 pb-2" style={{ fontWeight: 600 }}>Rate</th>
                    <th className="text-right text-xs text-slate-400 pb-2" style={{ fontWeight: 600 }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {viewInvoice.items.map((item, i) => (
                    <tr key={i} className="border-b border-slate-50">
                      <td className="py-2.5 text-slate-700 text-sm">{item.description}</td>
                      <td className="py-2.5 text-slate-500 text-sm text-right">{item.qty}</td>
                      <td className="py-2.5 text-slate-500 text-sm text-right">{formatCurrency(item.rate)}</td>
                      <td className="py-2.5 text-slate-900 text-sm text-right" style={{ fontWeight: 600 }}>{formatCurrency(item.qty * item.rate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-end">
                <div className="w-48">
                  <div className="flex justify-between py-2 border-t border-slate-900">
                    <span className="text-slate-900 text-sm" style={{ fontWeight: 700 }}>Total</span>
                    <span className="text-slate-900 text-sm" style={{ fontWeight: 700 }}>{formatCurrency(viewInvoice.amount)}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setViewInvoice(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer text-sm"
                >
                  Close
                </button>
                <button
                  onClick={() => { handleDownload(viewInvoice); setViewInvoice(null); }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-colors cursor-pointer text-sm"
                  style={{ fontWeight: 600 }}
                >
                  <Download className="size-4" /> Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
