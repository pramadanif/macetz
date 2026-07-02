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
    title: "Protocol",
    links: [
      { label: "Macetz App", href: "#", external: true },
      { label: "Wrapper Registry", href: "#" },
      { label: "ERC-7984 Bridge", href: "#", external: true },
      { label: "Shielded Report", href: "#" },
      { label: "Litepaper", href: "#", external: true },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Confidential RWA", href: "#" },
      { label: "Confidential Payments", href: "#" },
      { label: "Confidential Payroll", href: "#" },
      { label: "Confidential DeFi", href: "#" },
      { label: "Token Distribution", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Developer Hub", href: "#" },
      { label: "Documentation", href: "#", external: true },
      { label: "Github", href: "#", external: true },
      { label: "Research Papers", href: "#", external: true },
      { label: "Introduction to FHE", href: "#" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "X", href: "#", external: true },
      { label: "Telegram", href: "#", external: true },
      { label: "LinkedIn", href: "#", external: true },
      { label: "Events", href: "#" },
      { label: "All Channels", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Jobs", href: "#", external: true },
      { label: "Press & Media", href: "#" },
      { label: "Brand Kit", href: "#" },
      { label: "Legal", href: "#" },
      { label: "Cookie Preferences", href: "#" },
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-10 mb-10 lg:mb-14">
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
      </div>
    </footer>
  );
}
