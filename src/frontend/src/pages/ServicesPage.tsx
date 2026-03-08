import { Link } from "@tanstack/react-router";
import {
  AlignJustify,
  ArrowRight,
  ClipboardCheck,
  Gem,
  Layers,
  Sparkles,
  Zap,
} from "lucide-react";

const services = [
  {
    icon: ClipboardCheck,
    name: "Routine Checkups & Cleanings",
    description:
      "Regular dental examinations and professional cleanings are the foundation of lasting oral health. We conduct thorough assessments of gum health, bite alignment, and early signs of decay — catching problems before they escalate into costly treatment.",
  },
  {
    icon: Layers,
    name: "Dental Implants",
    description:
      "Implants are the gold standard for replacing missing teeth. A titanium post is placed in the jawbone, topped with a lifelike crown that functions and feels like a natural tooth. We offer single-tooth and full-arch restoration options.",
  },
  {
    icon: Sparkles,
    name: "Teeth Whitening",
    description:
      "Our professional-grade whitening treatments deliver noticeably brighter results in a single session. Unlike over-the-counter kits, our in-clinic formula is calibrated to minimize sensitivity while achieving optimal shade improvement.",
  },
  {
    icon: AlignJustify,
    name: "Orthodontics (Braces & Aligners)",
    description:
      "We offer both traditional metal braces and clear aligner systems for children, teenagers, and adults. Modern orthodontics is faster and more comfortable than ever, with discreet options that fit active lifestyles.",
  },
  {
    icon: Zap,
    name: "Root Canal Treatment",
    description:
      "When decay or injury reaches the inner pulp of a tooth, root canal therapy saves it from extraction. Using precise rotary instruments and gentle technique, we perform the procedure efficiently and with minimal discomfort.",
  },
  {
    icon: Gem,
    name: "Cosmetic Dentistry",
    description:
      "From porcelain veneers to composite bonding, our cosmetic services are designed to enhance the aesthetics of your smile with natural-looking precision. Each treatment plan is crafted to complement your facial features and personal style.",
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* ===== Page Header ===== */}
      <section
        className="py-20 lg:py-28 text-center"
        style={{ background: "oklch(0.18 0.065 255)" }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <span className="eyebrow text-white/50 mb-6">
            Clinical Excellence
          </span>
          <h1 className="heading-display text-4xl lg:text-5xl text-white mt-6 mb-5">
            Our Dental Services
          </h1>
          <p className="font-montserrat text-sm sm:text-base text-white/65 max-w-xl mx-auto leading-[1.75]">
            {/* PLACEHOLDER: Update services page subheadline */}
            Comprehensive dental care delivered with precision, compassion, and
            the latest clinical techniques.
          </p>
        </div>
      </section>

      {/* ===== Services Grid ===== */}
      <section className="bg-white py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {services.map((svc, i) => {
              const Icon = svc.icon;
              return (
                <div
                  key={svc.name}
                  className="group bg-white border border-[oklch(0.90_0.008_99)] hover:border-olive/30 rounded-lg p-8 flex flex-col shadow-card hover:shadow-card-hover card-luxury"
                  data-ocid={`services.card.${i + 1}`}
                >
                  <span className="icon-badge w-12 h-12 rounded-lg mb-5">
                    <Icon className="w-5 h-5 text-olive" />
                  </span>
                  <h3 className="heading-card text-lg text-navy mb-3">
                    {/* PLACEHOLDER: Update service name */}
                    {svc.name}
                  </h3>
                  <p className="font-montserrat text-sm text-charcoal leading-[1.8] flex-1">
                    {/* PLACEHOLDER: Update service description */}
                    {svc.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== CTA Banner ===== */}
      <section className="bg-beige py-20 lg:py-28 text-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <h2 className="heading-section text-2xl lg:text-3xl text-navy mb-5">
            Not sure which service you need?
          </h2>
          <p className="font-montserrat text-sm text-charcoal mb-8 leading-relaxed">
            {/* PLACEHOLDER: Update CTA description */}
            Book a consultation and Dr. Sharma will help you understand the best
            course of treatment for your dental goals.
          </p>
          <Link
            to="/book"
            className="inline-flex items-center gap-2 font-montserrat font-semibold text-sm px-8 py-3.5 rounded bg-olive text-white hover:bg-olive-dark transition-colors duration-150 tracking-wide"
          >
            Book a Consultation
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
