import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '../index.css';
import { Web3Provider } from '@/providers/Web3Provider';

export const metadata: Metadata = {
  title: 'Macetz',
  description: 'Confidential wrappers, encrypted distributions, and onchain payroll tooling.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F5F4F0] text-[#16171C] font-telegraf selection:bg-yellow-200">
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}