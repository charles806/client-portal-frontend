'use client';
import React, { useEffect, useRef } from 'react';
import { Mail, MessageCircle, Folder, ListTodo, Phone, Check, Upload, MessageCircleCode, Lock, Palette, Angry, Sparkle } from 'lucide-react';

const chaosTools = [
  { icon: <Mail />, name: 'Email', desc: '47 unread threads', color: '#EF4444' },
  { icon: <MessageCircle />, name: 'Slack', desc: '12 DMs about files', color: '#F59E0B' },
  { icon: <Folder />, name: 'Google Drive', desc: 'v3_FINAL_v2.pdf', color: '#F59E0B' },
  { icon: <ListTodo />, name: 'Trello', desc: 'Client never logs in', color: '#EF4444' },
  { icon: <Phone />, name: 'Zoom calls', desc: 'Status update calls', color: '#EF4444' },
];

const portalFeatures = [
  { icon: <Check />, name: 'Project Hub', desc: 'Live status, always visible', color: '#10B981' },
  { icon: <Upload />, name: 'File Delivery', desc: 'Versioned, organized', color: '#6366F1' },
  { icon: <MessageCircleCode />, name: 'Feedback Loop', desc: 'In-context comments', color: '#6366F1' },
  { icon: <Lock />, name: 'One-click Approval', desc: 'Logged & timestamped', color: '#10B981' },
  { icon: <Palette />, name: 'Your Brand', desc: 'White-labeled portal', color: '#10B981' },
];

const ProblemSolutionSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal-item').forEach((el, i) => {
              setTimeout(() => {
                (el as HTMLElement).style.opacity = '1';
                (el as HTMLElement).style.transform = 'translateY(0)';
              }, i * 80);
            });
          }
        });
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="problem" ref={sectionRef} className="py-28 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(99,102,241,0.04) 0%, transparent 100%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="tag tag-primary w-fit mx-auto mb-5">The Problem</div>
          <h2
            className="text-4xl md:text-5xl font-black text-gray-900 mb-5"
            style={{ letterSpacing: '-0.03em' }}
          >
            Your tool stack is
            <span className="gradient-text-warm"> costing you clients.</span>
          </h2>
          <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
            The average agency spends 5–10 hours per client per week just on communication.
            Not delivery. Not creative work. Just answering "where's the file?"
          </p>
        </div>

        {/* Comparison grid */}
        <div className="grid md:grid-cols-2 gap-8 items-start">

          {/* Chaos side */}
          <div
            className="chaos-card rounded-4xl p-8 relative overflow-hidden reveal-item"
            style={{ opacity: 0, transform: 'translateY(32px)', transition: 'all 0.7s cubic-bezier(0.34,1.56,0.64,1)' }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center text-xl"><Angry /></div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">The Current Reality</h3>
                <p className="text-sm text-red-500 font-medium">5 tools, 0 clarity</p>
              </div>
            </div>

            <div className="space-y-3">
              {chaosTools.map((tool, i) => (
                <div
                  key={tool.name}
                  className="reveal-item flex items-center gap-4 bg-white/70 rounded-2xl px-4 py-3 border border-red-100"
                  style={{
                    opacity: 0,
                    transform: 'translateY(20px)',
                    transition: `all 0.5s cubic-bezier(0.34,1.56,0.64,1) ${i * 60}ms`,
                  }}
                >
                  <span className="text-xl">{tool.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-800">{tool.name}</p>
                    <p className="text-xs text-gray-500">{tool.desc}</p>
                  </div>
                  <div className="w-2 h-2 rounded-full" style={{ background: tool.color }} />
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-red-50 rounded-2xl border border-red-100">
              <p className="text-sm text-red-600 font-semibold text-center">
                ⏱ 7.5 hours lost per client this week
              </p>
            </div>
          </div>

          {/* Solution side */}
          <div
            className="clarity-card rounded-4xl p-8 relative overflow-hidden reveal-item"
            style={{ opacity: 0, transform: 'translateY(32px)', transition: 'all 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.15s' }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-primary-100 flex items-center justify-center text-xl"><Sparkle /></div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">With Portalwave</h3>
                <p className="text-sm text-primary-600 font-medium">1 portal, total clarity</p>
              </div>
            </div>

            <div className="space-y-3">
              {portalFeatures.map((feature, i) => (
                <div
                  key={feature.name}
                  className="reveal-item flex items-center gap-4 bg-white/70 rounded-2xl px-4 py-3 border border-primary-100"
                  style={{
                    opacity: 0,
                    transform: 'translateY(20px)',
                    transition: `all 0.5s cubic-bezier(0.34,1.56,0.64,1) ${i * 60 + 150}ms`,
                  }}
                >
                  <span className="text-xl">{feature.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-800">{feature.name}</p>
                    <p className="text-xs text-gray-500">{feature.desc}</p>
                  </div>
                  <div className="w-2 h-2 rounded-full" style={{ background: feature.color }} />
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-primary-50 rounded-2xl border border-primary-100">
              <p className="text-sm text-primary-600 font-semibold text-center">
                🚀 5h 20m saved — back to real work
              </p>
            </div>
          </div>
        </div>

        {/* Bottom callout */}
        <div
          className="mt-14 text-center reveal-item"
          style={{ opacity: 0, transform: 'translateY(24px)', transition: 'all 0.6s ease 0.4s' }}
        >
          <a href="/signup" className="btn-primary px-10 py-4 text-base inline-flex items-center gap-2">
            Replace your tool stack today
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <p className="text-sm text-gray-400 mt-3">No credit card required · 14-day free trial</p>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolutionSection;