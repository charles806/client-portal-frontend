import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Trash2, ArrowLeft, Save, Send } from 'lucide-react';
import { useInvoices, InvoiceItem } from '../hooks/useInvoices';
import { useProjects } from '../hooks/useProjects';
import { useWorkspaceStore } from '../store/workspaceStore';
import { Spinner } from '../components/ui/ios-spinner';
import { toast } from 'sonner';

export default function CreateInvoice() {
    const navigate = useNavigate();
    const { currentWorkspaceId } = useWorkspaceStore();
    const { createInvoice } = useInvoices(currentWorkspaceId ?? undefined);
    const { projects } = useProjects(currentWorkspaceId ?? undefined);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        projectId: '',
        clientName: '',
        clientEmail: '',
        clientAddress: '',
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: '',
        taxRate: 0,
        discount: 0,
        notes: '',
        terms: 'Payment is due within 30 days of invoice date.',
    });

    const [items, setItems] = useState<InvoiceItem[]>([
        { description: '', quantity: 1, unitPrice: 0, amount: 0 },
    ]);

    // Auto-fill client name from project
    useEffect(() => {
        if (form.projectId) {
            const project = projects.find((p: any) => p.id === form.projectId);
            if (project?.clientName && !form.clientName) {
                setForm(prev => ({ ...prev, clientName: project.clientName || '' }));
            }
        }
    }, [form.projectId, projects]);

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = (subtotal - form.discount) * (form.taxRate / 100);
    const total = subtotal - form.discount + taxAmount;

    const handleAddItem = () => {
        setItems([...items, { description: '', quantity: 1, unitPrice: 0, amount: 0 }]);
    };

    const handleRemoveItem = (index: number) => {
        if (items.length > 1) {
            setItems(items.filter((_, i) => i !== index));
        }
    };

    const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };

        // Calculate amount
        if (field === 'quantity' || field === 'unitPrice') {
            newItems[index].amount = newItems[index].quantity * newItems[index].unitPrice;
        }

        setItems(newItems);
    };

    const handleSubmit = async (status: 'DRAFT' | 'SENT') => {
        // Validation
        if (!form.clientName) {
            toast.error('Client name is required');
            return;
        }
        if (!form.dueDate) {
            toast.error('Due date is required');
            return;
        }
        if (items.some(item => !item.description || item.quantity <= 0 || item.unitPrice <= 0)) {
            toast.error('Please fill in all invoice items');
            return;
        }

        setLoading(true);
        try {
            await createInvoice({
                workspaceId: currentWorkspaceId!,
                projectId: form.projectId || undefined,
                clientName: form.clientName,
                clientEmail: form.clientEmail || undefined,
                clientAddress: form.clientAddress || undefined,
                issueDate: form.issueDate,
                dueDate: form.dueDate,
                taxRate: form.taxRate,
                discount: form.discount,
                notes: form.notes || undefined,
                terms: form.terms || undefined,
                items: items.map(item => ({
                    description: item.description,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    amount: item.amount,
                })),
            });

            navigate('/invoices');
        } catch (error) {
            console.error('Failed to create invoice:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 overflow-auto bg-slate-50">
            <div className="max-w-5xl mx-auto p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/invoices')}
                            className="size-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 transition-colors"
                        >
                            <ArrowLeft className="size-5 text-slate-600" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Create Invoice</h1>
                            <p className="text-slate-500 text-sm mt-1">Fill in the details to create a new invoice</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    {/* Main Form */}
                    <div className="col-span-2 space-y-6">
                        {/* Client Information */}
                        <div className="bg-white rounded-xl border border-slate-200 p-6">
                            <h2 className="text-lg font-semibold text-slate-900 mb-4">Client Information</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                        Project (Optional)
                                    </label>
                                    <select
                                        value={form.projectId}
                                        onChange={(e) => setForm({ ...form, projectId: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                                    >
                                        <option value="">No project</option>
                                        {projects.map((project:any) => (
                                            <option key={project.id} value={project.id}>{project.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                        Client Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={form.clientName}
                                        onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                                        placeholder="Acme Corporation"
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                        Client Email
                                    </label>
                                    <input
                                        type="email"
                                        value={form.clientEmail}
                                        onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
                                        placeholder="client@example.com"
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                        Client Address
                                    </label>
                                    <textarea
                                        value={form.clientAddress}
                                        onChange={(e) => setForm({ ...form, clientAddress: e.target.value })}
                                        placeholder="123 Main St, City, State, ZIP"
                                        rows={3}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Invoice Details */}
                        <div className="bg-white rounded-xl border border-slate-200 p-6">
                            <h2 className="text-lg font-semibold text-slate-900 mb-4">Invoice Details</h2>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                        Issue Date
                                    </label>
                                    <input
                                        type="date"
                                        value={form.issueDate}
                                        onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                        Due Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={form.dueDate}
                                        onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                        Tax Rate (%)
                                    </label>
                                    <input
                                        type="number"
                                        value={form.taxRate}
                                        onChange={(e) => setForm({ ...form, taxRate: parseFloat(e.target.value) || 0 })}
                                        min="0"
                                        step="0.01"
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                        Discount ($)
                                    </label>
                                    <input
                                        type="number"
                                        value={form.discount}
                                        onChange={(e) => setForm({ ...form, discount: parseFloat(e.target.value) || 0 })}
                                        min="0"
                                        step="0.01"
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Line Items */}
                        <div className="bg-white rounded-xl border border-slate-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-slate-900">Items</h2>
                                <button
                                    onClick={handleAddItem}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-semibold"
                                >
                                    <Plus className="size-4" />
                                    Add Item
                                </button>
                            </div>

                            <div className="space-y-3">
                                {items.map((item, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={item.description}
                                                onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                                placeholder="Description"
                                                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm"
                                            />
                                        </div>
                                        <div className="w-24">
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                                                placeholder="Qty"
                                                min="0"
                                                step="0.01"
                                                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm"
                                            />
                                        </div>
                                        <div className="w-32">
                                            <input
                                                type="number"
                                                value={item.unitPrice}
                                                onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                                                placeholder="Price"
                                                min="0"
                                                step="0.01"
                                                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm"
                                            />
                                        </div>
                                        <div className="w-32">
                                            <div className="px-3 py-2 bg-slate-50 rounded-lg text-slate-900 font-semibold text-sm">
                                                ${item.amount.toFixed(2)}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveItem(index)}
                                            disabled={items.length === 1}
                                            className="size-9 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            <Trash2 className="size-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Notes & Terms */}
                        <div className="bg-white rounded-xl border border-slate-200 p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                        Notes
                                    </label>
                                    <textarea
                                        value={form.notes}
                                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                        placeholder="Additional notes for the client..."
                                        rows={3}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                        Terms & Conditions
                                    </label>
                                    <textarea
                                        value={form.terms}
                                        onChange={(e) => setForm({ ...form, terms: e.target.value })}
                                        placeholder="Payment terms..."
                                        rows={3}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="col-span-1">
                        <div className="bg-white rounded-xl border border-slate-200 p-6 sticky top-6">
                            <h3 className="text-lg font-semibold text-slate-900 mb-4">Summary</h3>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600">Subtotal</span>
                                    <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
                                </div>

                                {form.discount > 0 && (
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-600">Discount</span>
                                        <span className="font-semibold text-red-600">-${form.discount.toFixed(2)}</span>
                                    </div>
                                )}

                                {form.taxRate > 0 && (
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-600">Tax ({form.taxRate}%)</span>
                                        <span className="font-semibold text-slate-900">${taxAmount.toFixed(2)}</span>
                                    </div>
                                )}

                                <div className="border-t border-slate-200 pt-3 flex items-center justify-between">
                                    <span className="font-semibold text-slate-900">Total</span>
                                    <span className="text-2xl font-bold text-indigo-600">${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <button
                                    onClick={() => handleSubmit('DRAFT')}
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-semibold disabled:opacity-50"
                                >
                                    {loading ? <Spinner size="sm" /> : <Save className="size-4" />}
                                    Save as Draft
                                </button>

                                <button
                                    onClick={() => handleSubmit('SENT')}
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-colors font-semibold disabled:opacity-50"
                                >
                                    {loading ? <Spinner size="sm" className="text-white" /> : <Send className="size-4" />}
                                    Create & Send
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}