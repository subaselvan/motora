import Link from "next/link";

const footerLinks = {
  Company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  Renters: [
    { label: "Find a vehicle", href: "/search" },
    { label: "FAQ", href: "/faq" },
    { label: "Help", href: "/help" },
  ],
  Owners: [
    { label: "Become a host", href: "/host-landing" },
  ],
  Legal: [
    { label: "Terms", href: "/terms" },
    { label: "Privacy", href: "/privacy" },
  ],
};

export function Footer() {
  return (
    <footer className="mt-auto border-t border-obsidian-lighter">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="font-heading text-sm font-semibold text-pearl">{heading}</h3>
              <ul className="mt-3 space-y-2">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-pearl-dim transition-colors hover:text-pearl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange rounded-sm"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-obsidian-lighter pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-pearl-muted">
            © {new Date().getFullYear()} MOTORA. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
