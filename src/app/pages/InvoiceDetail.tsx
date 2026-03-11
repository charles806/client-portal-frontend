import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Edit, Trash2, Send, Check, X, Download, MoreVertical } from 'lucide-react';
import { useInvoice, useInvoices, InvoiceStatus } from '../hooks/useInvoices';
import { useWorkspaceStore } from '../store/workspaceStore';
import { Spinner } from '../components/ui/ios-spinner';
import { toast } from 'sonner';

const statusColors: Record<InvoiceStatus, string> = {
    DRAFT: 'bg-gray-100 text-gray-700',
    SENT: 'bg-blue-100 text-blue-700',
    PAID: 'bg-emerald-100 text-emerald-700',
    OVERDUE: 'bg-red-100 text-red-700',
    CANCELLED: 'bg-slate-100 text-slate-500',
};

export default function InvoiceDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { currentWorkspaceId } = useWorkspaceStore();
    const { data: invoice, isLoading } = useInvoice(id);
    const { updateStatus, deleteInvoice } = useInvoices(currentWorkspaceId ?? '');
    const [showActions, setShowActions] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const handleStatusChange = async (status: InvoiceStatus) => {
        if (!id) return;
        try {
            await updateStatus({ id, status });
            setShowActions(false);
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const handleDelete = async () => {
        if (!id) return;
        try {
            await deleteInvoice(id);
            navigate('/invoices');
        } catch (error) {
            console.error('Failed to delete invoice:', error);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!invoice) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <p className="text-slate-500 font-medium">Invoice not found</p>
                    <button
                        onClick={() => navigate('/invoices')}
                        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-colors text-sm font-semibold"
                    >
                        Back to Invoices
                    </button>
                </div>
            </div>
        );
    }

    const isDraft = invoice.status === 'DRAFT';
    const isPaid = invoice.status === 'PAID';

    return (
        <div className="flex-1 overflow-auto bg-slate-50">
            <div className="max-w-5xl mx-auto p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 no-print">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/invoices')}
                            className="size-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 transition-colors"
                        >
                            <ArrowLeft className="size-5 text-slate-600" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">{invoice.invoiceNumber}</h1>
                            <p className="text-slate-500 text-sm mt-1">
                                Created {formatDate(invoice.createdAt)}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${statusColors[invoice.status]}`}>
                            {invoice.status}
                        </span>

                        {!isPaid && (
                            <div className="relative">
                                <button
                                    onClick={() => setShowActions(!showActions)}
                                    className="size-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 transition-colors"
                                >
                                    <MoreVertical className="size-5 text-slate-600" />
                                </button>

                                {showActions && (
                                    <div className="absolute right-0 top-12 w-48 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden z-10">
                                        {isDraft && (
                                            <button
                                                onClick={() => handleStatusChange('SENT')}
                                                className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                                            >
                                                <Send className="size-4" />
                                                Mark as Sent
                                            </button>
                                        )}
                                        {!isDraft && !isPaid && (
                                            <button
                                                onClick={() => handleStatusChange('PAID')}
                                                className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 flex items-center gap-2 text-emerald-600"
                                            >
                                                <Check className="size-4" />
                                                Mark as Paid
                                            </button>
                                        )}
                                        {!isPaid && (
                                            <button
                                                onClick={() => handleStatusChange('CANCELLED')}
                                                className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                                            >
                                                <X className="size-4" />
                                                Cancel Invoice
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-semibold"
                        >
                            <Download className="size-4" />
                            Print / Download
                        </button>

                        <button
                            onClick={() => setConfirmDelete(true)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-semibold"
                        >
                            <Trash2 className="size-4" />
                            Delete
                        </button>
                    </div>
                </div>

                {/* Invoice Preview */}
                <div className="bg-white rounded-xl border border-slate-200 p-12 shadow-sm">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-12">
                        <div>
                            <h2 className="text-4xl font-bold text-slate-900 mb-2">INVOICE</h2>
                            <p className="text-slate-500 text-sm">{invoice.invoiceNumber}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-slate-500 mb-1">Invoice Date</p>
                            <p className="font-semibold text-slate-900">{formatDate(invoice.issueDate)}</p>
                            <p className="text-sm text-slate-500 mt-4 mb-1">Due Date</p>
                            <p className="font-semibold text-slate-900">{formatDate(invoice.dueDate)}</p>
                        </div>
                    </div>

                    {/* From / To */}
                    <div className="grid grid-cols-2 gap-12 mb-12">
                        <div>
                            <p className="text-xs uppercase tracking-wide text-slate-500 mb-2 font-semibold">From</p>
                            <p className="font-bold text-slate-900 text-lg mb-1">{invoice.workspace?.name}</p>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-wide text-slate-500 mb-2 font-semibold">Bill To</p>
                            <p className="font-bold text-slate-900 text-lg mb-1">{invoice.clientName}</p>
                            {invoice.clientEmail && (
                                <p className="text-slate-600 text-sm">{invoice.clientEmail}</p>
                            )}
                            {invoice.clientAddress && (
                                <p className="text-slate-600 text-sm mt-1 whitespace-pre-line">{invoice.clientAddress}</p>
                            )}
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="mb-12">
                        <table className="w-full">
                            <thead className="border-b-2 border-slate-900">
                                <tr>
                                    <th className="text-left py-3 text-xs uppercase tracking-wide font-semibold text-slate-900">Description</th>
                                    <th className="text-right py-3 text-xs uppercase tracking-wide font-semibold text-slate-900">Qty</th>
                                    <th className="text-right py-3 text-xs uppercase tracking-wide font-semibold text-slate-900">Price</th>
                                    <th className="text-right py-3 text-xs uppercase tracking-wide font-semibold text-slate-900">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {invoice.items.map((item) => (
                                    <tr key={item.id}>
                                        <td className="py-4 text-slate-900">{item.description}</td>
                                        <td className="py-4 text-right text-slate-600">{item.quantity}</td>
                                        <td className="py-4 text-right text-slate-600">{formatCurrency(item.unitPrice)}</td>
                                        <td className="py-4 text-right font-semibold text-slate-900">{formatCurrency(item.amount)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals */}
                    <div className="flex justify-end mb-12">
                        <div className="w-80 space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-600">Subtotal</span>
                                <span className="font-semibold text-slate-900">{formatCurrency(invoice.subtotal)}</span>
                            </div>

                            {invoice.discount > 0 && (
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600">Discount</span>
                                    <span className="font-semibold text-red-600">-{formatCurrency(invoice.discount)}</span>
                                </div>
                            )}

                            {invoice.taxRate > 0 && (
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600">Tax ({invoice.taxRate}%)</span>
                                    <span className="font-semibold text-slate-900">{formatCurrency(invoice.taxAmount)}</span>
                                </div>
                            )}

                            <div className="border-t-2 border-slate-900 pt-3 flex items-center justify-between">
                                <span className="font-bold text-slate-900 text-lg">Total</span>
                                <span className="text-2xl font-bold text-slate-900">{formatCurrency(invoice.total)}</span>
                            </div>

                            {isPaid && invoice.paidAt && (
                                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mt-4">
                                    <div className="flex items-center gap-2 text-emerald-700">
                                        <Check className="size-5" />
                                        <span className="font-semibold">Paid on {formatDate(invoice.paidAt)}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Notes & Terms */}
                    <div className="border-t border-slate-200 pt-8 space-y-6">
                        {invoice.notes && (
                            <div>
                                <p className="text-xs uppercase tracking-wide text-slate-500 mb-2 font-semibold">Notes</p>
                                <p className="text-slate-700 text-sm whitespace-pre-line">{invoice.notes}</p>
                            </div>
                        )}

                        {invoice.terms && (
                            <div>
                                <p className="text-xs uppercase tracking-wide text-slate-500 mb-2 font-semibold">Terms & Conditions</p>
                                <p className="text-slate-700 text-sm whitespace-pre-line">{invoice.terms}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Project Link */}
                {invoice.project && (
                    <div className="mt-6 bg-white rounded-xl border border-slate-200 p-4 no-print">
                        <p className="text-sm text-slate-500 mb-1">Associated Project</p>
                        <button
                            onClick={() => navigate(`/projects/${invoice.project!.id}`)}
                            className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
                        >
                            {invoice.project.name} →
                        </button>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {confirmDelete && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 no-print">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Invoice?</h3>
                        <p className="text-slate-600 mb-6">
                            Are you sure you want to delete this invoice? This action cannot be undone.
                        </p>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setConfirmDelete(false)}
                                className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-semibold"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-500 transition-colors font-semibold"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Print Styles */}
            <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
          }
        }
      `}</style>
        </div>
    );
}