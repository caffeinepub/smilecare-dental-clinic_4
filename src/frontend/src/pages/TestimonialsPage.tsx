const testimonials = [
  {
    name: "Rahul M.",
    rating: 5,
    quote:
      "I was extremely anxious about my root canal treatment, but Dr. Sharma made the entire experience surprisingly comfortable. She explained each step clearly, and I felt no pain throughout. I would not hesitate to recommend SmileCare to anyone.",
  },
  {
    name: "Sneha K.",
    rating: 5,
    quote:
      "The clinic is clean, calm, and professionally run. After two sessions of teeth whitening, the results were significantly better than the at-home kits I'd tried before. The staff is warm and never makes you feel rushed.",
  },
  {
    name: "Arvind T.",
    rating: 5,
    quote:
      "I had dental implants done here after years of hesitation. Dr. Sharma walked me through every stage of the process. Six months later, the implant looks and feels completely natural. Outstanding care.",
  },
  {
    name: "Preethi R.",
    rating: 5,
    quote:
      "Took my 8-year-old daughter for her first dental checkup here. The team was incredibly gentle with her, and she left without any tears — a first! We've now made SmileCare our family dentist.",
  },
  {
    name: "Nikhil S.",
    rating: 5,
    quote:
      "I had clear aligners fitted for a minor overcrowding issue. The process was smooth, the progress checks were thorough, and the result was better than I expected. The clinic feels nothing like a typical dental office.",
  },
  {
    name: "Meera A.",
    rating: 5,
    quote:
      "After a bad experience elsewhere, I was nervous about coming in for a cleaning. The hygienist was thorough yet gentle, and Dr. Sharma did a detailed check without any hard-sell on unnecessary treatments. Refreshingly honest practice.",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5 mb-4">
      {(["1", "2", "3", "4", "5"] as const).map((star, i) => (
        <span
          key={star}
          className={i < count ? "text-olive" : "text-charcoal-light/30"}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function TestimonialsPage() {
  return (
    <>
      {/* ===== Page Header ===== */}
      <section
        className="py-20 lg:py-28 text-center"
        style={{ background: "oklch(0.18 0.065 255)" }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <span className="eyebrow text-white/50 mb-6">
            Patient Experiences
          </span>
          <h1 className="heading-display text-4xl lg:text-5xl text-white mt-6">
            What Our Patients Say
          </h1>
        </div>
      </section>

      {/* ===== Testimonials Grid ===== */}
      <section className="bg-beige py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                className="bg-white border border-[oklch(0.90_0.008_99)] rounded-lg p-8 flex flex-col shadow-card"
                data-ocid={`testimonials.item.${i + 1}`}
              >
                <StarRating count={t.rating} />
                <blockquote className="font-montserrat text-sm text-charcoal leading-[1.8] flex-1 mb-6">
                  {/* PLACEHOLDER: Replace with actual patient quotes */}
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3 pt-5 border-t border-[oklch(0.90_0.008_99)]">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white font-montserrat text-xs font-semibold flex-shrink-0"
                    style={{ background: "oklch(0.18 0.065 255)" }}
                    aria-hidden="true"
                  >
                    {/* PLACEHOLDER: Update patient initials */}
                    {t.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="font-montserrat text-sm font-semibold text-navy">
                      {/* PLACEHOLDER: Update patient name */}
                      {t.name}
                    </p>
                    <p className="font-montserrat text-xs text-charcoal-light">
                      Verified Patient
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ===== Trust note ===== */}
          <div className="mt-14 text-center">
            <p className="font-montserrat text-xs text-charcoal-light max-w-sm mx-auto">
              {/* PLACEHOLDER: Update review source note */}
              All testimonials are from real patients. Names are used with
              permission and abbreviated for privacy.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
