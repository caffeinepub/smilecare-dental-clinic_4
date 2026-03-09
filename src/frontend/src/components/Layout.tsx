import { Link, useLocation } from "@tanstack/react-router";
import { LogOut, Mail, MapPin, Menu, Phone, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Role } from "../backend";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useRole } from "../hooks/useRole";

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
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const { identity, clear } = useInternetIdentity();
  const { actor, isFetching } = useActor();
  const { role } = useRole();

  const isLoggedIn = !!identity;
  const dashboardTo = role === Role.doctor ? "/doctor" : "/patient";
  const dashboardLabel = role === Role.doctor ? "Dashboard" : "My Dashboard";

  function handleLogout() {
    clear();
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally resets on pathname change only
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!identity || !actor) {
      setIsAdmin(false);
      return;
    }
    actor
      .isCallerAdmin()
      .then((result) => {
        setIsAdmin(result);
      })
      .catch(() => {
        setIsAdmin(false);
      });
  }, [identity, actor]);

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
            <img
              src="/assets/uploads/IMG_5920-2.PNG"
              alt="VENUS Oral-Dental Care Clinic"
              className="h-10 w-auto"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = "none";
                const fallback =
                  target.nextElementSibling as HTMLElement | null;
                if (fallback) fallback.style.display = "block";
              }}
            />
            <span
              className="font-playfair text-navy font-semibold text-lg lg:text-xl tracking-tight leading-tight"
              style={{ display: "none" }}
            >
              VENUS
              <span className="block text-xs font-montserrat font-medium tracking-[0.12em] text-charcoal-light uppercase">
                Oral Dental Care
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
            {isAdmin && (
              <Link
                to="/admin"
                className={`font-montserrat text-sm font-medium px-3 py-2 rounded transition-colors duration-150 ${
                  location.pathname === "/admin"
                    ? "text-navy font-semibold"
                    : "text-charcoal hover:text-navy"
                }`}
                data-ocid="nav.admin.link"
              >
                Admin
              </Link>
            )}
          </nav>

          {/* CTA + Mobile toggle */}
          <div className="flex items-center gap-2 lg:gap-3">
            <Link
              to="/book"
              className="hidden lg:inline-flex items-center justify-center font-montserrat text-sm font-semibold px-5 py-2.5 rounded bg-olive text-white hover:bg-olive-dark transition-colors duration-150 tracking-wide"
              data-ocid="nav.book.primary_button"
            >
              Book Appointment
            </Link>

            {/* Auth button */}
            {!isFetching &&
              (isLoggedIn ? (
                <div className="hidden lg:flex items-center gap-2">
                  <Link
                    to={dashboardTo}
                    className="inline-flex items-center gap-1.5 font-montserrat text-sm font-medium px-4 py-2 rounded border border-[oklch(0.90_0.008_99)] text-navy hover:bg-beige transition-colors"
                    data-ocid="nav.dashboard.link"
                  >
                    <User className="w-4 h-4" />
                    {dashboardLabel}
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center justify-center w-9 h-9 rounded border border-[oklch(0.90_0.008_99)] text-charcoal-light hover:text-navy hover:bg-beige transition-colors"
                    aria-label="Sign out"
                    data-ocid="nav.logout.button"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden lg:inline-flex items-center gap-1.5 font-montserrat text-sm font-medium px-4 py-2 rounded border border-[oklch(0.90_0.008_99)] text-navy hover:bg-beige transition-colors"
                  data-ocid="nav.login.link"
                >
                  <User className="w-4 h-4" />
                  Login
                </Link>
              ))}

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

            {isAdmin && (
              <Link
                to="/admin"
                className={`font-montserrat text-sm font-medium px-3 py-3 rounded transition-colors ${
                  location.pathname === "/admin"
                    ? "text-navy font-semibold bg-beige"
                    : "text-charcoal hover:text-navy hover:bg-beige"
                }`}
                data-ocid="nav.mobile.admin.link"
              >
                Admin
              </Link>
            )}

            {/* Mobile auth links */}
            {!isFetching &&
              (isLoggedIn ? (
                <>
                  <Link
                    to={dashboardTo}
                    className="flex items-center gap-2 mt-1 font-montserrat text-sm font-medium px-3 py-3 rounded text-charcoal hover:text-navy hover:bg-beige transition-colors"
                    data-ocid="nav.mobile.dashboard.link"
                  >
                    <User className="w-4 h-4" />
                    {dashboardLabel}
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-2 font-montserrat text-sm font-medium px-3 py-3 rounded text-charcoal-light hover:text-navy hover:bg-beige transition-colors text-left"
                    data-ocid="nav.mobile.logout.button"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 mt-1 font-montserrat text-sm font-medium px-3 py-3 rounded text-charcoal hover:text-navy hover:bg-beige transition-colors"
                  data-ocid="nav.mobile.login.link"
                >
                  <User className="w-4 h-4" />
                  Login
                </Link>
              ))}
          </nav>
        </div>
      )}
    </header>
  );
}

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
          {/* Column 1 — Brand */}
          <div>
            <h3 className="heading-card text-xl text-white mb-4">
              VENUS Oral-Dental Care Clinic
            </h3>
            <p className="font-montserrat text-sm text-white/70 leading-relaxed">
              Delivering expert, gentle dental care with precision and
              compassion.
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
                  14 Vikas Khand, Gomti Nagar,
                  <br />
                  Lucknow, Uttar Pradesh – 226010
                </address>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-olive-light flex-shrink-0" />
                <a
                  href="tel:+919616604805"
                  className="font-montserrat text-sm text-white/80 hover:text-white transition-colors"
                >
                  +91 96166 04805
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-4 h-4 flex-shrink-0 text-[#25D366]">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    role="img"
                    aria-label="WhatsApp"
                  >
                    <title>WhatsApp</title>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </span>
                <a
                  href="https://wa.me/919616604805"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-montserrat text-sm text-white/80 hover:text-white transition-colors flex items-center gap-2"
                  data-ocid="footer.whatsapp.button"
                >
                  Chat on WhatsApp
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-olive-light flex-shrink-0" />
                <a
                  href="mailto:info@venusdental.com"
                  className="font-montserrat text-sm text-white/80 hover:text-white transition-colors"
                >
                  info@venusdental.com
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

        <div className="mt-12 pt-6 border-t border-white/10 flex items-center justify-center">
          <p className="font-montserrat text-xs text-white/50">
            © {year} VENUS Oral-Dental Care Clinic. All rights reserved.
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
