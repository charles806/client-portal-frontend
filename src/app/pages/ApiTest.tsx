import { useState } from 'react';
import { Play, Check, X, Code2 } from 'lucide-react';
import { Spinner } from '../components/ui/ios-spinner';

import { Header } from '../components/layout/Header';
import api from '../services/api';
import { toast } from 'sonner';

interface TestResult {
  endpoint: string;
  method: string;
  status: 'success' | 'error' | 'pending';
  duration: number;
  response?: unknown;
}

const testCases = [
  { label: 'GET /projects', method: 'GET', endpoint: '/projects' },
  { label: 'GET /projects/p1', method: 'GET', endpoint: '/projects/p1' },
  { label: 'POST /projects', method: 'POST', endpoint: '/projects', body: { name: 'Test Project', client: 'Test Client' } },
  { label: 'GET /invoices', method: 'GET', endpoint: '/invoices' },
  { label: 'GET /workspace', method: 'GET', endpoint: '/workspace' },
];

export default function ApiTest() {
  const [results, setResults] = useState<Record<string, TestResult>>({});
  const [running, setRunning] = useState(false);

  const runTest = async (tc: typeof testCases[0]) => {
    const start = Date.now();
    setResults((prev) => ({ ...prev, [tc.endpoint]: { endpoint: tc.endpoint, method: tc.method, status: 'pending', duration: 0 } }));
    try {
      let result;
      if (tc.method === 'POST') result = await api.post(tc.endpoint, tc.body ?? {});
      else result = await api.get(tc.endpoint);
      setResults((prev) => ({
        ...prev,
        [tc.endpoint]: { endpoint: tc.endpoint, method: tc.method, status: 'success', duration: Date.now() - start, response: result },
      }));
    } catch (e) {
      setResults((prev) => ({
        ...prev,
        [tc.endpoint]: { endpoint: tc.endpoint, method: tc.method, status: 'error', duration: Date.now() - start },
      }));
    }
  };

  const runAll = async () => {
    setRunning(true);
    for (const tc of testCases) {
      await runTest(tc);
    }
    setRunning(false);
    toast.success('All API tests complete');
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="API Test" subtitle="Test backend API connectivity" />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-lg flex-1 mr-4">
              <div className="size-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                <Code2 className="size-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-slate-900 text-sm" style={{ fontWeight: 700 }}>API Service</p>
                <p className="text-slate-400 text-xs">Mock API — Replace with real backend URL in api.ts</p>
              </div>
            </div>
            <button
              onClick={runAll}
              disabled={running}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-all cursor-pointer shadow-md shadow-indigo-200 disabled:opacity-60"
              style={{ fontWeight: 600 }}
            >
              {running ? <Spinner size="sm" className="text-white" /> : <Play className="size-4" />}

              Run All
            </button>
          </div>

          {/* Test cases */}
          <div className="space-y-3">
            {testCases.map((tc) => {
              const result = results[tc.endpoint];
              return (
                <div key={tc.endpoint} className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-sm p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-1 rounded-lg border ${tc.method === 'GET' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`} style={{ fontWeight: 700 }}>
                        {tc.method}
                      </span>
                      <span className="text-slate-700 text-sm font-mono">{tc.endpoint}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      {result && (
                        <div className="flex items-center gap-2">
                          {result.status === 'pending' && <Spinner size="sm" />}

                          {result.status === 'success' && (
                            <>
                              <Check className="size-4 text-emerald-500" />
                              <span className="text-emerald-600 text-xs" style={{ fontWeight: 600 }}>{result.duration}ms</span>
                            </>
                          )}
                          {result.status === 'error' && <X className="size-4 text-red-500" />}
                        </div>
                      )}
                      <button
                        onClick={() => runTest(tc)}
                        className="size-8 rounded-lg flex items-center justify-center bg-slate-100 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer"
                      >
                        <Play className="size-3.5" />
                      </button>
                    </div>
                  </div>

                  {result?.status === 'success' && result.response && (
                    <div className="mt-3 p-3 bg-slate-900 rounded-xl overflow-auto max-h-32">
                      <pre className="text-emerald-400 text-xs">{JSON.stringify(result.response, null, 2)}</pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200">
            <p className="text-amber-700 text-sm" style={{ fontWeight: 600 }}>⚡ Integration Note</p>
            <p className="text-amber-600 text-xs mt-1 leading-relaxed">
              This uses a mock API layer. To connect to a real backend, update <code className="bg-amber-100 px-1 py-0.5 rounded">BASE_URL</code> in{' '}
              <code className="bg-amber-100 px-1 py-0.5 rounded">src/app/services/api.ts</code> and replace the mock request handler with real <code className="bg-amber-100 px-1 py-0.5 rounded">fetch()</code> calls.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
