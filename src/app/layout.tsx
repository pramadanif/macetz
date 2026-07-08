import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '../index.css';
import { Web3Provider } from '@/providers/Web3Provider';

const SITE_URL = 'https://www.macetz.web.id';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Macetz — Zama Wrappers Registry: Wrap, Decrypt & Faucet',
    template: '%s | Macetz — Zama Wrappers Registry',
  },
  description:
    'Macetz is the canonical dApp for the Zama Wrappers Registry. Wrap ERC-20 into confidential ERC-7984 tokens, decrypt balances via EIP-712, claim the Zama Sepolia faucet, and distribute confidential payroll — Sepolia + Ethereum mainnet.',
  applicationName: 'Macetz',
  keywords: [
    'Zama',
    'Zama faucet',
    'Zama wrapper',
    'Zama wrappers registry',
    'Zama Sepolia faucet',
    'confidential token',
    'ERC-7984',
    'ERC-7984 wrapper',
    'ERC-20 to ERC-7984',
    'confidential ERC-20 wrapper',
    'FHE',
    'FHEVM',
    'fully homomorphic encryption',
    'confidential tokens Ethereum',
    'wrap unwrap confidential token',
    'EIP-712 decrypt',
    'cUSDC',
    'cUSDCMock',
    'cTokenMock faucet',
    'confidential payroll',
    'TokenOps disperse',
    'Zama Developer Program',
    'Sepolia confidential token',
  ],
  authors: [{ name: 'pramadanif', url: 'https://github.com/pramadanif/macetz' }],
  creator: 'pramadanif',
  category: 'technology',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'Macetz — Zama Wrappers Registry',
    title: 'Macetz — Zama Wrappers Registry dApp: Wrap, Decrypt & Faucet',
    description:
      'Browse every official ERC-20 ↔ ERC-7984 pair, wrap and unwrap confidential tokens, decrypt any balance via EIP-712, and use the Zama Sepolia faucet — a production-ready Zama Wrappers Registry interface.',
    images: [
      {
        url: '/icons/logo.png',
        width: 1200,
        height: 630,
        alt: 'Macetz — the confidential wrapper registry for Zama ERC-7984 tokens',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Macetz — Zama Wrappers Registry: Wrap, Decrypt & Faucet',
    description:
      'The canonical dApp for the Zama Wrappers Registry — wrap ERC-20 into confidential ERC-7984, decrypt via EIP-712, and claim the Zama Sepolia faucet.',
    images: ['/icons/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-[#F5F4F0] text-[#16171C] font-telegraf selection:bg-yellow-200">
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}
