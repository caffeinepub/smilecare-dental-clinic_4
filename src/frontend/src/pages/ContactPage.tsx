import {
  CheckCircle2,
  Clock,
  Loader2,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { useState } from "react";

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const EMPTY: ContactForm = { name: "", email: "", phone: "", message: "" };

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p
      className="mt-1.5 font-montserrat text-xs text-red-600"
      data-ocid="contact.field.error_state"
    >
      {msg}
    </p>
  );
}

export default function ContactPage() {
  const [form, setForm] = useState<ContactForm>(EMPTY);
  const [errors, setErrors] = useState<Partial<ContactForm>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function validate(): boolean {
    const e: Partial<ContactForm> = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.email.trim()) {
      e.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Please enter a valid email address.";
    }
    if (!form.message.trim()) e.message = "Message is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    await new Promise((res) => setTimeout(res, 900));
    setSubmitting(false);
    setSubmitted(true);
  }

  const inputClass =
    "w-full font-montserrat text-sm text-charcoal bg-white border border-[oklch(0.90_0.008_99)] rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-olive/40 focus:border-olive transition-colors placeholder:text-charcoal-light/60";

  const labelClass =
    "block font-montserrat text-xs font-semibold tracking-[0.08em] uppercase text-charcoal-light mb-2";

  return (
    <>
      {/* ===== Page Header ===== */}
      <section
        className="py-20 lg:py-28 text-center"
        style={{ background: "oklch(0.18 0.065 255)" }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <span className="eyebrow text-white/50 mb-6">Reach Out</span>
          <h1 className="heading-display text-4xl lg:text-5xl text-white mt-6">
            Get in Touch
          </h1>
        </div>
      </section>

      {/* ===== Two-column layout ===== */}
      <section className="bg-beige py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* ===== Left: Contact Form ===== */}
            <div className="bg-white border border-[oklch(0.90_0.008_99)] rounded-lg shadow-card p-8 lg:p-10">
              <h2 className="heading-card text-2xl text-navy mb-7">
                Send Us a Message
              </h2>

              {submitted ? (
                <div
                  className="flex flex-col items-center text-center py-10"
                  data-ocid="contact.success.success_state"
                >
                  <CheckCircle2 className="w-12 h-12 text-olive mb-4" />
                  <h3 className="heading-card text-xl text-navy mb-3">
                    Message Received
                  </h3>
                  <p className="font-montserrat text-sm text-charcoal leading-relaxed max-w-xs">
                    Thank you for reaching out. We'll get back to you as soon as
                    possible.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  {/* Name */}
                  <div>
                    <label htmlFor="contact-name" className={labelClass}>
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      autoComplete="name"
                      className={inputClass}
                      data-ocid="contact.name.input"
                    />
                    <FieldError msg={errors.name} />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="contact-email" className={labelClass}>
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className={inputClass}
                      data-ocid="contact.email.input"
                    />
                    <FieldError msg={errors.email} />
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="contact-phone" className={labelClass}>
                      Phone{" "}
                      <span className="text-charcoal-light font-normal normal-case tracking-normal">
                        (optional)
                      </span>
                    </label>
                    <input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 96166 04805"
                      autoComplete="tel"
                      className={inputClass}
                      data-ocid="contact.phone.input"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="contact-message" className={labelClass}>
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      rows={5}
                      className={`${inputClass} resize-y`}
                      data-ocid="contact.message.textarea"
                    />
                    <FieldError msg={errors.message} />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 font-montserrat font-semibold text-sm px-6 py-3.5 rounded bg-olive text-white hover:bg-olive-dark disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-150 tracking-wide"
                    data-ocid="contact.submit.submit_button"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending…
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* ===== Right: Address + Map ===== */}
            <div className="flex flex-col gap-8">
              {/* Address block */}
              <div className="bg-white border border-[oklch(0.90_0.008_99)] rounded-lg shadow-card p-8">
                <h2 className="heading-card text-2xl text-navy mb-7">
                  Clinic Location
                </h2>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-olive mt-0.5 flex-shrink-0" />
                    <address className="font-montserrat text-sm text-charcoal not-italic leading-relaxed">
                      <strong className="text-navy block mb-0.5">
                        VENUS Oral-Dental Care Clinic
                      </strong>
                      14 Vikas Khand, Gomti Nagar,
                      <br />
                      Lucknow, Uttar Pradesh – 226010
                    </address>
                  </li>
                  <li className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-olive flex-shrink-0" />
                    <a
                      href="tel:+919616604805"
                      className="font-montserrat text-sm text-charcoal hover:text-navy transition-colors"
                    >
                      +91 96166 04805
                    </a>
                  </li>
                  <li className="flex items-center gap-3">
                    <a
                      href="https://wa.me/919616604805"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-montserrat text-sm font-semibold px-5 py-2.5 rounded bg-[#25D366] text-white hover:bg-[#1ebe5d] transition-colors"
                      data-ocid="contact.whatsapp.button"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="w-4 h-4 fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        role="img"
                        aria-label="WhatsApp"
                      >
                        <title>WhatsApp</title>
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                      Chat on WhatsApp
                    </a>
                  </li>
                  <li className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-olive flex-shrink-0" />
                    <a
                      href="mailto:info@venusdental.com"
                      className="font-montserrat text-sm text-charcoal hover:text-navy transition-colors"
                    >
                      info@venusdental.com
                    </a>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-olive mt-0.5 flex-shrink-0" />
                    <div className="font-montserrat text-sm text-charcoal leading-relaxed">
                      Mon – Sat: 9:00 AM – 7:00 PM
                      <br />
                      Sunday: 10:00 AM – 2:00 PM
                    </div>
                  </li>
                </ul>
              </div>

              {/* Google Maps embed */}
              <div
                className="rounded-lg overflow-hidden border border-[oklch(0.90_0.008_99)] shadow-card"
                data-ocid="contact.map.map_marker"
              >
                <iframe
                  src="https://maps.google.com/maps?q=Gomti+Nagar+Lucknow+Uttar+Pradesh&output=embed"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="VENUS Oral-Dental Care Clinic location — Gomti Nagar, Lucknow"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
