import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  Loader2,
  ShieldCheck,
  Stethoscope,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Role } from "../backend";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useRole } from "../hooks/useRole";

const bloodGroups = ["A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−"];

interface RegistrationForm {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  bloodGroup: string;
  allergies: string;
  notes: string;
}

const EMPTY_REG: RegistrationForm = {
  name: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  bloodGroup: "",
  allergies: "",
  notes: "",
};

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p
      className="mt-1.5 font-montserrat text-xs text-red-600"
      data-ocid="login.field.error_state"
    >
      {msg}
    </p>
  );
}

export default function LoginPage() {
  const { login, isLoggingIn, identity, isInitializing } =
    useInternetIdentity();
  const { actor, isFetching } = useActor();
  const { role, refetch: refetchRole, isLoading: roleLoading } = useRole();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [step, setStep] = useState<"login" | "choose" | "register">("login");
  const [form, setForm] = useState<RegistrationForm>(EMPTY_REG);
  const [errors, setErrors] = useState<
    Partial<Record<keyof RegistrationForm, string>>
  >({});

  // After login succeeds with an identity, check role
  useEffect(() => {
    if (!identity || isFetching || roleLoading) return;

    if (role === Role.doctor) {
      navigate({ to: "/doctor" });
    } else if (role === Role.patient) {
      navigate({ to: "/patient" });
    } else if (role === null && !isFetching && !!actor) {
      // New user — prompt choice
      setStep("choose");
    }
  }, [identity, role, isFetching, roleLoading, navigate, actor]);

  const registerMutation = useMutation({
    mutationFn: async (data: RegistrationForm) => {
      if (!actor) throw new Error("Service unavailable. Please try again.");
      await actor.registerPatientProfile(
        data.name,
        data.email,
        data.phone,
        data.dateOfBirth,
        data.bloodGroup,
        data.allergies
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        data.notes,
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["role"] });
      await refetchRole();
      navigate({ to: "/patient" });
    },
  });

  function validateReg(): boolean {
    const e: Partial<Record<keyof RegistrationForm, string>> = {};
    if (!form.name.trim()) e.name = "Full name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Invalid email.";
    if (!form.phone.trim()) e.phone = "Phone number is required.";
    if (!form.dateOfBirth) e.dateOfBirth = "Date of birth is required.";
    if (!form.bloodGroup) e.bloodGroup = "Blood group is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof RegistrationForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleRegSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateReg()) return;
    registerMutation.mutate(form);
  }

  const inputClass =
    "w-full font-montserrat text-sm text-charcoal bg-white border border-[oklch(0.90_0.008_99)] rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-olive/40 focus:border-olive transition-colors placeholder:text-charcoal-light/60";

  const labelClass =
    "block font-montserrat text-xs font-semibold tracking-[0.08em] uppercase text-charcoal-light mb-2";

  // ── Initializing ──
  if (isInitializing) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center bg-beige">
        <Loader2 className="w-8 h-8 animate-spin text-navy" />
      </section>
    );
  }

  // ── Registration Form ──
  if (step === "register") {
    return (
      <section className="min-h-screen bg-beige py-16 flex items-start justify-center">
        <div className="w-full max-w-lg mx-auto px-4">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="heading-section text-2xl text-navy">
              Complete Your Profile
            </h1>
            <p className="font-montserrat text-sm text-charcoal-light mt-2">
              Set up your patient account to access your records.
            </p>
          </div>

          <div className="bg-white border border-[oklch(0.90_0.008_99)] rounded-lg shadow-card p-8">
            <form onSubmit={handleRegSubmit} noValidate className="space-y-5">
              {/* Name */}
              <div>
                <label htmlFor="reg-name" className={labelClass}>
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="reg-name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Arjun Mehta"
                  autoComplete="name"
                  className={inputClass}
                  data-ocid="register.name.input"
                />
                <FieldError msg={errors.name} />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="reg-email" className={labelClass}>
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={inputClass}
                  data-ocid="register.email.input"
                />
                <FieldError msg={errors.email} />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="reg-phone" className={labelClass}>
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  id="reg-phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  autoComplete="tel"
                  className={inputClass}
                  data-ocid="register.phone.input"
                />
                <FieldError msg={errors.phone} />
              </div>

              {/* Date of Birth */}
              <div>
                <label htmlFor="reg-dob" className={labelClass}>
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  id="reg-dob"
                  name="dateOfBirth"
                  type="date"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  max={new Date().toISOString().split("T")[0]}
                  className={inputClass}
                  data-ocid="register.dob.input"
                />
                <FieldError msg={errors.dateOfBirth} />
              </div>

              {/* Blood Group */}
              <div>
                <label htmlFor="reg-blood" className={labelClass}>
                  Blood Group <span className="text-red-500">*</span>
                </label>
                <select
                  id="reg-blood"
                  name="bloodGroup"
                  value={form.bloodGroup}
                  onChange={handleChange}
                  className={inputClass}
                  data-ocid="register.bloodgroup.select"
                >
                  <option value="" disabled>
                    — Select —
                  </option>
                  {bloodGroups.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
                <FieldError msg={errors.bloodGroup} />
              </div>

              {/* Allergies */}
              <div>
                <label htmlFor="reg-allergies" className={labelClass}>
                  Allergies{" "}
                  <span className="text-charcoal-light font-normal normal-case tracking-normal">
                    (comma-separated, optional)
                  </span>
                </label>
                <input
                  id="reg-allergies"
                  name="allergies"
                  type="text"
                  value={form.allergies}
                  onChange={handleChange}
                  placeholder="e.g. Penicillin, Latex"
                  className={inputClass}
                  data-ocid="register.allergies.input"
                />
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="reg-notes" className={labelClass}>
                  Additional Notes{" "}
                  <span className="text-charcoal-light font-normal normal-case tracking-normal">
                    (optional)
                  </span>
                </label>
                <textarea
                  id="reg-notes"
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Any relevant medical history…"
                  rows={3}
                  className={`${inputClass} resize-y`}
                  data-ocid="register.notes.textarea"
                />
              </div>

              {registerMutation.isError && (
                <div
                  className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded text-red-700"
                  data-ocid="register.submit.error_state"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <p className="font-montserrat text-xs">
                    {registerMutation.error instanceof Error
                      ? registerMutation.error.message
                      : "Registration failed. Please try again."}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={registerMutation.isPending}
                className="w-full flex items-center justify-center gap-2 font-montserrat font-semibold text-sm px-6 py-3.5 rounded bg-olive text-white hover:bg-olive-dark disabled:opacity-60 disabled:cursor-not-allowed transition-colors tracking-wide"
                data-ocid="register.submit.submit_button"
              >
                {registerMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Creating
                    account…
                  </>
                ) : (
                  "Create Patient Account"
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep("choose")}
                className="w-full font-montserrat text-sm text-charcoal-light hover:text-navy transition-colors py-2"
                data-ocid="register.back.button"
              >
                ← Back
              </button>
            </form>
          </div>
        </div>
      </section>
    );
  }

  // ── New User: Choose Role ──
  if (step === "choose") {
    return (
      <section className="min-h-[60vh] bg-beige py-20 flex items-center justify-center">
        <div className="w-full max-w-md mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="heading-section text-2xl text-navy mb-2">
              Welcome to SmileCare
            </h2>
            <p className="font-montserrat text-sm text-charcoal-light">
              How would you like to access the portal?
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Patient option */}
            <button
              type="button"
              onClick={() => setStep("register")}
              className="group flex items-start gap-4 p-6 bg-white border-2 border-[oklch(0.90_0.008_99)] rounded-lg hover:border-olive hover:shadow-card-hover transition-all duration-200 text-left"
              data-ocid="login.patient.button"
            >
              <div className="icon-badge w-12 h-12 rounded-full flex-shrink-0 group-hover:bg-olive/10">
                <User className="w-6 h-6 text-olive" />
              </div>
              <div>
                <p className="font-playfair font-semibold text-navy text-lg leading-tight">
                  I'm a Patient
                </p>
                <p className="font-montserrat text-xs text-charcoal-light mt-1 leading-relaxed">
                  Register to view your procedures, receipts, and profile
                  information.
                </p>
              </div>
            </button>

            {/* Doctor option */}
            <div className="flex items-start gap-4 p-6 bg-white border-2 border-[oklch(0.90_0.008_99)] rounded-lg opacity-75">
              <div className="icon-badge w-12 h-12 rounded-full flex-shrink-0">
                <Stethoscope className="w-6 h-6 text-navy" />
              </div>
              <div>
                <p className="font-playfair font-semibold text-navy text-lg leading-tight">
                  I'm a Doctor
                </p>
                <p className="font-montserrat text-xs text-charcoal-light mt-1 leading-relaxed">
                  Doctor access is granted by the clinic administrator. Please
                  contact the clinic to set up your account.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ── Main Login Screen ──
  return (
    <section className="min-h-[70vh] bg-beige flex items-center justify-center py-16">
      <div className="w-full max-w-md mx-auto px-4">
        {/* Card */}
        <div className="bg-white border border-[oklch(0.90_0.008_99)] rounded-xl shadow-card-xl p-10 text-center">
          {/* Branding */}
          <div className="flex justify-center mb-6">
            <div className="icon-badge w-16 h-16 rounded-full">
              <ShieldCheck className="w-8 h-8 text-olive" />
            </div>
          </div>

          <h1 className="heading-section text-2xl text-navy mb-2">
            Patient & Doctor Portal
          </h1>
          <p className="font-montserrat text-sm text-charcoal-light leading-relaxed mb-8">
            Sign in securely to access your SmileCare records, appointments, and
            profile.
          </p>

          {/* Login button */}
          <button
            type="button"
            onClick={login}
            disabled={isLoggingIn || isFetching || roleLoading}
            className="w-full flex items-center justify-center gap-3 font-montserrat font-semibold text-sm px-6 py-4 rounded-lg bg-navy text-white hover:bg-navy-light disabled:opacity-60 disabled:cursor-not-allowed transition-colors tracking-wide"
            data-ocid="login.signin.primary_button"
          >
            {isLoggingIn || (identity && (isFetching || roleLoading)) ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Signing in…
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                Sign in with Internet Identity
              </>
            )}
          </button>

          <p className="font-montserrat text-xs text-charcoal-light mt-6 leading-relaxed">
            Internet Identity is a secure, privacy-preserving authentication
            system. No passwords — your device authenticates you.
          </p>
        </div>
      </div>
    </section>
  );
}
