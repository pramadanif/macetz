import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { FeaturesGrid } from '../components/FeaturesGrid';
import { ExtensibilitySection } from '../components/ExtensibilitySection';
import { UniversalDecryptSection } from '../components/UniversalDecryptSection';
import { ConfidentialDistribution } from '../components/ConfidentialDistribution';
import { HowItWorks } from '../components/HowItWorks';
import { SupportedAssets } from '../components/SupportedAssets';
import { KnownLimitations } from '../components/KnownLimitations';
import { CTAFooter } from '../components/CTAFooter';
import { Footer } from '../components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F5F4F0] text-[#16171C] font-telegraf selection:bg-yellow-200">
      <Header />
      <main className="overflow-hidden">
        <Hero />
        <FeaturesGrid />
        <ExtensibilitySection />
        <UniversalDecryptSection />
        <ConfidentialDistribution />
        <HowItWorks />
        <SupportedAssets />
        <KnownLimitations />
        <CTAFooter />
      </main>
      <Footer />
    </div>
  );
}
