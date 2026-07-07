import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Launch the dApp — Wrap, Unwrap, Decrypt & Faucet',
  description:
    'Open the Macetz dApp: browse the on-chain Zama Wrappers Registry, wrap ERC-20 into confidential ERC-7984 tokens, decrypt any balance via EIP-712, claim the Zama Sepolia cTokenMock faucet, and run confidential payroll.',
  alternates: {
    canonical: '/app',
  },
  openGraph: {
    title: 'Macetz dApp — Zama Wrappers Registry: Wrap, Decrypt & Faucet',
    description:
      'Wrap, unwrap, and decrypt confidential ERC-7984 tokens, plus the Zama Sepolia faucet — all in one dApp.',
    url: 'https://macetz.vercel.app/app',
  },
};

export default function AppLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
