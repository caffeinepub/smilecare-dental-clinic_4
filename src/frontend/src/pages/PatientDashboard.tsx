import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  Calendar,
  ClipboardList,
  Edit3,
  Loader2,
  LogOut,
  Receipt,
  Save,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { type PatientProfile, Role } from "../backend";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useRole } from "../hooks/useRole";

const bloodGroups = ["A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−"];

function ProfileSkeleton() {
  return (
    <div
      className="space-y-4 animate-pulse"
      data-ocid="patient.profile.loading_state"
    >
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-12 bg-beige rounded" />
      ))}
    </div>
  );
}

function ProcedureSkeleton() {
  return (
    <div
      className="space-y-3 animate-pulse"
      data-ocid="patient.procedures.loading_state"
    >
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-28 bg-beige rounded-lg" />
      ))}
    </div>
  );
}

interface EditForm {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  bloodGroup: string;
  allergies: string;
  notes: string;
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p
      className="mt-1.5 font-montserrat text-xs text-red-600"
      data-ocid="patient.edit.field.error_state"
    >
      {msg}
    </p>
  );
}

export default function PatientDashboard() {
  const { identity, clear } = useInternetIdentity();
  const { actor, isFetching } = useActor();
  const { role, isLoading: roleLoading } = useRole();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<"profile" | "procedures">(
    "profile",
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<EditForm>({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    bloodGroup: "",
    allergies: "",
    notes: "",
  });
  const [editErrors, setEditErrors] = useState<
    Partial<Record<keyof EditForm, string>>
  >({});

  // Route guard
  useEffect(() => {
    if (!identity && !isFetching) {
      navigate({ to: "/login" });
      return;
    }
    if (!roleLoading && role === Role.doctor) {
      navigate({ to: "/doctor" });
    }
  }, [identity, isFetching, role, roleLoading, navigate]);

  // Fetch profile
  const profileQuery = useQuery<PatientProfile | null>({
    queryKey: ["myProfile", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyProfile();
    },
    enabled: !!actor && !isFetching && !!identity,
  });

  // Fetch procedures
  const proceduresQuery = useQuery({
    queryKey: ["myProcedures", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyProcedures();
    },
    enabled: !!actor && !isFetching && !!identity,
  });

  // Update profile mutation
  const updateMutation = useMutation({
    mutationFn: async (data: EditForm) => {
      if (!actor) throw new Error("Service unavailable.");
      await actor.updatePatientProfile(
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
      setIsEditing(false);
    },
  });

  function startEdit() {
    const p = profileQuery.data;
    if (!p) return;
    setEditForm({
      name: p.name,
      email: p.email,
      phone: p.phone,
      dateOfBirth: p.dateOfBirth,
      bloodGroup: p.bloodGroup,
      allergies: p.allergies.join(", "),
      notes: p.notes,
    });
    setEditErrors({});
    setIsEditing(true);
  }

  function validateEdit(): boolean {
    const e: Partial<Record<keyof EditForm, string>> = {};
    if (!editForm.name.trim()) e.name = "Name is required.";
    if (!editForm.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email))
      e.email = "Invalid email.";
    if (!editForm.phone.trim()) e.phone = "Phone is required.";
    if (!editForm.dateOfBirth) e.dateOfBirth = "Date of birth is required.";
    if (!editForm.bloodGroup) e.bloodGroup = "Blood group is required.";
    setEditErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleEditChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
    if (editErrors[name as keyof EditForm]) {
      setEditErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateEdit()) return;
    updateMutation.mutate(editForm);
  }

  function handleLogout() {
    clear();
    navigate({ to: "/" });
  }

  const inputClass =
    "w-full font-montserrat text-sm text-charcoal bg-white border border-[oklch(0.90_0.008_99)] rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-olive/40 focus:border-olive transition-colors placeholder:text-charcoal-light/60";

  const labelClass =
    "block font-montserrat text-xs font-semibold tracking-[0.08em] uppercase text-charcoal-light mb-2";

  const profile = profileQuery.data;
  const procedures = proceduresQuery.data ?? [];

  // Loading state while determining role
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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-olive/20 flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-montserrat text-xs font-semibold tracking-[0.12em] uppercase text-white/50 mb-0.5">
                Patient Portal
              </p>
              <h1 className="heading-card text-xl text-white">
                {profile?.name ?? "My Dashboard"}
              </h1>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 font-montserrat text-sm font-medium px-4 py-2 rounded bg-white/10 text-white hover:bg-white/20 transition-colors"
            data-ocid="patient.logout.button"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </section>

      {/* ── Tab Navigation ── */}
      <div className="bg-white border-b border-[oklch(0.90_0.008_99)] sticky top-16 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex">
          <button
            type="button"
            onClick={() => {
              setActiveTab("profile");
              setIsEditing(false);
            }}
            className={`flex items-center gap-2 font-montserrat text-sm font-medium px-5 py-4 border-b-2 transition-colors ${
              activeTab === "profile"
                ? "border-olive text-olive"
                : "border-transparent text-charcoal-light hover:text-navy"
            }`}
            data-ocid="patient.profile.tab"
          >
            <User className="w-4 h-4" />
            My Profile
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("procedures")}
            className={`flex items-center gap-2 font-montserrat text-sm font-medium px-5 py-4 border-b-2 transition-colors ${
              activeTab === "procedures"
                ? "border-olive text-olive"
                : "border-transparent text-charcoal-light hover:text-navy"
            }`}
            data-ocid="patient.procedures.tab"
          >
            <Receipt className="w-4 h-4" />
            My Procedures
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      <section className="bg-beige min-h-[50vh] py-10 lg:py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="max-w-2xl">
              {profileQuery.isLoading ? (
                <ProfileSkeleton />
              ) : profileQuery.isError ? (
                <div
                  className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg"
                  data-ocid="patient.profile.error_state"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="font-montserrat text-sm text-red-700">
                    Failed to load profile. Please refresh.
                  </p>
                </div>
              ) : isEditing ? (
                /* Edit Form */
                <div className="bg-white border border-[oklch(0.90_0.008_99)] rounded-xl shadow-card p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="heading-card text-lg text-navy">
                      Edit Profile
                    </h2>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="text-charcoal-light hover:text-navy transition-colors"
                      data-ocid="patient.edit.close_button"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form
                    onSubmit={handleEditSubmit}
                    noValidate
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="edit-name" className={labelClass}>
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="edit-name"
                          name="name"
                          type="text"
                          value={editForm.name}
                          onChange={handleEditChange}
                          className={inputClass}
                          data-ocid="patient.edit.name.input"
                        />
                        <FieldError msg={editErrors.name} />
                      </div>
                      <div>
                        <label htmlFor="edit-phone" className={labelClass}>
                          Phone <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="edit-phone"
                          name="phone"
                          type="tel"
                          value={editForm.phone}
                          onChange={handleEditChange}
                          className={inputClass}
                          data-ocid="patient.edit.phone.input"
                        />
                        <FieldError msg={editErrors.phone} />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="edit-email" className={labelClass}>
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="edit-email"
                        name="email"
                        type="email"
                        value={editForm.email}
                        onChange={handleEditChange}
                        className={inputClass}
                        data-ocid="patient.edit.email.input"
                      />
                      <FieldError msg={editErrors.email} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="edit-dob" className={labelClass}>
                          Date of Birth <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="edit-dob"
                          name="dateOfBirth"
                          type="date"
                          value={editForm.dateOfBirth}
                          onChange={handleEditChange}
                          className={inputClass}
                          data-ocid="patient.edit.dob.input"
                        />
                        <FieldError msg={editErrors.dateOfBirth} />
                      </div>
                      <div>
                        <label htmlFor="edit-blood" className={labelClass}>
                          Blood Group <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="edit-blood"
                          name="bloodGroup"
                          value={editForm.bloodGroup}
                          onChange={handleEditChange}
                          className={inputClass}
                          data-ocid="patient.edit.bloodgroup.select"
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
                        <FieldError msg={editErrors.bloodGroup} />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="edit-allergies" className={labelClass}>
                        Allergies{" "}
                        <span className="text-charcoal-light font-normal normal-case tracking-normal">
                          (comma-separated)
                        </span>
                      </label>
                      <input
                        id="edit-allergies"
                        name="allergies"
                        type="text"
                        value={editForm.allergies}
                        onChange={handleEditChange}
                        placeholder="e.g. Penicillin, Latex"
                        className={inputClass}
                        data-ocid="patient.edit.allergies.input"
                      />
                    </div>

                    <div>
                      <label htmlFor="edit-notes" className={labelClass}>
                        Notes
                      </label>
                      <textarea
                        id="edit-notes"
                        name="notes"
                        value={editForm.notes}
                        onChange={handleEditChange}
                        rows={3}
                        className={`${inputClass} resize-y`}
                        data-ocid="patient.edit.notes.textarea"
                      />
                    </div>

                    {updateMutation.isError && (
                      <div
                        className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded text-red-700"
                        data-ocid="patient.edit.submit.error_state"
                      >
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <p className="font-montserrat text-xs">
                          {updateMutation.error instanceof Error
                            ? updateMutation.error.message
                            : "Update failed."}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={updateMutation.isPending}
                        className="flex items-center gap-2 font-montserrat font-semibold text-sm px-5 py-2.5 rounded bg-olive text-white hover:bg-olive-dark disabled:opacity-60 transition-colors"
                        data-ocid="patient.edit.save.save_button"
                      >
                        {updateMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Saving…
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" /> Save Changes
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="font-montserrat text-sm font-medium px-5 py-2.5 rounded border border-[oklch(0.90_0.008_99)] text-charcoal hover:bg-beige transition-colors"
                        data-ocid="patient.edit.cancel.cancel_button"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* Profile View */
                <div className="bg-white border border-[oklch(0.90_0.008_99)] rounded-xl shadow-card p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="heading-card text-lg text-navy">
                      Personal Information
                    </h2>
                    <button
                      type="button"
                      onClick={startEdit}
                      className="flex items-center gap-2 font-montserrat text-sm font-medium px-4 py-2 rounded border border-[oklch(0.90_0.008_99)] text-charcoal hover:border-olive hover:text-olive transition-colors"
                      data-ocid="patient.profile.edit.edit_button"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit
                    </button>
                  </div>

                  {!profile ? (
                    <div
                      className="text-center py-10"
                      data-ocid="patient.profile.empty_state"
                    >
                      <ClipboardList className="w-10 h-10 text-charcoal-light/30 mx-auto mb-3" />
                      <p className="font-montserrat text-sm text-charcoal-light">
                        No profile data found.
                      </p>
                    </div>
                  ) : (
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                      {[
                        { label: "Full Name", value: profile.name },
                        { label: "Email", value: profile.email },
                        { label: "Phone", value: profile.phone },
                        { label: "Date of Birth", value: profile.dateOfBirth },
                        { label: "Blood Group", value: profile.bloodGroup },
                        {
                          label: "Allergies",
                          value:
                            profile.allergies.length > 0
                              ? profile.allergies.join(", ")
                              : "None reported",
                        },
                      ].map(({ label, value }) => (
                        <div key={label}>
                          <dt className="font-montserrat text-xs font-semibold tracking-[0.08em] uppercase text-charcoal-light mb-1">
                            {label}
                          </dt>
                          <dd className="font-montserrat text-sm text-charcoal">
                            {value || "—"}
                          </dd>
                        </div>
                      ))}

                      {profile.notes && (
                        <div className="sm:col-span-2">
                          <dt className="font-montserrat text-xs font-semibold tracking-[0.08em] uppercase text-charcoal-light mb-1">
                            Notes
                          </dt>
                          <dd className="font-montserrat text-sm text-charcoal leading-relaxed">
                            {profile.notes}
                          </dd>
                        </div>
                      )}
                    </dl>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Procedures Tab */}
          {activeTab === "procedures" && (
            <div className="max-w-3xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="heading-card text-lg text-navy">
                  Procedure Receipts
                </h2>
                <span className="font-montserrat text-xs text-charcoal-light">
                  {procedures.length} record{procedures.length !== 1 ? "s" : ""}
                </span>
              </div>

              {proceduresQuery.isLoading ? (
                <ProcedureSkeleton />
              ) : proceduresQuery.isError ? (
                <div
                  className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg"
                  data-ocid="patient.procedures.error_state"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="font-montserrat text-sm text-red-700">
                    Failed to load procedures. Please refresh.
                  </p>
                </div>
              ) : procedures.length === 0 ? (
                <div
                  className="bg-white border border-[oklch(0.90_0.008_99)] rounded-xl shadow-card p-12 text-center"
                  data-ocid="patient.procedures.empty_state"
                >
                  <Receipt className="w-10 h-10 text-charcoal-light/30 mx-auto mb-3" />
                  <p className="font-montserrat text-sm font-medium text-charcoal">
                    No procedures on record
                  </p>
                  <p className="font-montserrat text-xs text-charcoal-light mt-1">
                    Your procedure receipts will appear here once added by your
                    doctor.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {procedures.map((proc, idx) => (
                    <article
                      key={Number(proc.receiptId)}
                      className="bg-white border border-[oklch(0.90_0.008_99)] rounded-xl shadow-card p-6 card-luxury"
                      data-ocid={`patient.procedures.item.${idx + 1}`}
                    >
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex items-start gap-4">
                          <div className="icon-badge w-10 h-10 rounded-full flex-shrink-0">
                            <Receipt className="w-5 h-5 text-olive" />
                          </div>
                          <div>
                            <h3 className="heading-card text-base text-navy mb-1">
                              {proc.procedureName}
                            </h3>
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="flex items-center gap-1 font-montserrat text-xs text-charcoal-light">
                                <Calendar className="w-3.5 h-3.5" />
                                {proc.date}
                              </span>
                              <span className="font-montserrat text-xs text-charcoal-light">
                                Receipt #{Number(proc.receiptId)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-playfair font-bold text-xl text-navy">
                            ₹{Number(proc.cost).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>

                      {proc.doctorNotes && (
                        <div className="mt-4 pt-4 border-t border-[oklch(0.90_0.008_99)]">
                          <p className="font-montserrat text-xs font-semibold tracking-[0.08em] uppercase text-charcoal-light mb-1">
                            Doctor's Notes
                          </p>
                          <p className="font-montserrat text-sm text-charcoal leading-relaxed">
                            {proc.doctorNotes}
                          </p>
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
