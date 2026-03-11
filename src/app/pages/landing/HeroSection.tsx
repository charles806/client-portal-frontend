'use client';
import React, { useEffect, useRef } from 'react';
import AppImage from './AppImage';

const HeroSection: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      const cards = [card1Ref, card2Ref, card3Ref];
      const depths = [0.012, 0.018, 0.008];
      cards.forEach((cardRef, i) => {
        if (cardRef.current) {
          cardRef.current.style.transform = `translate(${x * depths[i] * 80}px, ${y * depths[i] * 60}px)`;
        }
      });
    };

    const el = heroRef.current;
    el?.addEventListener('mousemove', handleMouseMove);
    return () => el?.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden animated-gradient-bg"
    >
      {/* Wireframe grid */}
      <div className="wireframe-bg" />

      {/* Ambient glow blobs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none bg-[radial-gradient(circle,rgba(99,102,241,0.12)_0%,transparent_70%)] blur-[40px] animate-[floatYSlow_8s_ease-in-out_infinite]"
      />
      <div
        className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full pointer-events-none bg-[radial-gradient(circle,rgba(168,85,247,0.1)_0%,transparent_70%)] blur-[50px] animate-[floatYSlow_10s_ease-in-out_infinite_reverse]"
      />

      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left: Text content */}
          <div className="space-y-8 relative z-10">
            {/* Badge */}
            <div className="tag tag-primary w-fit">
              <span className="status-dot" />
              White-Label Client Portal
            </div>

            {/* Headline */}
            <div>
              <h1
                className="text-5xl md:text-6xl xl:text-7xl font-black leading-[0.9] tracking-tighter text-gray-900"
              >
                <span className="block text-3xl md:text-4xl font-light italic text-gray-400 mb-2 font-serif">
                  Stop answering
                </span>
                Kill the
                <br />
                <span className="gradient-text">Email Chaos.</span>
              </h1>
            </div>

            <p className="text-lg md:text-xl text-gray-500 font-light leading-relaxed max-w-lg">
              Manage projects, share deliverables, collect feedback, and get approvals —
              all in one branded portal your clients actually love using.
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap gap-6">
              {[
                { value: '5–10h', label: 'saved per client/week' },
                { value: '3×', label: 'faster approvals' },
                { value: '100%', label: 'white-labeled' },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <span className="text-2xl font-black text-gray-900 tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-widest mt-0.5">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <a href="/signup" className="btn-primary px-8 py-4 text-base inline-flex items-center gap-2">
                Get Started Free
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a href="#features" className="btn-secondary px-8 py-4 text-base inline-flex items-center gap-2">
                See how it works
              </a>
            </div>

            {/* Trust indicator */}
            {/* <div className="flex items-center gap-3 pt-2">
              <div className="flex -space-x-2">
                {[
                  'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=1',
                  'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=1',
                  'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=1',
                  'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=1',
                ].map((src, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white overflow-hidden"
                    style={{ zIndex: 4 - i }}
                  >
                    <AppImage src={src} alt={`Agency user ${i + 1}`} width={32} height={32} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="12" height="12" viewBox="0 0 12 12" fill="#F59E0B">
                      <path d="M6 1l1.4 2.8L10.5 4l-2.25 2.2.53 3.1L6 7.75 3.22 9.3l.53-3.1L1.5 4l3.1-.2z" />
                    </svg>
                  ))}
                </div>
                <p className="text-xs text-gray-400 font-medium mt-0.5">Trusted by 1,200+ agencies</p>
              </div>
            </div> */}
          </div>

          {/* Right: 3D Dashboard Preview */}
          <div className="relative hidden lg:block">
            <div className="dashboard-3d-wrapper cursor-pointer">
              <div className="dashboard-3d-inner">
                {/* Main dashboard card */}
                <div className="glass-card p-3 primary-glow-lg overflow-hidden">
                  <div className="rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                    {/* Dashboard mockup header */}
                    <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-error opacity-70" />
                        <div className="w-2.5 h-2.5 rounded-full bg-warning opacity-70" />
                        <div className="w-2.5 h-2.5 rounded-full bg-success opacity-70" />
                      </div>
                      <div className="flex-1 mx-4">
                        <div className="bg-gray-100 rounded-full h-5 flex items-center px-3 max-w-xs mx-auto">
                          <span className="text-xs text-gray-400">app.portalwave.io/acme-studio</span>
                        </div>
                      </div>
                      <div className="w-16" />
                    </div>

                    {/* Dashboard body */}
                    <div className="flex" style={{ minHeight: '320px' }}>
                      {/* Sidebar */}
                      <div className="w-14 bg-gray-900 flex flex-col items-center py-4 gap-3">
                        <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="white">
                            <rect x="1" y="1" width="5" height="5" rx="1" />
                            <rect x="8" y="1" width="5" height="5" rx="1" />
                            <rect x="1" y="8" width="5" height="5" rx="1" />
                            <rect x="8" y="8" width="5" height="5" rx="1" />
                          </svg>
                        </div>
                        {['M3 4h8M3 7h8M3 10h5', 'M12 2H2v10h10V2zM7 2v10M2 7h10', 'M2 6l3 3 5-5'].map((d, i) => (
                          <div key={i} className="w-7 h-7 rounded-lg bg-gray-800 flex items-center justify-center opacity-60">
                            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="1.5">
                              <path d={d} />
                            </svg>
                          </div>
                        ))}
                      </div>

                      {/* Main content */}
                      <div className="flex-1 p-4 bg-white">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-xs font-bold text-gray-900">Acme Studio Portal</h3>
                            <p className="text-xs text-gray-400">3 active projects</p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="status-dot" style={{ width: '6px', height: '6px' }} />
                            <span className="text-xs text-success font-medium">Live</span>
                          </div>
                        </div>

                        {/* Project rows */}
                        {[
                          { name: 'Brand Redesign', status: 'Awaiting Approval', color: '#F59E0B', pct: 78 },
                          { name: 'Website Revamp', status: 'In Review', color: '#6366F1', pct: 55 },
                          { name: 'Social Campaign', status: 'Approved ✓', color: '#10B981', pct: 100 },
                        ].map((project) => (
                          <div key={project.name} className="mb-3 p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-xs font-semibold text-gray-800">{project.name}</span>
                              <span
                                className="text-xs px-2 py-0.5 rounded-full font-medium"
                                style={{
                                  background: `${project.color}18`,
                                  color: project.color,
                                }}
                              >
                                {project.status}
                              </span>
                            </div>
                            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{ width: `${project.pct}%`, background: project.color }}
                              />
                            </div>
                          </div>
                        ))}

                        {/* Recent activity */}
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-xs text-gray-400 font-medium mb-2">Recent Activity</p>
                          {[
                            { icon: '💬', text: 'Client approved logo v3', time: '2m ago' },
                            { icon: '📎', text: 'New file uploaded', time: '1h ago' },
                          ].map((item) => (
                            <div key={item.text} className="flex items-center gap-2 mb-1.5">
                              <span className="text-xs">{item.icon}</span>
                              <span className="text-xs text-gray-600 flex-1">{item.text}</span>
                              <span className="text-xs text-gray-400">{item.time}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating cards */}
            <div
              ref={card1Ref}
              className="absolute -top-6 -right-4 glass-card px-4 py-3 float-anim shadow-lg transition-transform duration-150 ease-out z-20"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-emerald-500/10">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8l3 3 7-7" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">Approval received!</p>
                  <p className="text-xs text-gray-400">Homepage design · just now</p>
                </div>
              </div>
            </div>

            <div
              ref={card2Ref}
              className="absolute -bottom-4 -left-6 glass-card px-4 py-3 float-anim-slow shadow-lg transition-transform duration-150 ease-out z-20"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-indigo-500/10">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1v6m0 0l-2-2m2 2l2-2M2 10h12l-1 4H3l-1-4z" stroke="#6366F1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">5h 20m saved</p>
                  <p className="text-xs text-gray-400">This week vs. email</p>
                </div>
              </div>
            </div>

            <div
              ref={card3Ref}
              className="absolute top-1/2 -right-8 glass-card px-4 py-3 float-anim-fast shadow-lg transition-transform duration-150 ease-out z-20 -translate-y-1/2"
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1.5">
                  {[
                    { color: 'bg-indigo-500', z: 'z-[3]' },
                    { color: 'bg-emerald-500', z: 'z-[2]' },
                    { color: 'bg-amber-500', z: 'z-[1]' }
                  ].map((item, i) => (
                    <div
                      key={i}
                      className={`w-6 h-6 rounded-full border-2 border-white ${item.color} ${item.z}`}
                    />
                  ))}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">3 clients online</p>
                  <p className="text-xs text-gray-400">Viewing portal now</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;