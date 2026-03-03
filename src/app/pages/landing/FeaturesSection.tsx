'use client';
import React, { useEffect, useRef } from 'react';


interface FeatureCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ children, className = '', delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && ref.current) {
          setTimeout(() => {
            if (ref.current) {
              ref.current.style.opacity = '1';
              ref.current.style.transform = 'translateY(0)';
            }
          }, delay);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`glass-card p-7 relative overflow-hidden noise-overlay hover:shadow-primary-md transition-all duration-500 group ${className}`}
      style={{
        opacity: 0,
        transform: 'translateY(28px)',
        transition: `opacity 0.7s cubic-bezier(0.34,1.56,0.64,1), transform 0.7s cubic-bezier(0.34,1.56,0.64,1)`,
      }}
    >
      {children}
    </div>
  );
};

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-28 relative overflow-hidden bg-slate-50">
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(99,102,241,0.05)_0%,transparent_100%)]"
      />

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="tag tag-primary w-fit mx-auto mb-5">Features</div>
          <h2
            className="text-4xl md:text-5xl font-black text-gray-900 mb-5 tracking-tighter"
          >
            Everything your clients need.
            <br />
            <span className="gradient-text">Nothing they don't.</span>
          </h2>
          <p className="text-xl text-gray-400 font-light max-w-xl mx-auto leading-relaxed">
            Built specifically for agencies and freelancers who bill by results, not by the hour they spend on status emails.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="bento-grid">

          {/* Cell A — Project Management (large, left) */}
          <FeatureCard className="bento-cell-a bg-white" delay={0}>
            <div className="flex flex-col h-full min-h-64">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 primary-glow bg-gradient-to-br from-indigo-600 to-violet-600">
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <rect x="2" y="2" width="8" height="8" rx="2" fill="white" opacity="0.9" />
                    <rect x="12" y="2" width="8" height="8" rx="2" fill="white" opacity="0.6" />
                    <rect x="2" y="12" width="8" height="8" rx="2" fill="white" opacity="0.6" />
                    <rect x="12" y="12" width="8" height="8" rx="2" fill="white" opacity="0.3" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 mb-1 tracking-tight">Project Management</h3>
                  <p className="text-gray-500 font-light leading-relaxed">
                    Your clients see live project status without needing to ask. Milestones, timelines, and progress — all visible in their branded portal.
                  </p>
                </div>
              </div>

              {/* Mini project board */}
              <div className="mt-auto bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'To Do', count: 4, color: 'text-slate-400', bg: 'bg-slate-400' },
                    { label: 'In Progress', count: 2, color: 'text-indigo-500', bg: 'bg-indigo-500' },
                    { label: 'Done', count: 7, color: 'text-emerald-500', bg: 'bg-emerald-500' },
                  ].map((col) => (
                    <div key={col.label} className="text-center">
                      <div
                        className={`text-2xl font-black mb-1 tracking-tight ${col.color}`}
                      >
                        {col.count}
                      </div>
                      <div className="text-xs text-gray-400 font-medium">{col.label}</div>
                      <div className={`h-1 rounded-full mt-2 ${col.bg} opacity-30`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FeatureCard>

          {/* Cell B — White-label branding (right) */}
          <FeatureCard className="bento-cell-b bg-gradient-to-br from-slate-950 to-indigo-950" delay={100}>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 bg-indigo-500/20 border border-indigo-500/30">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <circle cx="11" cy="11" r="9" stroke="#A5B4FC" strokeWidth="1.5" />
                  <path d="M7 11h8M11 7v8" stroke="#A5B4FC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="text-xl font-black text-white mb-2 tracking-tight">
                White-Label Branding
              </h3>
              <p className="text-gray-400 font-light leading-relaxed text-sm">
                Your logo, your colors, your domain. Clients see your brand — not ours. Build trust without giving credit to your tools.
              </p>

              <div className="mt-6 flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-white/10">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <span className="text-white text-xs font-black">AC</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-white">portal.acmecreative.com</p>
                  <p className="text-xs text-gray-500">Your custom domain</p>
                </div>
              </div>
            </div>
          </FeatureCard>

          {/* Cell C — Deliverable Sharing */}
          <FeatureCard className="bento-cell-c bg-white" delay={150}>
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-5 bg-emerald-500/10 border border-emerald-500/20">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2v10M6 8l4 4 4-4" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 14v2a1 1 0 001 1h12a1 1 0 001-1v-2" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className="text-lg font-black text-gray-900 mb-2 tracking-tight">Deliverable Sharing</h3>
            <p className="text-gray-500 text-sm font-light leading-relaxed">
              Upload files, link assets, embed videos. Clients access everything in one organized space — not buried in email threads.
            </p>

            <div className="mt-4 space-y-2">
              {[
                { name: 'logo_v3_final.ai', size: '2.4 MB', icon: '' },
                { name: 'homepage_mockup.fig', size: '8.1 MB', icon: '' },
              ].map((file) => (
                <div key={file.name} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
                  <span className="text-sm">{file.icon}</span>
                  <span className="text-xs font-medium text-gray-700 flex-1 truncate">{file.name}</span>
                  <span className="text-xs text-gray-400">{file.size}</span>
                </div>
              ))}
            </div>
          </FeatureCard>

          {/* Cell D — Feedback & Approvals */}
          <FeatureCard className="bento-cell-d bg-white" delay={200}>
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-5 bg-amber-500/10 border border-amber-500/20">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 6h14M3 10h10M3 14h7" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className="text-lg font-black text-gray-900 mb-2 tracking-tight">Feedback & Approvals</h3>
            <p className="text-gray-500 text-sm font-light leading-relaxed">
              Clients leave comments directly on deliverables. One-click approvals are logged with timestamps — no more "I thought I said yes in email."
            </p>

            <div className="mt-4 bg-amber-50 rounded-xl p-3 border border-amber-100 flex items-start gap-2">
              <span className="text-sm mt-0.5"></span>
              <div>
                <p className="text-xs font-semibold text-gray-800">Jordan M. — Client</p>
                <p className="text-xs text-gray-500 mt-0.5">"Love the direction. Approved!"</p>
              </div>
            </div>
          </FeatureCard>

          {/* Cell E — Client Visibility (full width bottom) */}
          <FeatureCard className="bento-cell-e bg-white" delay={250}>
            <div className="flex flex-col items-start gap-6">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 bg-indigo-500/10 border border-indigo-500/20">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M1 10s3-7 9-7 9 7 9 7-3 7-9 7-9-7-9-7z" stroke="#6366F1" strokeWidth="1.8" />
                  <circle cx="10" cy="10" r="3" stroke="#6366F1" strokeWidth="1.8" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-black text-gray-900 mb-2 tracking-tight">Client Status Visibility</h3>
                <p className="text-gray-500 text-sm font-light leading-relaxed">
                  Clients always know exactly where things stand. Kill the "what's the status?" email before it's sent. Real-time updates, zero friction.
                </p>
              </div>
              <div className="flex items-center gap-3 bg-indigo-50 rounded-2xl px-5 py-4 border border-indigo-100 flex-shrink-0">
                <div className="text-center">
                  <div className="text-3xl font-black text-indigo-600 tracking-tighter">94%</div>
                  <div className="text-xs text-gray-400 font-medium mt-1 uppercase tracking-widest leading-none">fewer status emails</div>
                </div>
              </div>
            </div>
          </FeatureCard>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;