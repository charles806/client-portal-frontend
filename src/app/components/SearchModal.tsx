import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Search, X, FileText, FolderKanban, Receipt, Paperclip } from 'lucide-react';
import { useSearch } from '../hooks/useSearch';
import { useWorkspaceStore } from '../store/workspaceStore';
import { Spinner } from './ui/ios-spinner';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const typeIcons = {
  project: FolderKanban,
  milestone: FileText,
  invoice: Receipt,
  attachment: Paperclip,
};

const typeLabels = {
  project: 'Project',
  milestone: 'Milestone',
  invoice: 'Invoice',
  attachment: 'Attachment',
};

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { currentWorkspaceId } = useWorkspaceStore();
  const { results, isLoading } = useSearch(query, currentWorkspaceId);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
    }
  }, [isOpen]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleResultClick = (url: string) => {
    navigate(url);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 pt-20">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-200">
          <Search className="size-5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, milestones, invoices..."
            className="flex-1 text-lg outline-none placeholder:text-slate-400"
          />
          {isLoading && <Spinner size="sm" />}
          <button
            onClick={onClose}
            className="size-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X className="size-5 text-slate-500" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {query.length === 0 ? (
            <div className="px-4 py-12 text-center">
              <Search className="size-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">Start typing to search</p>
              <p className="text-slate-400 text-sm mt-1">
                Search across projects, milestones, invoices, and files
              </p>
            </div>
          ) : results.length === 0 && !isLoading ? (
            <div className="px-4 py-12 text-center">
              <Search className="size-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No results found</p>
              <p className="text-slate-400 text-sm mt-1">
                Try a different search term
              </p>
            </div>
          ) : (
            <div className="py-2">
              {results.map((result) => {
                const Icon = typeIcons[result.type];
                return (
                  <button
                    key={`${result.type}-${result.id}`}
                    onClick={() => handleResultClick(result.url)}
                    className="w-full flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left"
                  >
                    <div className="size-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="size-5 text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-900 truncate">
                          {result.title}
                        </p>
                        <span className="text-xs text-slate-400 shrink-0">
                          {typeLabels[result.type]}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 truncate mt-0.5">
                        {result.subtitle}
                      </p>
                    </div>
                    {result.meta && (
                      <span className="text-xs text-slate-500 capitalize shrink-0 mt-1">
                        {result.meta}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Press ESC to close</span>
          <span>↵ to select</span>
        </div>
      </div>
    </div>
  );
}