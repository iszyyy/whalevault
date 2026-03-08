import Link from "next/link"
import { Separator } from "@/components/ui/separator"

const footerLinks = {
  Product: [
    { href: "/#features", label: "Features" },
    { href: "/#pricing", label: "Pricing" },
    { href: "/docs", label: "Documentation" },
    { href: "/changelog", label: "Changelog" },
  ],
  Company: [
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
    { href: "/careers", label: "Careers" },
    { href: "/contact", label: "Contact" },
  ],
  Legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/cookies", label: "Cookie Policy" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-4">
              <span className="text-2xl">🐋</span>
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                WhaleVault
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Institutional-grade crypto whale intelligence. Track wallets, detect signals,
              and stay ahead of the market.
            </p>
            {/* Social links */}
            <div className="flex gap-4 mt-4">
              <a
                href="https://twitter.com/whalevault"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                aria-label="Twitter"
              >
                𝕏
              </a>
              <a
                href="https://github.com/whalevault"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                aria-label="GitHub"
              >
                GitHub
              </a>
              <a
                href="https://discord.gg/whalevault"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                aria-label="Discord"
              >
                Discord
              </a>
            </div>
          </div>

          {/* Link groups */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h3 className="text-sm font-semibold mb-3">{group}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} WhaleVault. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground max-w-md">
            <strong>Affiliate Disclosure:</strong> WhaleVault may earn commissions from affiliate
            links on this site. All information is for educational purposes only and does not
            constitute financial advice.
          </p>
        </div>
      </div>
    </footer>
  )
}
