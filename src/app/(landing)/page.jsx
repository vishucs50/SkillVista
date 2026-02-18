'use client';
import './landing.css';
import Hero from '@/components/landing/Hero';
import FeaturesGrid from '@/components/landing/FeatureGrid';
import Footer from '@/components/landing/Footer';
import ProfessionalStage from '@/components/landing/ProfessionalStage';
import ScrollReveal from '@/components/landing/ScrollReveal';
import HowItWorks from '@/components/landing/HowItWorks';
import Navbar from '@/components/landing/Navbar';
export default function Page() {
  return (
    <>
      <Navbar/>
      <main className="relative pt-32  overflow-hidden">

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-150 bg-linear-to-b from-primary/20 to-transparent blur-[120px] pointer-events-none opacity-40"></div>

        <ScrollReveal className="relative z-10">
          <Hero />
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <FeaturesGrid />
        </ScrollReveal>

        <ScrollReveal delay={150}>
          <HowItWorks/>
        </ScrollReveal>

        <ScrollReveal delay={150}>
          <ProfessionalStage/>
        </ScrollReveal>
      </main>

      <ScrollReveal delay={150}>
        <Footer/>
      </ScrollReveal>
    </>
  );
}
