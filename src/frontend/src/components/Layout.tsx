import { Link, useLocation } from "@tanstack/react-router";
import { Heart, Mail, MapPin, Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Book Appointment", to: "/book" },
  { label: "Testimonials", to: "/testimonials" },
  { label: "Contact", to: "/contact" },
];

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on navigation
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally resets on pathname change only
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white transition-shadow duration-200 ${
        scrolled ? "shadow-nav" : "border-b border-[oklch(0.90_0.008_99)]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex-shrink-0 group"
            data-ocid="nav.home.link"
          >
            <span className="font-playfair text-navy font-semibold text-lg lg:text-xl tracking-tight leading-tight">
              SmileCare
              <span className="block text-xs font-montserrat font-medium tracking-[0.12em] text-charcoal-light uppercase">
                Dental Clinic
              </span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isBook = link.label === "Book Appointment";
              const isActive = location.pathname === link.to;
              if (isBook) return null;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`font-montserrat text-sm font-medium px-3 py-2 rounded transition-colors duration-150 ${
                    isActive
                      ? "text-navy font-semibold"
                      : "text-charcoal hover:text-navy"
                  }`}
                  data-ocid={`nav.${link.label.toLowerCase().replace(/\s+/g, "")}.link`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* CTA + Mobile toggle */}
          <div className="flex items-center gap-3">
            <Link
              to="/book"
              className="hidden lg:inline-flex items-center justify-center font-montserrat text-sm font-semibold px-5 py-2.5 rounded bg-olive text-white hover:bg-olive-dark transition-colors duration-150 tracking-wide"
              data-ocid="nav.book.primary_button"
            >
              Book Appointment
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded text-navy hover:bg-beige transition-colors"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              data-ocid="nav.mobile.toggle"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-[oklch(0.90_0.008_99)] bg-white">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => {
              const isBook = link.label === "Book Appointment";
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`font-montserrat text-sm font-medium px-3 py-3 rounded transition-colors ${
                    isBook
                      ? "mt-2 bg-olive text-white text-center font-semibold hover:bg-olive-dark"
                      : isActive
                        ? "text-navy font-semibold bg-beige"
                        : "text-charcoal hover:text-navy hover:bg-beige"
                  }`}
                  data-ocid={`nav.${link.label.toLowerCase().replace(/\s+/g, "")}.link`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined"
      ? window.location.hostname
      : "smilecaredental.com";

  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
          {/* Column 1 — Brand */}
          <div>
            <h3 className="heading-card text-xl text-white mb-4">
              SmileCare Dental Clinic
            </h3>
            <p className="font-montserrat text-sm text-white/70 leading-relaxed">
              {/* PLACEHOLDER: Update with clinic tagline */}
              Delivering expert, gentle dental care to families across Lucknow
              with precision and compassion.
            </p>
          </div>

          {/* Column 2 — Contact */}
          <div>
            <h4 className="font-montserrat text-xs font-semibold tracking-[0.14em] uppercase text-white/50 mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-olive-light mt-0.5 flex-shrink-0" />
                <address className="font-montserrat text-sm text-white/80 not-italic leading-relaxed">
                  {/* PLACEHOLDER: Update clinic address */}
                  14 Vikas Khand, Gomti Nagar,
                  <br />
                  Lucknow, Uttar Pradesh – 226010
                </address>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-olive-light flex-shrink-0" />
                <a
                  href="tel:+919876543210"
                  className="font-montserrat text-sm text-white/80 hover:text-white transition-colors"
                >
                  {/* PLACEHOLDER: Update phone number */}
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-olive-light flex-shrink-0" />
                <a
                  href="mailto:info@smilecaredental.com"
                  className="font-montserrat text-sm text-white/80 hover:text-white transition-colors"
                >
                  {/* PLACEHOLDER: Update email address */}
                  info@smilecaredental.com
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 — Hours */}
          <div>
            <h4 className="font-montserrat text-xs font-semibold tracking-[0.14em] uppercase text-white/50 mb-4">
              Clinic Hours
            </h4>
            <ul className="space-y-2 font-montserrat text-sm text-white/80">
              {/* PLACEHOLDER: Update clinic hours */}
              <li className="flex justify-between gap-4">
                <span>Mon – Sat</span>
                <span>9:00 AM – 7:00 PM</span>
              </li>
              <li className="flex justify-between gap-4">
                <span>Sunday</span>
                <span>10:00 AM – 2:00 PM</span>
              </li>
            </ul>
            <div className="mt-5 pt-5 border-t border-white/10">
              <Link
                to="/book"
                className="inline-flex font-montserrat text-sm font-semibold text-olive-light hover:text-white transition-colors"
              >
                Book an Appointment →
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-montserrat text-xs text-white/50">
            {/* PLACEHOLDER: Update clinic name in copyright */}© {year}{" "}
            SmileCare Dental Clinic. All rights reserved.
          </p>
          <p className="font-montserrat text-xs text-white/50 flex items-center gap-1">
            Built with{" "}
            <Heart className="w-3 h-3 text-olive-light fill-olive-light" />{" "}
            using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors underline underline-offset-2"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
