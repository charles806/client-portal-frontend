import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState } from 'react';
import { useNavigate } from 'react-router';
import { Plus, FileText, DollarSign, Calendar, Filter } from 'lucide-react';
import { useInvoices, InvoiceStatus, Invoice } from '../hooks/useInvoices';
import { useWorkspaceStore } from '../store/workspaceStore';
import { Spinner } from '../components/ui/ios-spinner';

const statusColors: Record<InvoiceStatus, string> = {
  DRAFT: 'bg-gray-100 text-gray-700',
  SENT: 'bg-blue-100 text-blue-700',
  PAID: 'bg-emerald-100 text-emerald-700',
  OVERDUE: 'bg-red-100 text-red-700',
  CANCELLED: 'bg-slate-100 text-slate-500',
};

export default function Invoices() {
  const navigate = useNavigate();
  const { currentWorkspaceId } = useWorkspaceStore();
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'ALL'>('ALL');

  const filters = statusFilter === 'ALL' ? {} : { status: statusFilter };
  const { invoices, isLoading } = useInvoices(currentWorkspaceId ?? undefined, filters);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const stats = {
    total: invoices.length,
    draft: invoices.filter((inv: Invoice) => inv.status === 'DRAFT').length,
    sent: invoices.filter((inv: Invoice) => inv.status === 'SENT').length,
    paid: invoices.filter((inv: Invoice) => inv.status === 'PAID').length,
    overdue: invoices.filter((inv: Invoice) => inv.status === 'OVERDUE').length,
    totalAmount: invoices.reduce((sum: number, inv: Invoice) => sum + inv.total, 0),
    paidAmount: invoices.filter((inv: Invoice) => inv.status === 'PAID').reduce((sum: number, inv: Invoice) => sum + inv.total, 0),
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Invoices</h1>
            <p className="text-slate-500 text-sm mt-1">
              Manage and track your invoices
            </p>
          </div>
          <button
            onClick={() => navigate('/invoices/new')}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-colors font-semibold"
          >
            <Plus className="size-4" />
            New Invoice
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                <FileText className="size-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-slate-500 text-sm">Total Invoices</p>
                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <DollarSign className="size-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-slate-500 text-sm">Total Amount</p>
                <p className="text-2xl font-bold text-slate-900">{formatCurrency(stats.totalAmount)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-green-100 flex items-center justify-center">
                <DollarSign className="size-5 text-green-600" />
              </div>
              <div>
                <p className="text-slate-500 text-sm">Paid</p>
                <p className="text-2xl font-bold text-slate-900">{formatCurrency(stats.paidAmount)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-red-100 flex items-center justify-center">
                <Calendar className="size-5 text-red-600" />
              </div>
              <div>
                <p className="text-slate-500 text-sm">Overdue</p>
                <p className="text-2xl font-bold text-slate-900">{stats.overdue}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4">
          <div className="flex items-center gap-4">
            <Filter className="size-4 text-slate-400" />
            <div className="flex items-center gap-2">
              {(['ALL', 'DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${statusFilter === status
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-100'
                    }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {invoices.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="size-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">No invoices yet</p>
              <p className="text-slate-400 text-sm mt-1">
                Create your first invoice to get started
              </p>
              <button
                onClick={() => navigate('/invoices/new')}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-colors text-sm font-semibold"
              >
                Create Invoice
              </button>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-700">Invoice #</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-700">Client</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-700">Project</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-700">Amount</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-700">Due Date</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {invoices.map((invoice: Invoice) => (
                  <tr
                    key={invoice.id}
                    onClick={() => navigate(`/invoices/${invoice.id}`)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-900">{invoice.invoiceNumber}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-700">{invoice.clientName}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-500">
                        {invoice.project?.name || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-slate-900">
                        {formatCurrency(invoice.total)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">{formatDate(invoice.dueDate)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[invoice.status]}`}>
                        {invoice.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}