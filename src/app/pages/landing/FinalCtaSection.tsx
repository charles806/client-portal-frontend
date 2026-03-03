'use client';
import React, { useRef, useEffect } from 'react';
import { Lock, Zap, Palette, Ban } from 'lucide-react';

const FinalCtaSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && sectionRef.current) {
          sectionRef.current.querySelectorAll('.cta-reveal').forEach((el, i) => {
            setTimeout(() => {
              (el as HTMLElement).style.opacity = '1';
              (el as HTMLElement).style.transform = 'translateY(0) scale(1)';
            }, i * 100);
          });
        }
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-28 relative overflow-hidden dark-section-bg noise-overlay"
    >
      {/* Wireframe grid dark */}
      <div className="wireframe-bg wireframe-bg-dark absolute inset-0 pointer-events-none" />

      {/* Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        {/* Badge */}
        <div
          className="cta-reveal inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
          style={{
            background: 'rgba(99,102,241,0.15)',
            border: '1px solid rgba(99,102,241,0.3)',
            opacity: 0,
            transform: 'translateY(24px) scale(0.97)',
            transition: 'all 0.7s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        >
          <span className="status-dot" />
          <span className="text-xs font-bold text-primary-300 uppercase tracking-widest">
            14-Day Free Trial
          </span>
        </div>

        {/* Headline */}
        <h2
          className="cta-reveal text-5xl md:text-6xl xl:text-7xl font-black text-white mb-6"
          style={{
            letterSpacing: '-0.04em',
            lineHeight: '0.9',
            opacity: 0,
            transform: 'translateY(28px) scale(0.97)',
            transition: 'all 0.8s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        >
          One portal.
          <br />
          <span className="gradient-text">Zero chaos.</span>
        </h2>

        <p
          className="cta-reveal text-xl text-gray-400 font-light leading-relaxed mb-12 max-w-2xl mx-auto"
          style={{
            opacity: 0,
            transform: 'translateY(24px)',
            transition: 'all 0.7s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        >
          Join 1,200+ agencies that replaced their fragmented tool stack with a single,
          beautiful client portal. Setup takes 15 minutes. The time savings are immediate.
        </p>

        {/* CTAs */}
        <div
          className="cta-reveal flex flex-wrap items-center justify-center gap-4"
          style={{
            opacity: 0,
            transform: 'translateY(24px)',
            transition: 'all 0.7s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        >
          <a
            href="/signup"
            className="btn-primary px-10 py-4 text-base inline-flex items-center gap-2"
          >
            Get Started Free — No Card Required
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-bold text-white transition-all duration-300 hover:bg-white/10"
            style={{ border: '1.5px solid rgba(255,255,255,0.2)' }}
          >
            View Live Demo
          </a>
        </div>

        {/* Trust row */}
        <div
          className="cta-reveal mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500"
          style={{
            opacity: 0,
            transform: 'translateY(20px)',
            transition: 'all 0.6s ease',
          }}
        >
          {[
            { icon: <Lock size={16} />, text: 'SOC 2 Compliant' },
            { icon: <Zap size={16} />, text: '15-min setup' },
            { icon: <Palette size={16} />, text: 'White-label ready' },
            { icon: <Ban size={16} />, text: 'No credit card' },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-2">
              <span>{item.icon}</span>
              <span className="font-medium text-gray-400">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FinalCtaSection;