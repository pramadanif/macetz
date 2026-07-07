import React from "react";
import { ArrowUpRight } from "lucide-react";

type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

type FooterColumn = {
  title: string;
  links: FooterLink[];
};

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Product",
    links: [
      { label: "Launch App", href: "/app" },
      { label: "Registry Browser", href: "#registry" },
      { label: "Universal Decrypt", href: "#decrypt" },
      { label: "Confidential Distribution", href: "#distribute" },
      { label: "Extensibility", href: "#extensibility" },
    ],
  },
  {
    title: "Repository",
    links: [
      { label: "GitHub", href: "https://github.com/pramadanif/macetz", external: true },
      { label: "README", href: "https://github.com/pramadanif/macetz#readme", external: true },
      { label: "Deploy Your Own Pair", href: "https://github.com/pramadanif/macetz/tree/main/dev-guide", external: true },
      { label: "MIT License", href: "https://github.com/pramadanif/macetz/blob/main/LICENSE", external: true },
    ],
  },
  {
    title: "Onchain",
    links: [
      {
        label: "Registry (Sepolia)",
        href: "https://sepolia.etherscan.io/address/0x2f0750Bbb0A246059d80e94c454586a7F27a128e",
        external: true,
      },
      {
        label: "Registry (Mainnet)",
        href: "https://etherscan.io/address/0xeb5015fF021DB115aCe010f23F55C2591059bBA0",
        external: true,
      },
      {
        label: "TokenOps Disperse Singleton",
        href: "https://sepolia.etherscan.io/address/0x710dD9885Cc9986EfD234E7719483147a6d8DBb4",
        external: true,
      },
    ],
  },
  {
    title: "Ecosystem",
    links: [
      { label: "Zama", href: "https://www.zama.ai", external: true },
      { label: "Zama Docs", href: "https://docs.zama.ai", external: true },
      { label: "Developer Program", href: "https://www.zama.ai/programs/developer-program", external: true },
    ],
  },
];

function FooterLinkItem({ link }: { link: FooterLink }) {
  return (
    <a
      href={link.href}
      className="inline-flex items-center gap-1 text-sm text-[#16171C] hover:text-[#16171C]/70 transition-colors"
      {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {link.label}
      {link.external ? (
        <ArrowUpRight className="w-3.5 h-3.5 shrink-0 opacity-70" strokeWidth={2} />
      ) : null}
    </a>
  );
}

export function Footer() {
  return (
    <footer className="site-footer bg-[#f1f1ef] border-t border-[#e5e5e3]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-14 pb-0">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 mb-10 lg:mb-14">
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#16171C] mb-4">
                {column.title}
              </h3>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <FooterLinkItem link={link} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-brand-wrap overflow-hidden pointer-events-none select-none">
          <p className="footer-brand-watermark" aria-hidden="true">
            macetz
          </p>
        </div>

        <div className="border-t border-[#e5e5e3] mt-2 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#16171C]">
            {[
              { label: "Registry", href: "#registry" },
              { label: "Decrypt", href: "#decrypt" },
              { label: "Distribute", href: "#distribute" },
              { label: "Docs", href: "https://docs.zama.ai" },
              { label: "GitHub", href: "https://github.com/pramadanif/macetz" },
            ].map((link) => (
              <a key={link.label} href={link.href} className="hover:text-[#16171C]/70 transition-colors">
                {link.label}
              </a>
            ))}
          </div>
          <p className="text-xs text-[#6B7280] max-w-xl leading-relaxed">
            Open source · Unaudited · Built for Zama Developer Program Season 3 ·
            Use at your own risk on Sepolia testnet
          </p>
        </div>
      </div>
    </footer>
  );
}
