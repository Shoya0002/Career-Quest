import Link from "next/link";
import { APP_CONFIG, ROUTES } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-slate-50/60 mt-auto">
      <div className="mx-auto flex w-full max-w-7xl flex-col md:flex-row justify-between items-center gap-6 px-6 md:px-10 py-12">
        {/* Logo and Copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-primary transition-opacity hover:opacity-90"
          >
            {APP_CONFIG.name}
          </Link>
          <span className="hidden sm:inline text-border">|</span>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} {APP_CONFIG.name}. All rights reserved.
          </p>
        </div>

        {/* Footer Navigation Links */}
        <nav className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <Link
            href={ROUTES.EXPLORE}
            className="hover:text-primary transition-colors duration-150"
          >
            Pathway Explorer
          </Link>
          <Link
            href="/#parent-partnership"
            className="hover:text-primary transition-colors duration-150"
          >
            Parent Guidance
          </Link>
          <Link
            href={ROUTES.EXPERIENCE}
            className="hover:text-primary transition-colors duration-150"
          >
            Experience Lab
          </Link>
          <Link
            href={ROUTES.WHAT_IF}
            className="hover:text-primary transition-colors duration-150"
          >
            What-If Simulator
          </Link>
          <Link
            href={ROUTES.JOURNEY}
            className="hover:text-primary transition-colors duration-150"
          >
            Decision Matrix
          </Link>
        </nav>
      </div>
    </footer>
  );
}
