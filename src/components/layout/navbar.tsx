"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  User,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_CONFIG, ROUTES } from "@/lib/constants";

const NAV_LINKS = [
  { label: "Explore", href: ROUTES.EXPLORE },
  { label: "Experiences", href: ROUTES.EXPERIENCE },
  { label: "What-If", href: ROUTES.WHAT_IF },
  { label: "My Journey", href: ROUTES.JOURNEY },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/95 backdrop-blur-xs transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-10">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-primary transition-transform active:scale-[0.99]"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-white shadow-xs">
            <Compass className="size-5" />
          </span>
          <span className="text-foreground">{APP_CONFIG.name}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-all duration-150 active:scale-[0.99] pb-1",
                  isActive
                    ? "border-b-2 border-primary text-primary font-semibold"
                    : "text-muted-foreground hover:text-primary"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Trailing Action: Profile */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href={ROUTES.DASHBOARD}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border hover:border-primary transition-colors text-foreground text-sm font-medium active:scale-[0.99]"
          >
            <span className="flex size-7 items-center justify-center rounded-full bg-slate-100 text-primary">
              <User className="size-4" />
            </span>
            <span>Profile</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href={ROUTES.DASHBOARD}
            className="flex size-8 items-center justify-center rounded-lg border border-border text-foreground"
            aria-label="Profile"
          >
            <User className="size-4 text-primary" />
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex size-9 items-center justify-center rounded-lg border border-border text-foreground hover:bg-slate-50"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-white px-6 py-4 shadow-sm animate-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2 text-sm font-medium text-foreground hover:text-primary border-b border-slate-100 last:border-0"
              >
                <span>{link.label}</span>
              </Link>
            ))}
            <div className="pt-2">
              <Link
                href={ROUTES.DASHBOARD}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-primary text-white font-medium text-sm shadow-xs"
              >
                <User className="size-4" />
                <span>Go to Student Profile</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
