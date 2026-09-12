import Link from "next/link";

const footerLinks = {
  Company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  Renters: [
    { label: "Ride & Drive", href: "/search?track=ride-drive" },
    { label: "Heavy & Farm", href: "/search?track=heavy-farm" },
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
    <footer className="mt-auto border-t border-charcoal-1">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="font-heading text-sm font-medium text-pearl">{heading}</h3>
              <ul className="mt-3 space-y-2">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="rounded-[var(--radius-sm)] text-sm text-pearl-dim transition-colors hover:text-pearl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-charcoal-1 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-pearl-muted">
            © {new Date().getFullYear()} MOTORA. All rights reserved.
          </p>
          <p className="text-xs text-pearl-muted">
            Preview build — no real bookings or payments are processed.
          </p>
        </div>
      </div>
    </footer>
  );
}
