import React from 'react';
import Header from './landing/Header';
import Footer from './landing/Footer';
import HeroSection from './landing/HeroSection';
import ProblemSolutionSection from './landing/ProblemSolutionSection';
import FeaturesSection from './landing/FeaturesSection';
import PricingSection from './landing/PricingSection';
import FaqSection from './landing/FaqSection';
import FinalCtaSection from './landing/FinalCtaSection';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-brand-bg overflow-x-hidden">
      <Header />
      <HeroSection />
      <ProblemSolutionSection />
      <FeaturesSection />
      <PricingSection />
      <FaqSection />
      <FinalCtaSection />
      <Footer />
    </main>
  );
}