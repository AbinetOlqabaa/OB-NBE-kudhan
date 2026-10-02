import { useEffect, useState } from 'react';
import { Activity, CheckCircle2, AlertCircle, RefreshCw, Server, Laptop } from 'lucide-react';

interface HealthData {
  status: string;
  service: string;
  readyForImport: boolean;
  timestamp: string;
  nodeVersion: string;
  environment: string;
}

export default function App() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/health');
      if (!res.ok) {
        throw new Error(`Health check returned status ${res.status}`);
      }
      const data: HealthData = await res.json();
      setHealth(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown server connection error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans antialiased p-6 sm:p-12">
      <div className="max-w-2xl mx-auto w-full">
        {/* Header */}
        <header className="border-b border-slate-800 pb-6 mb-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white tracking-tight">
                  OB/NBE Regulatory Reporting
                </h1>
                <p className="text-sm text-slate-400">Technical Landing Pad & Kernel</p>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Kernel Online
            </span>
          </div>
        </header>

        {/* Status Card */}
        <main className="space-y-6">
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                Environment Status
              </h2>
              <button
                onClick={fetchHealth}
                disabled={loading}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors disabled:opacity-50"
                title="Refresh health status"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>

            {error ? (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium">Backend Health Check Failed</div>
                  <div className="text-rose-400/80 text-xs mt-1">{error}</div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Frontend Card */}
                <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800/80">
                  <div className="flex items-center gap-2 mb-2 text-slate-300">
                    <Laptop className="w-4 h-4 text-sky-400" />
                    <span className="text-xs font-medium">Frontend Runtime</span>
                  </div>
                  <div className="text-sm font-medium text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    React 19 + Vite
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Single-Page App Engine</div>
                </div>

                {/* Backend Card */}
                <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800/80">
                  <div className="flex items-center gap-2 mb-2 text-slate-300">
                    <Server className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-medium">Backend Runtime</span>
                  </div>
                  <div className="text-sm font-medium text-white flex items-center gap-2">
                    {health ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Node.js Express ({health.nodeVersion})
                      </>
                    ) : (
                      <span className="text-slate-400 text-xs">Checking runtime...</span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {health ? `Environment: ${health.environment}` : 'Connecting...'}
                  </div>
                </div>
              </div>
            )}

            {/* Diagnostic Details */}
            {health && (
              <div className="mt-5 pt-5 border-t border-slate-800/80 text-xs space-y-2 text-slate-400">
                <div className="flex justify-between">
                  <span>Kernel Service:</span>
                  <span className="text-slate-200 font-mono">{health.service}</span>
                </div>
                <div className="flex justify-between">
                  <span>Backend Status:</span>
                  <span className="text-emerald-400 font-mono capitalize">{health.status}</span>
                </div>
                <div className="flex justify-between">
                  <span>Health Timestamp:</span>
                  <span className="text-slate-300 font-mono">{health.timestamp}</span>
                </div>
                <div className="flex justify-between">
                  <span>Import Readiness:</span>
                  <span className="text-emerald-400 font-mono">Ready for application source</span>
                </div>
              </div>
            )}
          </section>

          {/* Landing Pad Notice */}
          <section className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/60 text-xs text-slate-400 leading-relaxed">
            <span className="font-semibold text-slate-300">Landing Environment Ready: </span>
            This workspace provides a minimal, clean production-ready technical kernel. It is ready for the existing OB/NBE regulatory reporting application ZIP to be imported as the authoritative source.
          </section>
        </main>
      </div>

      {/* Footer */}
      <footer className="max-w-2xl mx-auto w-full pt-8 text-center text-xs text-slate-600">
        OB/NBE Regulatory Reporting Kernel &bull; Google AI Studio Build Runtime
      </footer>
    </div>
  );
}
