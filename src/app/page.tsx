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

const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Macetz — Zama Wrappers Registry',
  url: 'https://www.macetz.web.id',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  description:
    'Macetz is the canonical dApp for the Zama Wrappers Registry: wrap ERC-20 into confidential ERC-7984 tokens, decrypt balances via EIP-712, use the Zama Sepolia faucet, and run confidential payroll on Sepolia and Ethereum mainnet.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  keywords:
    'Zama, Zama faucet, Zama wrapper, Zama Wrappers Registry, ERC-7984, confidential token, FHE, FHEVM, EIP-712 decrypt, confidential payroll',
  creator: { '@type': 'Person', name: 'pramadanif', url: 'https://github.com/pramadanif/macetz' },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F5F4F0] text-[#16171C] font-telegraf selection:bg-yellow-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
      />
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
