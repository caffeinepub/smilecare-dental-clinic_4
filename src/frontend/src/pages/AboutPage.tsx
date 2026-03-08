import { Heart, Shield, Target } from "lucide-react";

const coreValues = [
  {
    icon: Target,
    title: "Precision",
    description:
      "Every diagnosis, every procedure, every follow-up is performed with careful attention to detail. We do not cut corners.",
  },
  {
    icon: Heart,
    title: "Patient Comfort",
    description:
      "Dental anxiety is real and understood here. We pace treatment to your comfort, with clear explanations at every step.",
  },
  {
    icon: Shield,
    title: "Hygiene Standards",
    description:
      "Our sterilization protocols go beyond regulatory requirements. A clean, safe environment is fundamental — not optional.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ===== Page Header ===== */}
      <section
        className="py-20 lg:py-28 text-center"
        style={{ background: "oklch(0.18 0.065 255)" }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <span className="eyebrow text-white/50 mb-6">Who We Are</span>
          <h1 className="heading-display text-4xl lg:text-5xl text-white mt-6">
            About Us
          </h1>
        </div>
      </section>

      {/* ===== Our Story ===== */}
      <section className="bg-beige py-24 lg:py-32">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="eyebrow text-olive mb-6">Our Beginning</span>
          <h2 className="heading-section text-3xl lg:text-4xl text-navy mt-6 mb-10">
            Our Story
          </h2>
          <div className="space-y-6 font-montserrat text-sm sm:text-[0.9375rem] text-charcoal leading-[1.85]">
            <p>
              {/* PLACEHOLDER: Update clinic founding story paragraph 1 */}
              SmileCare Dental Clinic was founded with a single conviction: that
              dental care in India can — and should — be both clinically
              excellent and genuinely compassionate. Too often, patients leave
              appointments feeling rushed, uncertain, or anxious. We set out to
              change that.
            </p>
            <p>
              {/* PLACEHOLDER: Update clinic founding story paragraph 2 */}
              Established in the heart of Gomti Nagar, Lucknow, our clinic was
              designed from the ground up as a calm, considered space for
              treatment. The interior, the pace of appointments, the staff
              training — all of it is intentional. We want each visit to feel
              like a consultation, not a transaction.
            </p>
            <p>
              {/* PLACEHOLDER: Update clinic founding story paragraph 3 */}
              Over the years, we have built a community of loyal patients —
              families who trust us with their children's first checkups and
              grandparents returning for implants. That trust is our most
              important credential.
            </p>
          </div>
        </div>
      </section>

      {/* ===== Doctor Bio ===== */}
      <section className="bg-white py-24 lg:py-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Avatar side */}
            <div className="flex flex-col items-center lg:items-start">
              {/* Large initials avatar */}
              <div
                className="w-36 h-36 rounded-full flex items-center justify-center text-white font-playfair text-5xl font-semibold mb-6 ring-4 ring-white ring-offset-4 ring-offset-beige shadow-card-xl"
                style={{ background: "oklch(0.18 0.065 255)" }}
                aria-label="Dr. Priya Sharma portrait placeholder"
              >
                PS
              </div>
              {/* PLACEHOLDER: Replace the div above with an <img> tag when a real headshot is available */}
              <div className="text-center lg:text-left">
                <div
                  className="inline-block font-montserrat text-xs font-semibold tracking-[0.12em] uppercase px-3 py-1 rounded-full mb-4"
                  style={{
                    background: "oklch(0.44 0.105 130 / 0.1)",
                    color: "oklch(0.35 0.09 130)",
                  }}
                >
                  Lead Dentist &amp; Founder
                </div>
                <p className="font-montserrat text-sm text-charcoal-light">
                  BDS — Dental Science, KGMU Lucknow
                </p>
              </div>
            </div>

            {/* Bio side */}
            <div>
              <h2 className="heading-section text-3xl lg:text-4xl text-navy mb-7">
                {/* PLACEHOLDER: Update doctor name */}
                Dr. Priya Sharma
              </h2>
              <div className="space-y-5 font-montserrat text-sm sm:text-[0.9375rem] text-charcoal leading-[1.85]">
                <p>
                  {/* PLACEHOLDER: Update doctor bio paragraph 1 */}
                  Dr. Priya Sharma holds a Bachelor of Dental Surgery (BDS) from
                  King George's Medical University, Lucknow, one of India's
                  premier dental institutions. She completed advanced training
                  in restorative and cosmetic dentistry, with special focus on
                  aesthetic rehabilitation.
                </p>
                <p>
                  {/* PLACEHOLDER: Update doctor bio paragraph 2 */}
                  With over 10 years of clinical practice, Dr. Sharma has
                  treated thousands of patients ranging from routine cleanings
                  to complex full-mouth restorations. She is known for her calm
                  chairside manner and thorough, patient-led consultations.
                </p>
                <p>
                  {/* PLACEHOLDER: Update doctor bio paragraph 3 */}
                  She regularly attends continuing education programs to stay
                  current with advances in implantology, aligner therapy, and
                  minimally invasive techniques — ensuring that SmileCare's
                  patients always receive contemporary care.
                </p>
              </div>

              {/* Stats row */}
              <div className="mt-8 grid grid-cols-3 gap-4 pt-8 border-t border-[oklch(0.90_0.008_99)]">
                {[
                  { value: "10+", label: "Years Experience" },
                  { value: "5000+", label: "Patients Treated" },
                  { value: "98%", label: "Satisfaction Rate" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="font-playfair text-2xl font-semibold text-navy">
                      {/* PLACEHOLDER: Update stat value */}
                      {stat.value}
                    </div>
                    <div className="font-montserrat text-xs text-charcoal-light mt-1 leading-tight">
                      {/* PLACEHOLDER: Update stat label */}
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Core Values ===== */}
      <section className="bg-beige py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="eyebrow text-olive">What Guides Us</span>
            <h2 className="heading-section text-3xl lg:text-4xl text-navy mt-6">
              Our Core Values
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-7">
            {coreValues.map((val, i) => {
              const Icon = val.icon;
              return (
                <div
                  key={val.title}
                  className="group bg-white border border-navy/10 hover:border-olive/30 rounded-lg p-8 flex flex-col items-start shadow-card hover:shadow-card-hover card-luxury"
                  data-ocid={`about.values.card.${i + 1}`}
                >
                  <span className="icon-badge w-12 h-12 rounded-lg mb-5">
                    <Icon className="w-5 h-5 text-olive" />
                  </span>
                  <h3 className="heading-card text-lg text-navy mb-3">
                    {/* PLACEHOLDER: Update core value title */}
                    {val.title}
                  </h3>
                  <p className="font-montserrat text-sm text-charcoal leading-[1.8]">
                    {/* PLACEHOLDER: Update core value description */}
                    {val.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
