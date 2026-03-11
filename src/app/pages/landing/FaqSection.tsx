'use client';
import React, { useState, useRef, useEffect } from 'react';

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: 'Will my clients actually use this?',
    answer: "Yes — and that's the whole point. Portalwave is designed to be so simple that clients use it without training. No logins to remember (magic link access), no complex UI. They see their project, their files, and where to click to approve. Our data shows 89% of invited clients log in within 24 hours.",
  },
  {
    question: 'How does white-labeling work?',
    answer: "On Pro and Premium plans, you can fully white-label the portal with your agency's logo, brand colors, and even a custom domain (e.g., portal.youragency.com). Your clients never see the Portalwave name. It looks and feels like software you built yourself.",
  },
  {
    question: 'Is my client data secure?',
    answer: "Absolutely. All data is encrypted at rest (AES-256) and in transit (TLS 1.3). We're SOC 2 Type II compliant. Files are stored in isolated, access-controlled buckets. Client access is scoped strictly to their own portal — they can never see other clients' work.",
  },
  {
    question: 'How long does onboarding take?',
    answer: "Most agencies are up and running in under 30 minutes. You set up your portal, invite a client, and they're in. We provide onboarding templates, a migration guide if you're coming from another tool, and a dedicated success manager on Premium plans.",
  },
  {
    question: 'Can I migrate from my current tools?',
    answer: "Yes. We support importing projects from Trello, Asana, and Notion. For files, you can bulk-upload from Google Drive or Dropbox. Our migration team helps Premium customers with complex transitions at no extra cost.",
  },
  {
    question: 'What happens when I exceed my portal limit?',
    answer: "You'll get a notification when you're at 80% capacity. You can upgrade at any time with instant access to additional portals — no downtime. We never cut off access to existing clients mid-project.",
  },
];

const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && sectionRef.current) {
          sectionRef.current.querySelectorAll('.faq-reveal').forEach((el, i) => {
            setTimeout(() => {
              (el as HTMLElement).style.opacity = '1';
              (el as HTMLElement).style.transform = 'translateY(0)';
            }, i * 80);
          });
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="faq" ref={sectionRef} className="py-28 relative overflow-hidden bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Left: Header + contact */}
          <div
            className="faq-reveal lg:sticky lg:top-32 opacity-0 translate-y-7 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          >
            <div className="tag tag-primary w-fit mb-5">FAQ</div>
            <h2
              className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tighter"
            >
              Questions?
              <br />
              <span className="gradient-text">We've got answers.</span>
            </h2>
            <p className="text-xl text-gray-400 font-light leading-relaxed mb-8 max-w-md">
              Everything you need to know about switching your agency to Portalwave. Still not sure? Talk to a real person.
            </p>

            <a
              href="/signup"
              className="btn-secondary inline-flex items-center gap-2 px-7 py-3.5 text-sm"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 4a1 1 0 011-1h10a1 1 0 011 1v6a1 1 0 01-1 1H9l-3 2v-2H3a1 1 0 01-1-1V4z" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              Chat with our team
            </a>

            {/* Stat callout */}
            <div className="mt-10 glass-card p-6">
              <div className="flex items-start gap-4">
                <div className="text-3xl font-black text-indigo-600 tracking-tighter">4.9</div>
                <div>
                  <div className="flex gap-0.5 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill="#F59E0B">
                        <path d="M7 1l1.6 3.3L12 4.8l-2.5 2.4.6 3.4L7 8.9l-3.1 1.7.6-3.4L2 4.8l3.4-.5z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm font-semibold text-gray-900">Average rating on G2</p>
                  <p className="text-xs text-gray-400 mt-0.5">From 340+ verified agency reviews</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Accordion */}
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={faq.question}
                className="faq-reveal cursor-pointer  bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-indigo-200 transition-colors opacity-0 translate-y-6"
                style={{
                  transition: `opacity 0.6s cubic-bezier(0.34,1.56,0.64,1) ${i * 60}ms, transform 0.6s cubic-bezier(0.34,1.56,0.64,1) ${i * 60}ms, border-color 0.2s ease`,
                }}
              >
                <button
                  className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 cursor-pointer"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  aria-expanded={openIndex === i}
                >
                  <span className="text-sm font-bold text-gray-900 leading-snug">{faq.question}</span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${openIndex === i ? 'bg-indigo-600 rotate-[45deg]' : 'bg-gray-100 rotate-0'
                      }`}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M6 2v8M2 6h8"
                        stroke={openIndex === i ? 'white' : '#6B7280'}
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </button>

                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{ maxHeight: openIndex === i ? '400px' : '0' }}
                >
                  <div className="px-6 pb-5">
                    <p className="text-sm text-gray-500 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;