import { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Loader2,
  LogOut,
  Mail,
  Phone,
  Plus,
  Receipt,
  Search,
  Stethoscope,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  type Appointment,
  type PatientProfile,
  type ProcedureRecord,
  Role,
} from "../backend";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useRole } from "../hooks/useRole";

function TableSkeleton() {
  return (
    <div
      className="space-y-2 animate-pulse"
      data-ocid="doctor.appointments.loading_state"
    >
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-12 bg-beige rounded" />
      ))}
    </div>
  );
}

function timeLabel(time: string): string {
  if (time === "morning") return "Morning";
  if (time === "afternoon") return "Afternoon";
  if (time === "evening") return "Evening";
  return time;
}

interface PatientCardState {
  principal: string;
  profile: PatientProfile | null;
  procedures: ProcedureRecord[];
  expanded: boolean;
  showAddForm: boolean;
}

interface ProcedureForm {
  procedureName: string;
  date: string;
  cost: string;
  doctorNotes: string;
}

const EMPTY_PROC: ProcedureForm = {
  procedureName: "",
  date: "",
  cost: "",
  doctorNotes: "",
};

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p
      className="mt-1.5 font-montserrat text-xs text-red-600"
      data-ocid="doctor.procedure.field.error_state"
    >
      {msg}
    </p>
  );
}

export default function DoctorDashboard() {
  const { identity, clear } = useInternetIdentity();
  const { actor, isFetching } = useActor();
  const { role, isLoading: roleLoading } = useRole();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<"appointments" | "patients">(
    "appointments",
  );
  const [lookupPrincipal, setLookupPrincipal] = useState("");
  const [lookupError, setLookupError] = useState("");
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [patientCards, setPatientCards] = useState<PatientCardState[]>([]);
  const [procedureForms, setProcedureForms] = useState<
    Record<string, ProcedureForm>
  >({});
  const [procErrors, setProcErrors] = useState<
    Record<string, Partial<Record<keyof ProcedureForm, string>>>
  >({});

  // Route guard
  useEffect(() => {
    if (!identity && !isFetching) {
      navigate({ to: "/login" });
      return;
    }
    if (!roleLoading && role === Role.patient) {
      navigate({ to: "/patient" });
    }
  }, [identity, isFetching, role, roleLoading, navigate]);

  // Fetch all appointments
  const appointmentsQuery = useQuery<Appointment[]>({
    queryKey: ["allAppointments"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAppointments();
    },
    enabled: !!actor && !isFetching && !!identity,
  });

  const appointments = appointmentsQuery.data ?? [];

  // Add procedure mutation
  const addProcMutation = useMutation({
    mutationFn: async ({
      principal,
      form,
    }: { principal: string; form: ProcedureForm }) => {
      if (!actor) throw new Error("Service unavailable.");
      const p = Principal.fromText(principal);
      await actor.addProcedureRecord(
        p,
        form.procedureName,
        form.date,
        BigInt(Math.round(Number(form.cost))),
        form.doctorNotes,
      );
    },
    onSuccess: async (_, { principal }) => {
      // Refresh procedures for this patient
      if (!actor) return;
      const p = Principal.fromText(principal);
      const updatedProcs = await actor.getPatientProcedures(p);
      setPatientCards((prev) =>
        prev.map((c) =>
          c.principal === principal
            ? { ...c, procedures: updatedProcs, showAddForm: false }
            : c,
        ),
      );
      setProcedureForms((prev) => ({ ...prev, [principal]: EMPTY_PROC }));
      queryClient.invalidateQueries({
        queryKey: ["patientProcedures", principal],
      });
    },
  });

  async function handleLookup() {
    if (!lookupPrincipal.trim()) {
      setLookupError("Please enter a Principal ID.");
      return;
    }
    // Basic principal format check
    if (!/^[a-z0-9\-]+$/.test(lookupPrincipal.trim())) {
      setLookupError("Invalid Principal ID format.");
      return;
    }

    setLookupError("");
    setIsLookingUp(true);

    try {
      const p = Principal.fromText(lookupPrincipal.trim());
      if (!actor) throw new Error("Actor not ready.");
      const [profile, procedures] = await Promise.all([
        actor.getPatientProfile(p),
        actor.getPatientProcedures(p),
      ]);

      setPatientCards((prev) => {
        const exists = prev.find((c) => c.principal === lookupPrincipal.trim());
        if (exists) {
          return prev.map((c) =>
            c.principal === lookupPrincipal.trim()
              ? { ...c, profile, procedures, expanded: true }
              : c,
          );
        }
        return [
          {
            principal: lookupPrincipal.trim(),
            profile,
            procedures,
            expanded: true,
            showAddForm: false,
          },
          ...prev,
        ];
      });

      setLookupPrincipal("");
    } catch {
      setLookupError(
        "Could not find patient. Check the Principal ID and try again.",
      );
    } finally {
      setIsLookingUp(false);
    }
  }

  function toggleCard(principal: string) {
    setPatientCards((prev) =>
      prev.map((c) =>
        c.principal === principal ? { ...c, expanded: !c.expanded } : c,
      ),
    );
  }

  function toggleAddForm(principal: string) {
    setPatientCards((prev) =>
      prev.map((c) =>
        c.principal === principal ? { ...c, showAddForm: !c.showAddForm } : c,
      ),
    );
    if (!procedureForms[principal]) {
      setProcedureForms((prev) => ({ ...prev, [principal]: EMPTY_PROC }));
    }
  }

  function handleProcFormChange(
    principal: string,
    field: keyof ProcedureForm,
    value: string,
  ) {
    setProcedureForms((prev) => ({
      ...prev,
      [principal]: { ...(prev[principal] ?? EMPTY_PROC), [field]: value },
    }));
    setProcErrors((prev) => ({
      ...prev,
      [principal]: { ...(prev[principal] ?? {}), [field]: undefined },
    }));
  }

  function validateProc(principal: string): boolean {
    const form = procedureForms[principal] ?? EMPTY_PROC;
    const e: Partial<Record<keyof ProcedureForm, string>> = {};
    if (!form.procedureName.trim())
      e.procedureName = "Procedure name is required.";
    if (!form.date) e.date = "Date is required.";
    if (!form.cost) {
      e.cost = "Cost is required.";
    } else if (Number.isNaN(Number(form.cost)) || Number(form.cost) < 0) {
      e.cost = "Enter a valid amount.";
    }
    setProcErrors((prev) => ({ ...prev, [principal]: e }));
    return Object.keys(e).length === 0;
  }

  function handleAddProc(principal: string) {
    if (!validateProc(principal)) return;
    addProcMutation.mutate({
      principal,
      form: procedureForms[principal] ?? EMPTY_PROC,
    });
  }

  function handleLogout() {
    clear();
    navigate({ to: "/" });
  }

  const inputClass =
    "w-full font-montserrat text-sm text-charcoal bg-white border border-[oklch(0.90_0.008_99)] rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-olive/40 focus:border-olive transition-colors placeholder:text-charcoal-light/60";

  const labelClass =
    "block font-montserrat text-xs font-semibold tracking-[0.08em] uppercase text-charcoal-light mb-2";

  if (roleLoading || (!role && isFetching)) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center bg-beige">
        <Loader2 className="w-8 h-8 animate-spin text-navy" />
      </section>
    );
  }

  return (
    <>
      {/* ── Dashboard Header ── */}
      <section
        className="py-10 lg:py-12"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.12 0.05 255) 0%, oklch(0.18 0.065 255) 100%)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-olive/20 flex items-center justify-center flex-shrink-0">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-montserrat text-xs font-semibold tracking-[0.12em] uppercase text-white/50 mb-0.5">
                SmileCare
              </p>
              <h1 className="heading-card text-xl text-white">
                Doctor Dashboard
              </h1>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 font-montserrat text-sm font-medium px-4 py-2 rounded bg-white/10 text-white hover:bg-white/20 transition-colors"
            data-ocid="doctor.logout.button"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </section>

      {/* ── Tab Navigation ── */}
      <div className="bg-white border-b border-[oklch(0.90_0.008_99)] sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex">
          <button
            type="button"
            onClick={() => setActiveTab("appointments")}
            className={`flex items-center gap-2 font-montserrat text-sm font-medium px-5 py-4 border-b-2 transition-colors ${
              activeTab === "appointments"
                ? "border-olive text-olive"
                : "border-transparent text-charcoal-light hover:text-navy"
            }`}
            data-ocid="doctor.appointments.tab"
          >
            <ClipboardList className="w-4 h-4" />
            Appointment Requests
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("patients")}
            className={`flex items-center gap-2 font-montserrat text-sm font-medium px-5 py-4 border-b-2 transition-colors ${
              activeTab === "patients"
                ? "border-olive text-olive"
                : "border-transparent text-charcoal-light hover:text-navy"
            }`}
            data-ocid="doctor.patients.tab"
          >
            <User className="w-4 h-4" />
            Patient Records
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      <section className="bg-beige min-h-[50vh] py-10 lg:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ── Appointments Tab ── */}
          {activeTab === "appointments" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="heading-card text-lg text-navy">
                  All Appointment Requests
                </h2>
                <span className="font-montserrat text-xs text-charcoal-light">
                  {appointments.length} request
                  {appointments.length !== 1 ? "s" : ""}
                </span>
              </div>

              {appointmentsQuery.isLoading ? (
                <TableSkeleton />
              ) : appointmentsQuery.isError ? (
                <div
                  className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg"
                  data-ocid="doctor.appointments.error_state"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="font-montserrat text-sm text-red-700">
                    Failed to load appointments.
                  </p>
                </div>
              ) : appointments.length === 0 ? (
                <div
                  className="bg-white border border-[oklch(0.90_0.008_99)] rounded-xl shadow-card p-12 text-center"
                  data-ocid="doctor.appointments.empty_state"
                >
                  <ClipboardList className="w-10 h-10 text-charcoal-light/30 mx-auto mb-3" />
                  <p className="font-montserrat text-sm font-medium text-charcoal">
                    No appointment requests yet
                  </p>
                  <p className="font-montserrat text-xs text-charcoal-light mt-1">
                    Requests submitted through the booking form will appear
                    here.
                  </p>
                </div>
              ) : (
                <>
                  {/* Mobile cards */}
                  <div className="lg:hidden space-y-4">
                    {appointments.map((appt, idx) => (
                      <article
                        key={`${appt.email}-${appt.preferredDate}-${idx}`}
                        className="bg-white border border-[oklch(0.90_0.008_99)] rounded-xl shadow-card p-5"
                        data-ocid={`doctor.appointments.item.${idx + 1}`}
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <p className="font-playfair font-semibold text-navy text-base">
                              {appt.fullName}
                            </p>
                            <p className="font-montserrat text-xs text-olive mt-0.5">
                              {appt.serviceNeeded}
                            </p>
                          </div>
                          <span className="font-montserrat text-xs text-charcoal-light bg-beige px-2 py-1 rounded flex-shrink-0">
                            {timeLabel(appt.preferredTime)}
                          </span>
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 font-montserrat text-xs text-charcoal-light">
                            <Calendar className="w-3.5 h-3.5" />
                            {appt.preferredDate}
                          </div>
                          <div className="flex items-center gap-2 font-montserrat text-xs text-charcoal-light">
                            <Phone className="w-3.5 h-3.5" />
                            {appt.phoneNumber}
                          </div>
                          <div className="flex items-center gap-2 font-montserrat text-xs text-charcoal-light">
                            <Mail className="w-3.5 h-3.5" />
                            {appt.email}
                          </div>
                        </div>
                        {appt.message && (
                          <p className="mt-3 pt-3 border-t border-[oklch(0.90_0.008_99)] font-montserrat text-xs text-charcoal leading-relaxed">
                            {appt.message}
                          </p>
                        )}
                      </article>
                    ))}
                  </div>

                  {/* Desktop table */}
                  <div
                    className="hidden lg:block bg-white border border-[oklch(0.90_0.008_99)] rounded-xl shadow-card overflow-hidden"
                    data-ocid="doctor.appointments.table"
                  >
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[oklch(0.90_0.008_99)] bg-beige">
                          <th className="font-montserrat text-xs font-semibold tracking-[0.08em] uppercase text-charcoal-light text-left px-5 py-3.5">
                            Patient
                          </th>
                          <th className="font-montserrat text-xs font-semibold tracking-[0.08em] uppercase text-charcoal-light text-left px-5 py-3.5">
                            Service
                          </th>
                          <th className="font-montserrat text-xs font-semibold tracking-[0.08em] uppercase text-charcoal-light text-left px-5 py-3.5">
                            Date
                          </th>
                          <th className="font-montserrat text-xs font-semibold tracking-[0.08em] uppercase text-charcoal-light text-left px-5 py-3.5">
                            Time
                          </th>
                          <th className="font-montserrat text-xs font-semibold tracking-[0.08em] uppercase text-charcoal-light text-left px-5 py-3.5">
                            Contact
                          </th>
                          <th className="font-montserrat text-xs font-semibold tracking-[0.08em] uppercase text-charcoal-light text-left px-5 py-3.5">
                            Message
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointments.map((appt, idx) => (
                          <tr
                            key={`${appt.email}-${appt.preferredDate}-${idx}`}
                            className="border-b border-[oklch(0.90_0.008_99)] last:border-0 hover:bg-beige/40 transition-colors"
                            data-ocid={`doctor.appointments.row.${idx + 1}`}
                          >
                            <td className="px-5 py-4">
                              <p className="font-montserrat font-semibold text-navy text-sm">
                                {appt.fullName}
                              </p>
                            </td>
                            <td className="px-5 py-4">
                              <span className="font-montserrat text-xs text-olive font-medium">
                                {appt.serviceNeeded}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <span className="font-montserrat text-xs text-charcoal">
                                {appt.preferredDate}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <span className="font-montserrat text-xs bg-beige text-charcoal-light px-2 py-0.5 rounded">
                                {timeLabel(appt.preferredTime)}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <p className="font-montserrat text-xs text-charcoal">
                                {appt.phoneNumber}
                              </p>
                              <p className="font-montserrat text-xs text-charcoal-light">
                                {appt.email}
                              </p>
                            </td>
                            <td className="px-5 py-4 max-w-xs">
                              <p className="font-montserrat text-xs text-charcoal-light line-clamp-2">
                                {appt.message ?? "—"}
                              </p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── Patient Records Tab ── */}
          {activeTab === "patients" && (
            <div>
              <h2 className="heading-card text-lg text-navy mb-6">
                Patient Records
              </h2>

              {/* Lookup form */}
              <div className="bg-white border border-[oklch(0.90_0.008_99)] rounded-xl shadow-card p-6 mb-8">
                <p className="font-montserrat text-xs font-semibold tracking-[0.08em] uppercase text-charcoal-light mb-3">
                  Look Up Patient by Principal ID
                </p>
                <div className="flex gap-3 flex-wrap">
                  <input
                    type="text"
                    value={lookupPrincipal}
                    onChange={(e) => {
                      setLookupPrincipal(e.target.value);
                      setLookupError("");
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleLookup()}
                    placeholder="e.g. rdmx6-jaaaa-aaaaa-aaadq-cai"
                    className="flex-1 min-w-0 font-montserrat text-sm text-charcoal bg-white border border-[oklch(0.90_0.008_99)] rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-olive/40 focus:border-olive transition-colors placeholder:text-charcoal-light/60"
                    data-ocid="doctor.patient.lookup.search_input"
                  />
                  <button
                    type="button"
                    onClick={handleLookup}
                    disabled={isLookingUp}
                    className="flex items-center gap-2 font-montserrat font-semibold text-sm px-5 py-3 rounded bg-navy text-white hover:bg-navy-light disabled:opacity-60 transition-colors whitespace-nowrap"
                    data-ocid="doctor.patient.lookup.primary_button"
                  >
                    {isLookingUp ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Looking up…
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" /> Look Up
                      </>
                    )}
                  </button>
                </div>
                {lookupError && (
                  <p
                    className="mt-2 font-montserrat text-xs text-red-600 flex items-center gap-1"
                    data-ocid="doctor.patient.lookup.error_state"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    {lookupError}
                  </p>
                )}
              </div>

              {/* Patient cards */}
              {patientCards.length === 0 ? (
                <div
                  className="bg-white border border-[oklch(0.90_0.008_99)] rounded-xl shadow-card p-12 text-center"
                  data-ocid="doctor.patients.empty_state"
                >
                  <User className="w-10 h-10 text-charcoal-light/30 mx-auto mb-3" />
                  <p className="font-montserrat text-sm font-medium text-charcoal">
                    No patients looked up yet
                  </p>
                  <p className="font-montserrat text-xs text-charcoal-light mt-1">
                    Enter a patient's Principal ID above to view their records.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {patientCards.map((card, cardIdx) => {
                    const procForm =
                      procedureForms[card.principal] ?? EMPTY_PROC;
                    const errors = procErrors[card.principal] ?? {};
                    const isMutating =
                      addProcMutation.isPending &&
                      addProcMutation.variables?.principal === card.principal;

                    return (
                      <article
                        key={card.principal}
                        className="bg-white border border-[oklch(0.90_0.008_99)] rounded-xl shadow-card overflow-hidden"
                        data-ocid={`doctor.patients.item.${cardIdx + 1}`}
                      >
                        {/* Card header */}
                        <button
                          type="button"
                          onClick={() => toggleCard(card.principal)}
                          className="w-full flex items-center justify-between gap-4 px-6 py-5 hover:bg-beige/30 transition-colors"
                          data-ocid={`doctor.patients.toggle.${cardIdx + 1}`}
                        >
                          <div className="flex items-center gap-4 text-left">
                            <div className="icon-badge w-10 h-10 rounded-full flex-shrink-0">
                              <User className="w-5 h-5 text-navy" />
                            </div>
                            <div>
                              <p className="font-playfair font-semibold text-navy text-base">
                                {card.profile?.name ?? "Unknown Patient"}
                              </p>
                              <p className="font-montserrat text-xs text-charcoal-light mt-0.5 font-mono">
                                {card.principal.slice(0, 24)}…
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <span className="font-montserrat text-xs text-charcoal-light bg-beige px-2.5 py-1 rounded">
                              {card.procedures.length} procedure
                              {card.procedures.length !== 1 ? "s" : ""}
                            </span>
                            {card.expanded ? (
                              <ChevronUp className="w-4 h-4 text-charcoal-light" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-charcoal-light" />
                            )}
                          </div>
                        </button>

                        {card.expanded && (
                          <div className="border-t border-[oklch(0.90_0.008_99)] px-6 py-5">
                            {/* Profile info */}
                            {card.profile && (
                              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6 pb-6 border-b border-[oklch(0.90_0.008_99)]">
                                {[
                                  { label: "Email", value: card.profile.email },
                                  { label: "Phone", value: card.profile.phone },
                                  {
                                    label: "DOB",
                                    value: card.profile.dateOfBirth,
                                  },
                                  {
                                    label: "Blood Group",
                                    value: card.profile.bloodGroup,
                                  },
                                  {
                                    label: "Allergies",
                                    value:
                                      card.profile.allergies.length > 0
                                        ? card.profile.allergies.join(", ")
                                        : "None",
                                  },
                                ].map(({ label, value }) => (
                                  <div key={label}>
                                    <p className="font-montserrat text-xs font-semibold tracking-[0.08em] uppercase text-charcoal-light mb-1">
                                      {label}
                                    </p>
                                    <p className="font-montserrat text-sm text-charcoal">
                                      {value || "—"}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Procedures */}
                            <div className="flex items-center justify-between mb-3">
                              <p className="font-montserrat text-xs font-semibold tracking-[0.08em] uppercase text-charcoal-light">
                                Procedures ({card.procedures.length})
                              </p>
                              <button
                                type="button"
                                onClick={() => toggleAddForm(card.principal)}
                                className="flex items-center gap-1.5 font-montserrat text-xs font-semibold px-3 py-1.5 rounded bg-olive text-white hover:bg-olive-dark transition-colors"
                                data-ocid={`doctor.patients.add_procedure.${cardIdx + 1}`}
                              >
                                <Plus className="w-3.5 h-3.5" />
                                Add Procedure
                              </button>
                            </div>

                            {/* Add procedure form */}
                            {card.showAddForm && (
                              <div className="bg-beige rounded-lg p-5 mb-4 border border-[oklch(0.90_0.008_99)]">
                                <p className="font-montserrat text-xs font-semibold tracking-[0.08em] uppercase text-charcoal-light mb-4">
                                  New Procedure Record
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                    <label
                                      htmlFor={`proc-name-${card.principal}`}
                                      className={labelClass}
                                    >
                                      Procedure Name{" "}
                                      <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      id={`proc-name-${card.principal}`}
                                      type="text"
                                      value={procForm.procedureName}
                                      onChange={(e) =>
                                        handleProcFormChange(
                                          card.principal,
                                          "procedureName",
                                          e.target.value,
                                        )
                                      }
                                      placeholder="e.g. Root Canal Treatment"
                                      className={inputClass}
                                      data-ocid={`doctor.procedure.name.input.${cardIdx + 1}`}
                                    />
                                    <FieldError msg={errors.procedureName} />
                                  </div>
                                  <div>
                                    <label
                                      htmlFor={`proc-date-${card.principal}`}
                                      className={labelClass}
                                    >
                                      Date{" "}
                                      <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      id={`proc-date-${card.principal}`}
                                      type="date"
                                      value={procForm.date}
                                      onChange={(e) =>
                                        handleProcFormChange(
                                          card.principal,
                                          "date",
                                          e.target.value,
                                        )
                                      }
                                      className={inputClass}
                                      data-ocid={`doctor.procedure.date.input.${cardIdx + 1}`}
                                    />
                                    <FieldError msg={errors.date} />
                                  </div>
                                  <div>
                                    <label
                                      htmlFor={`proc-cost-${card.principal}`}
                                      className={labelClass}
                                    >
                                      Cost (₹){" "}
                                      <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      id={`proc-cost-${card.principal}`}
                                      type="number"
                                      min="0"
                                      value={procForm.cost}
                                      onChange={(e) =>
                                        handleProcFormChange(
                                          card.principal,
                                          "cost",
                                          e.target.value,
                                        )
                                      }
                                      placeholder="e.g. 5000"
                                      className={inputClass}
                                      data-ocid={`doctor.procedure.cost.input.${cardIdx + 1}`}
                                    />
                                    <FieldError msg={errors.cost} />
                                  </div>
                                  <div>
                                    <label
                                      htmlFor={`proc-notes-${card.principal}`}
                                      className={labelClass}
                                    >
                                      Doctor's Notes
                                    </label>
                                    <input
                                      id={`proc-notes-${card.principal}`}
                                      type="text"
                                      value={procForm.doctorNotes}
                                      onChange={(e) =>
                                        handleProcFormChange(
                                          card.principal,
                                          "doctorNotes",
                                          e.target.value,
                                        )
                                      }
                                      placeholder="Optional notes…"
                                      className={inputClass}
                                      data-ocid={`doctor.procedure.notes.input.${cardIdx + 1}`}
                                    />
                                  </div>
                                </div>

                                {addProcMutation.isError &&
                                  addProcMutation.variables?.principal ===
                                    card.principal && (
                                    <div
                                      className="mt-3 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded text-red-700"
                                      data-ocid={`doctor.procedure.submit.error_state.${cardIdx + 1}`}
                                    >
                                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                      <p className="font-montserrat text-xs">
                                        {addProcMutation.error instanceof Error
                                          ? addProcMutation.error.message
                                          : "Failed to add procedure."}
                                      </p>
                                    </div>
                                  )}

                                <div className="flex gap-3 mt-4">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleAddProc(card.principal)
                                    }
                                    disabled={isMutating}
                                    className="flex items-center gap-2 font-montserrat font-semibold text-sm px-4 py-2.5 rounded bg-olive text-white hover:bg-olive-dark disabled:opacity-60 transition-colors"
                                    data-ocid={`doctor.procedure.submit.submit_button.${cardIdx + 1}`}
                                  >
                                    {isMutating ? (
                                      <>
                                        <Loader2 className="w-4 h-4 animate-spin" />{" "}
                                        Saving…
                                      </>
                                    ) : (
                                      <>
                                        <Check className="w-4 h-4" /> Save
                                        Procedure
                                      </>
                                    )}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      toggleAddForm(card.principal)
                                    }
                                    className="font-montserrat text-sm font-medium px-4 py-2.5 rounded border border-[oklch(0.90_0.008_99)] text-charcoal hover:bg-white transition-colors"
                                    data-ocid={`doctor.procedure.cancel.cancel_button.${cardIdx + 1}`}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Procedure list */}
                            {card.procedures.length === 0 ? (
                              <div
                                className="py-6 text-center"
                                data-ocid={`doctor.patient.procedures.empty_state.${cardIdx + 1}`}
                              >
                                <p className="font-montserrat text-sm text-charcoal-light">
                                  No procedures recorded yet.
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                {card.procedures.map((proc, procIdx) => (
                                  <div
                                    key={Number(proc.receiptId)}
                                    className="flex items-start justify-between gap-4 p-4 bg-beige rounded-lg"
                                    data-ocid={`doctor.patient.procedures.item.${procIdx + 1}`}
                                  >
                                    <div className="flex items-start gap-3">
                                      <Receipt className="w-4 h-4 text-olive mt-0.5 flex-shrink-0" />
                                      <div>
                                        <p className="font-montserrat font-semibold text-sm text-navy">
                                          {proc.procedureName}
                                        </p>
                                        <p className="font-montserrat text-xs text-charcoal-light mt-0.5">
                                          {proc.date} · Receipt #
                                          {Number(proc.receiptId)}
                                        </p>
                                        {proc.doctorNotes && (
                                          <p className="font-montserrat text-xs text-charcoal mt-1 leading-relaxed">
                                            {proc.doctorNotes}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                    <p className="font-playfair font-bold text-navy flex-shrink-0">
                                      ₹
                                      {Number(proc.cost).toLocaleString(
                                        "en-IN",
                                      )}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
