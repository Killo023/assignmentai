import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/landing/Hero';
import FeaturesGrid from '@/components/landing/FeaturesGrid';
import HowItWorks from '@/components/landing/HowItWorks';
import Testimonials from '@/components/landing/Testimonials';
import PricingCard from '@/components/landing/PricingCard';
import FAQ from '@/components/landing/FAQ';
import FinalCTA from '@/components/landing/FinalCTA';

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <Hero />
        <section id="features">
          <FeaturesGrid />
        </section>
        <HowItWorks />
        <Testimonials />
        <section id="pricing">
          <PricingCard />
        </section>
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
} 