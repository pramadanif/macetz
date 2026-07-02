import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { HowItWorks } from '../components/HowItWorks';
import { FeaturesGrid } from '../components/FeaturesGrid';
import { ConfidentialDistribution } from '../components/ConfidentialDistribution';
import { NetworkActivity } from '../components/NetworkActivity';
import { SupportedAssets } from '../components/SupportedAssets';
import { DeveloperSection } from '../components/DeveloperSection';
import { CTAFooter } from '../components/CTAFooter';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F5F4F0] text-[#16171C] font-sans selection:bg-yellow-200">
      <Header />
      <main className="overflow-hidden">
        <Hero />
        <HowItWorks />
        <FeaturesGrid />
        <ConfidentialDistribution />
        <NetworkActivity />
        <SupportedAssets />
        <DeveloperSection />
      </main>
      <CTAFooter />
    </div>
  );
}