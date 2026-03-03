'use client';
import React, { useState, useRef, useEffect } from 'react';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  features: PlanFeature[];
  cta: string;
  popular: boolean;
  badge?: string;
}

const plans: Plan[] = [
  {
    name: 'Basic',
    monthlyPrice: 19.99,
    yearlyPrice: 290,
    description: 'Perfect for solo freelancers managing a handful of clients.',
    features: [
      { text: 'Up to 5 client portals', included: true },
      { text: 'Unlimited file sharing', included: true },
      { text: 'Client feedback & comments', included: true },
      { text: 'Basic project tracking', included: true },
      { text: 'White-label branding', included: false },
      { text: 'Custom domain', included: false },
      { text: 'Priority support', included: false },
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Pro',
    monthlyPrice: 39.99,
    yearlyPrice: 380,
    description: 'For growing agencies serious about client experience.',
    features: [
      { text: 'Up to 20 client portals', included: true },
      { text: 'Unlimited file sharing', included: true },
      { text: 'Client feedback & approvals', included: true },
      { text: 'Advanced project tracking', included: true },
      { text: 'White-label branding', included: true },
      { text: 'Custom domain', included: true },
      { text: 'Priority support', included: false },
    ],
    cta: 'Start Free Trial',
    popular: true,
    badge: 'Most Popular',
  },
  {
    name: 'Premium',
    monthlyPrice: 69.99,
    yearlyPrice: 680,
    description: 'For established agencies with high-volume client work.',
    features: [
      { text: 'Unlimited client portals', included: true },
      { text: 'Unlimited file sharing', included: true },
      { text: 'Client feedback & approvals', included: true },
      { text: 'Advanced project tracking', included: true },
      { text: 'White-label branding', included: true },
      { text: 'Custom domain', included: true },
      { text: 'Priority support', included: true },
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
];

const PricingSection: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [animatingPrices, setAnimatingPrices] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setAnimatingPrices(true);
    setTimeout(() => {
      setIsYearly((prev) => !prev);
      setAnimatingPrices(false);
    }, 180);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && sectionRef.current) {
          sectionRef.current.querySelectorAll('.pricing-reveal').forEach((el, i) => {
            setTimeout(() => {
              (el as HTMLElement).style.opacity = '1';
              (el as HTMLElement).style.transform = 'translateY(0)';
            }, i * 120);
          });
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const getYearlySavings = (plan: Plan) => {
    const monthlyCost = plan.monthlyPrice * 12;
    const savings = monthlyCost - plan.yearlyPrice;
    return Math.round(savings);
  };

  return (
    <section id="pricing" ref={sectionRef} className="py-28 bg-white relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(99,102,241,0.05) 0%, transparent 100%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="tag tag-primary w-fit mx-auto mb-5">Pricing</div>
          <h2
            className="text-4xl md:text-5xl font-black text-gray-900 mb-5"
            style={{ letterSpacing: '-0.03em' }}
          >
            Pricing that scales
            <br />
            <span className="gradient-text">with your agency.</span>
          </h2>
          <p className="text-xl text-gray-400 font-light max-w-lg mx-auto mb-10">
            Start free, upgrade when you're ready. Every plan includes a 14-day trial.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-4 bg-gray-100 rounded-full p-1.5 border border-gray-200">
            <button
              onClick={() => isYearly && handleToggle()}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${!isYearly
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-400 hover:text-gray-600'
                }`}
            >
              Monthly
            </button>
            <button
              onClick={() => !isYearly && handleToggle()}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${isYearly
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-400 hover:text-gray-600'
                }`}
            >
              Yearly
              <span className="text-xs bg-success px-2 py-0.5 rounded-full font-semibold">
                Save up to 20%
              </span>
            </button>
          </div>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start cursor-pointer">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={`pricing-reveal rounded-4xl p-8 border relative transition-all duration-500 ${plan.popular
                  ? 'pricing-popular bg-white' : 'bg-white border-gray-100 hover:border-primary-200 hover:shadow-primary-sm'
                }`}
              style={{
                opacity: 0,
                transform: 'translateY(32px)',
                transition: 'opacity 0.7s cubic-bezier(0.34,1.56,0.64,1), transform 0.7s cubic-bezier(0.34,1.56,0.64,1)',
              }}
            >
              {/* Popular badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary-600  text-xs font-black px-5 py-1.5 rounded-full shadow-primary-sm uppercase tracking-wider">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan header */}
              <div className="mb-7">
                <h3 className="text-lg font-black text-gray-900 mb-1" style={{ letterSpacing: '-0.02em' }}>
                  {plan.name}
                </h3>
                <p className="text-sm text-gray-400 font-light leading-relaxed">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-7">
                <div
                  className="flex items-baseline gap-1.5"
                  style={{
                    opacity: animatingPrices ? 0 : 1,
                    transform: animatingPrices ? 'translateY(-8px)' : 'translateY(0)',
                    transition: 'opacity 0.18s ease, transform 0.18s ease',
                  }}
                >
                  <span className="text-4xl font-black text-gray-900" style={{ letterSpacing: '-0.04em' }}>
                    ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                  </span>
                  <span className="text-gray-400 font-light text-sm">
                    /{isYearly ? 'year' : 'month'}
                  </span>
                </div>
                {isYearly && (
                  <p className="text-sm text-success font-semibold mt-1">
                    Save ${getYearlySavings(plan)} vs monthly
                  </p>
                )}
              </div>

              {/* CTA */}
              <a
                href="/signup"
                className={`block text-center py-3.5 px-6 rounded-full text-sm font-bold transition-all duration-300 mb-7 ${plan.popular
                    ? 'btn-primary' : 'border-2 border-gray-200 text-gray-700 hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50'
                  }`}
              >
                {plan.cta}
              </a>

              {/* Divider */}
              <div className="h-px bg-gray-100 mb-7" />

              {/* Features */}
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature.text} className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${feature.included ? 'bg-primary-100' : 'bg-gray-100'
                        }`}
                    >
                      {feature.included ? (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5l2 2 4-4" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path d="M2 2l4 4M6 2L2 6" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      )}
                    </div>
                    <span
                      className={`text-sm ${feature.included ? 'text-gray-700 font-medium' : 'text-gray-400'
                        }`}
                    >
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="text-center text-sm text-gray-400 mt-10">
          All plans include 14-day free trial · No credit card required · Cancel anytime
        </p>
      </div>
    </section>
  );
};

export default PricingSection;