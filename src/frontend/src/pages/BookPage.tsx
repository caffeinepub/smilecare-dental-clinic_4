import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { TimeOfDay } from "../backend";
import { useActor } from "../hooks/useActor";

const timeOptions = [
  { label: "Morning (9 AM – 12 PM)", value: TimeOfDay.morning },
  { label: "Afternoon (12 PM – 4 PM)", value: TimeOfDay.afternoon },
  { label: "Evening (4 PM – 7 PM)", value: TimeOfDay.evening },
] as const;

const serviceOptions = [
  "Routine Checkups & Cleanings",
  "Dental Implants",
  "Teeth Whitening",
  "Orthodontics (Braces & Aligners)",
  "Root Canal Treatment",
  "Cosmetic Dentistry",
];

interface FormState {
  fullName: string;
  phoneNumber: string;
  email: string;
  preferredDate: string;
  preferredTime: TimeOfDay | "";
  serviceNeeded: string;
  message: string;
}

const EMPTY_FORM: FormState = {
  fullName: "",
  phoneNumber: "",
  email: "",
  preferredDate: "",
  preferredTime: "",
  serviceNeeded: "",
  message: "",
};

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p
      className="mt-1.5 font-montserrat text-xs text-red-600"
      data-ocid="book.field.error_state"
    >
      {msg}
    </p>
  );
}

export default function BookPage() {
  const { actor } = useActor();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: async (data: FormState) => {
      if (!actor)
        throw new Error("Service temporarily unavailable. Please try again.");
      await actor.submitAppointment(
        data.fullName,
        data.phoneNumber,
        data.email,
        data.preferredDate,
        data.preferredTime as TimeOfDay,
        data.serviceNeeded,
        data.message || null,
      );
    },
  });

  function validate(): boolean {
    const newErrors: Partial<Record<keyof FormState, string>> = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required.";
    if (!form.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required.";
    } else if (!/^\+?[\d\s\-()]{7,}$/.test(form.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number.";
    }
    if (!form.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!form.preferredDate)
      newErrors.preferredDate = "Please select a preferred date.";
    if (!form.preferredTime)
      newErrors.preferredTime = "Please select a preferred time.";
    if (!form.serviceNeeded)
      newErrors.serviceNeeded = "Please select a service.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    mutate(form);
  }

  const inputClass =
    "w-full font-montserrat text-sm text-charcoal bg-white border border-[oklch(0.90_0.008_99)] rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-olive/40 focus:border-olive transition-colors placeholder:text-charcoal-light/60";

  const labelClass =
    "block font-montserrat text-xs font-semibold tracking-[0.08em] uppercase text-charcoal-light mb-2";

  // ===== Success State =====
  if (isSuccess) {
    return (
      <>
        <section
          className="py-20 lg:py-28 text-center"
          style={{ background: "oklch(0.18 0.065 255)" }}
        >
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h1 className="heading-display text-4xl lg:text-5xl text-white">
              Appointment Requested
            </h1>
          </div>
        </section>

        <section className="bg-beige py-24 flex items-center justify-center">
          <div
            className="max-w-lg mx-auto text-center bg-white border border-[oklch(0.90_0.008_99)] rounded-lg shadow-card p-12"
            data-ocid="book.success.success_state"
          >
            <div className="flex justify-center mb-6">
              <CheckCircle2 className="w-14 h-14 text-olive" />
            </div>
            <h2 className="heading-section text-2xl text-navy mb-5">
              Thank you!
            </h2>
            <p className="font-montserrat text-sm text-charcoal leading-relaxed">
              We've received your appointment request. Our team will confirm
              your appointment within 24 hours.
            </p>
            <p className="font-montserrat text-xs text-charcoal-light mt-3">
              A confirmation will be sent to{" "}
              <strong className="text-navy">{form.email}</strong>.
            </p>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      {/* ===== Page Header ===== */}
      <section
        className="py-20 lg:py-28 text-center"
        style={{ background: "oklch(0.18 0.065 255)" }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <span className="eyebrow text-white/50 mb-6">Your Next Step</span>
          <h1 className="heading-display text-4xl lg:text-5xl text-white mt-6 mb-5">
            Schedule Your Visit
          </h1>
          <p className="font-montserrat text-sm sm:text-base text-white/65 leading-[1.75]">
            {/* PLACEHOLDER: Update booking subheadline */}
            We respond to all appointment requests within 24 hours.
          </p>
        </div>
      </section>

      {/* ===== Booking Form ===== */}
      <section className="bg-beige py-20 lg:py-28">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-[oklch(0.90_0.008_99)] rounded-lg shadow-card p-8 lg:p-10">
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className={labelClass}>
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Priya Sharma"
                  autoComplete="name"
                  className={inputClass}
                  data-ocid="book.name.input"
                />
                <FieldError msg={errors.fullName} />
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phoneNumber" className={labelClass}>
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  autoComplete="tel"
                  className={inputClass}
                  data-ocid="book.phone.input"
                />
                <FieldError msg={errors.phoneNumber} />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className={labelClass}>
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={inputClass}
                  data-ocid="book.email.input"
                />
                <FieldError msg={errors.email} />
              </div>

              {/* Preferred Date */}
              <div>
                <label htmlFor="preferredDate" className={labelClass}>
                  Preferred Date <span className="text-red-500">*</span>
                </label>
                <input
                  id="preferredDate"
                  name="preferredDate"
                  type="date"
                  value={form.preferredDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className={inputClass}
                  data-ocid="book.date.input"
                />
                <FieldError msg={errors.preferredDate} />
              </div>

              {/* Preferred Time */}
              <div>
                <label htmlFor="preferredTime" className={labelClass}>
                  Preferred Time <span className="text-red-500">*</span>
                </label>
                <select
                  id="preferredTime"
                  name="preferredTime"
                  value={form.preferredTime}
                  onChange={handleChange}
                  className={inputClass}
                  data-ocid="book.time.select"
                >
                  <option value="" disabled>
                    — Select a time —
                  </option>
                  {timeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <FieldError msg={errors.preferredTime} />
              </div>

              {/* Service Needed */}
              <div>
                <label htmlFor="serviceNeeded" className={labelClass}>
                  Service Needed <span className="text-red-500">*</span>
                </label>
                <select
                  id="serviceNeeded"
                  name="serviceNeeded"
                  value={form.serviceNeeded}
                  onChange={handleChange}
                  className={inputClass}
                  data-ocid="book.service.select"
                >
                  <option value="" disabled>
                    — Select a service —
                  </option>
                  {serviceOptions.map((svc) => (
                    <option key={svc} value={svc}>
                      {/* PLACEHOLDER: Update service options to match clinic offerings */}
                      {svc}
                    </option>
                  ))}
                </select>
                <FieldError msg={errors.serviceNeeded} />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className={labelClass}>
                  Additional Message{" "}
                  <span className="text-charcoal-light font-normal normal-case tracking-normal">
                    (optional)
                  </span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Any specific concerns or information you'd like to share…"
                  rows={4}
                  className={`${inputClass} resize-y`}
                  data-ocid="book.message.textarea"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 font-montserrat font-semibold text-sm px-6 py-3.5 rounded bg-olive text-white hover:bg-olive-dark disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-150 tracking-wide"
                data-ocid="book.submit.submit_button"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  "Request Appointment"
                )}
              </button>

              <p className="font-montserrat text-xs text-charcoal-light text-center leading-relaxed">
                By submitting, you agree that we may contact you to confirm your
                appointment.
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
