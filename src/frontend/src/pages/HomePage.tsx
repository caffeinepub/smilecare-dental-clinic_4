import { Link } from "@tanstack/react-router";
import { AlignJustify, ArrowRight, Layers, Sparkles } from "lucide-react";

const services = [
  {
    icon: Sparkles,
    name: "Cosmetic Dentistry",
    description:
      "Enhance your smile with veneers, bonding, and whitening treatments tailored to your aesthetic goals.",
  },
  {
    icon: Layers,
    name: "Dental Implants",
    description:
      "Permanent, natural-looking tooth replacements that restore both function and confidence.",
  },
  {
    icon: AlignJustify,
    name: "Orthodontics",
    description:
      "Braces and clear aligners to straighten teeth at every age, with discreet modern options available.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ===== Hero Section ===== */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.12 0.05 255) 0%, oklch(0.18 0.065 255) 45%, oklch(0.22 0.07 260) 100%)",
          minHeight: "clamp(520px, 80vh, 780px)",
        }}
      >
        {/* Subtle decorative ring */}
        <div
          className="absolute -right-32 -top-32 w-[600px] h-[600px] rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, oklch(0.44 0.105 130) 0%, transparent 65%)",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute -left-24 bottom-0 w-[400px] h-[400px] rounded-full opacity-5"
          style={{
            background:
              "radial-gradient(circle, oklch(0.96 0.025 99) 0%, transparent 65%)",
          }}
          aria-hidden="true"
        />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center py-28 lg:py-36">
          {/* Eyebrow */}
          <span className="eyebrow text-white/55 mb-8">
            Trusted Private Dental Practice
          </span>

          {/* Headline */}
          <h1 className="heading-display text-4xl sm:text-5xl lg:text-[3.75rem] xl:text-[4.25rem] text-white mb-7 animate-fade-up max-w-3xl">
            Expert Dental Care{" "}
            <em className="italic text-white/75">at VENUS</em>
          </h1>

          {/* Subheadline */}
          <p className="font-montserrat text-base sm:text-lg text-white/70 max-w-lg leading-[1.75] mb-11 font-light tracking-wide">
            Personalized, precise, and compassionate dental care for you and
            your family at VENUS Oral-Dental Care Clinic.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Link
              to="/book"
              className="inline-flex items-center gap-2 font-montserrat font-semibold text-sm px-8 py-3.5 rounded bg-olive text-white hover:bg-olive-dark transition-colors duration-150 tracking-wide"
              data-ocid="hero.book.primary_button"
            >
              Book Appointment
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center font-montserrat font-semibold text-sm px-8 py-3.5 rounded border border-white/50 text-white hover:bg-white/10 transition-colors duration-150 tracking-wide"
              data-ocid="hero.contact.secondary_button"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Clinic Intro Section ===== */}
      <section className="bg-beige py-24 lg:py-32">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="eyebrow text-olive mb-6">Our Philosophy</span>
          <h2 className="heading-section text-3xl lg:text-4xl text-navy mt-6 mb-10">
            About VENUS
          </h2>
          <div className="space-y-6 font-montserrat text-sm sm:text-[0.9375rem] text-charcoal leading-[1.85]">
            <p>
              At VENUS Oral-Dental Care Clinic, we believe that every patient
              deserves individualized attention. From the moment you walk in,
              our care is built around <em>you</em> — your comfort, your goals,
              and your timeline. We take time to listen before we treat.
            </p>
            <p>
              Our clinic is equipped with contemporary digital imaging,
              sterilization protocols that exceed standard requirements, and
              treatment chairs designed for extended comfort. Technology in
              service of precision — that is our standard.
            </p>
            <p>
              Hygiene is non-negotiable. Our protocols follow the strictest
              infection-control guidelines so that every visit is as safe as it
              is effective. We treat families, professionals, seniors, and
              children with equal care and equal respect.
            </p>
          </div>
          {/* Clinic waiting area photo */}
          <img
            src="/assets/uploads/image-1.png"
            alt="VENUS Oral-Dental Care Clinic waiting area"
            className="rounded-lg shadow-card w-full mt-10 object-cover"
            style={{ maxHeight: "320px" }}
          />
        </div>
      </section>

      {/* ===== Doctor Teaser ===== */}
      <section className="bg-white py-24 lg:py-32">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-[oklch(0.90_0.008_99)] rounded-lg shadow-card p-10 lg:p-14 flex flex-col items-center text-center">
            {/* Avatar */}
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-white font-playfair text-2xl font-semibold mb-6 ring-4 ring-white ring-offset-4 ring-offset-beige shadow-card-xl"
              style={{ background: "oklch(0.18 0.065 255)" }}
              aria-label="Doctor initials"
            >
              DR
            </div>

            {/* Name & credentials */}
            <h3 className="heading-card text-xl text-navy mb-1">
              Our Expert Team
            </h3>
            <p className="font-montserrat text-xs font-medium tracking-[0.12em] uppercase text-olive mb-4">
              VENUS Oral-Dental Care Clinic
            </p>
            <p className="font-montserrat text-sm text-charcoal leading-relaxed max-w-sm mb-6">
              Our experienced dental professionals bring precision and warmth to
              every consultation, ensuring you receive the best possible care.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-1.5 font-montserrat text-sm font-semibold text-navy hover:text-olive transition-colors"
              data-ocid="home.doctor.link"
            >
              Learn More About Our Team
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Services Snapshot ===== */}
      <section className="bg-beige py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="eyebrow text-olive">What We Offer</span>
            <h2 className="heading-section text-3xl lg:text-4xl text-navy mt-6 mb-4">
              Our Core Services
            </h2>
            <p className="font-montserrat text-sm text-charcoal-light max-w-md mx-auto leading-relaxed">
              From preventive care to smile transformations, we cover the full
              spectrum of modern dentistry.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-7">
            {services.map((svc, i) => {
              const Icon = svc.icon;
              return (
                <div
                  key={svc.name}
                  className="group bg-white border border-navy/10 hover:border-olive/30 rounded-lg p-8 flex flex-col items-start shadow-card hover:shadow-card-hover card-luxury"
                  data-ocid={`home.services.card.${i + 1}`}
                >
                  <span className="icon-badge w-12 h-12 rounded-lg mb-5">
                    <Icon className="w-5 h-5 text-olive" />
                  </span>
                  <h3 className="heading-card text-lg text-navy mb-3">
                    {svc.name}
                  </h3>
                  <p className="font-montserrat text-sm text-charcoal leading-[1.8]">
                    {svc.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 font-montserrat text-sm font-semibold text-navy hover:text-olive transition-colors"
            >
              View All Services
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== CTA Banner ===== */}
      <section
        className="py-20 lg:py-28 text-center"
        style={{
          background: "oklch(0.18 0.065 255)",
        }}
      >
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <h2 className="heading-section text-2xl lg:text-3xl text-white mb-5">
            Ready to book your visit?
          </h2>
          <p className="font-montserrat text-sm text-white/70 mb-8">
            We respond to all appointment requests within 24 hours.
          </p>
          <Link
            to="/book"
            className="inline-flex items-center gap-2 font-montserrat font-semibold text-sm px-8 py-3.5 rounded bg-olive text-white hover:bg-olive-dark transition-colors duration-150 tracking-wide"
          >
            Schedule My Appointment
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
