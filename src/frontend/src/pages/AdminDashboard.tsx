import { Link } from "@tanstack/react-router";
import { Loader2, ShieldAlert, Users } from "lucide-react";
import { useEffect, useState } from "react";
import type { Appointment } from "../backend.d";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

type AdminState =
  | { status: "loading" }
  | { status: "denied" }
  | { status: "ready"; appointments: Appointment[] };

function TimeOfDayBadge({ time }: { time: string }) {
  const colors: Record<string, string> = {
    morning: "bg-amber-100 text-amber-800",
    afternoon: "bg-blue-100 text-blue-800",
    evening: "bg-indigo-100 text-indigo-800",
  };
  const color = colors[time] ?? "bg-gray-100 text-gray-700";
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded font-montserrat text-xs font-medium capitalize ${color}`}
    >
      {time}
    </span>
  );
}

export default function AdminDashboard() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  const [state, setState] = useState<AdminState>({ status: "loading" });

  useEffect(() => {
    if (isFetching) return;
    if (!identity || !actor) {
      setState({ status: "denied" });
      return;
    }

    async function init() {
      if (!actor) return;
      setState({ status: "loading" });
      try {
        const [isAdmin, appointments] = await Promise.all([
          actor.isCallerAdmin(),
          actor.getAllAppointments(),
        ]);
        if (!isAdmin) {
          setState({ status: "denied" });
        } else {
          setState({ status: "ready", appointments });
        }
      } catch {
        setState({ status: "denied" });
      }
    }

    init();
  }, [identity, actor, isFetching]);

  return (
    <>
      {/* ===== Page Header ===== */}
      <section
        className="py-20 lg:py-24 text-center"
        style={{ background: "oklch(0.18 0.065 255)" }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <span className="eyebrow text-white/50 mb-6">Administration</span>
          <h1 className="heading-display text-4xl lg:text-5xl text-white mt-6">
            Admin Dashboard
          </h1>
          <p className="font-montserrat text-base text-white/60 mt-4">
            VENUS Oral-Dental Care Clinic — Appointment Management
          </p>
        </div>
      </section>

      {/* ===== Main Content ===== */}
      <section className="bg-beige py-16 lg:py-20 min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Loading state */}
          {state.status === "loading" && (
            <div
              className="flex flex-col items-center justify-center py-20 gap-4"
              data-ocid="admin.loading_state"
            >
              <Loader2 className="w-10 h-10 text-navy animate-spin" />
              <p className="font-montserrat text-sm text-charcoal-light">
                Verifying access and loading data…
              </p>
            </div>
          )}

          {/* Access denied */}
          {state.status === "denied" && (
            <div
              className="flex flex-col items-center justify-center py-20 gap-6 text-center"
              data-ocid="admin.access_denied.error_state"
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ background: "oklch(0.18 0.065 255 / 0.1)" }}
              >
                <ShieldAlert className="w-10 h-10 text-navy" />
              </div>
              <div>
                <h2 className="heading-card text-2xl text-navy mb-3">
                  Access Denied
                </h2>
                <p className="font-montserrat text-sm text-charcoal-light max-w-sm">
                  {!identity
                    ? "You must be logged in with an admin account to view this page."
                    : "Your account does not have admin privileges. Please contact the clinic administrator."}
                </p>
              </div>
              <Link
                to="/"
                className="inline-flex items-center gap-2 font-montserrat text-sm font-semibold px-6 py-3 rounded bg-navy text-white hover:bg-navy/90 transition-colors"
                data-ocid="admin.access_denied.button"
              >
                Return to Home
              </Link>
            </div>
          )}

          {/* Ready state */}
          {state.status === "ready" && (
            <div>
              {/* Stats bar */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: "oklch(0.18 0.065 255)" }}
                  >
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-montserrat text-xs text-charcoal-light uppercase tracking-widest">
                      Total Appointments
                    </p>
                    <p className="font-playfair text-2xl font-semibold text-navy">
                      {state.appointments.length}
                    </p>
                  </div>
                </div>
                <p className="font-montserrat text-xs text-charcoal-light">
                  Showing all submitted appointment requests
                </p>
              </div>

              {/* Empty state */}
              {state.appointments.length === 0 ? (
                <div
                  className="bg-white border border-[oklch(0.90_0.008_99)] rounded-lg p-16 flex flex-col items-center text-center gap-4"
                  data-ocid="admin.empty_state"
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: "oklch(0.96 0.025 99)" }}
                  >
                    <Users className="w-8 h-8 text-charcoal-light" />
                  </div>
                  <h3 className="heading-card text-xl text-navy">
                    No Appointments Yet
                  </h3>
                  <p className="font-montserrat text-sm text-charcoal-light max-w-sm">
                    Appointment submissions will appear here once patients start
                    booking through the website.
                  </p>
                </div>
              ) : (
                /* Appointments table */
                <div className="bg-white border border-[oklch(0.90_0.008_99)] rounded-lg shadow-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full" data-ocid="admin.table.table">
                      <thead>
                        <tr
                          className="border-b border-[oklch(0.90_0.008_99)]"
                          style={{ background: "oklch(0.18 0.065 255)" }}
                        >
                          {[
                            "#",
                            "Name",
                            "Phone",
                            "Email",
                            "Service",
                            "Date",
                            "Time",
                            "Message",
                          ].map((col) => (
                            <th
                              key={col}
                              className="text-left px-4 py-3.5 font-montserrat text-xs font-semibold tracking-[0.1em] uppercase text-white/80 whitespace-nowrap"
                            >
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {state.appointments.map((appt, idx) => (
                          <tr
                            key={`${appt.email}-${appt.preferredDate}-${idx}`}
                            className="border-b border-[oklch(0.90_0.008_99)] hover:bg-beige/60 transition-colors"
                            data-ocid={`admin.row.item.${idx + 1}`}
                          >
                            <td className="px-4 py-3.5 font-montserrat text-xs text-charcoal-light font-medium">
                              {idx + 1}
                            </td>
                            <td className="px-4 py-3.5 font-montserrat text-sm text-navy font-medium whitespace-nowrap">
                              {appt.fullName}
                            </td>
                            <td className="px-4 py-3.5 font-montserrat text-sm text-charcoal whitespace-nowrap">
                              <a
                                href={`tel:${appt.phoneNumber}`}
                                className="hover:text-navy transition-colors"
                              >
                                {appt.phoneNumber}
                              </a>
                            </td>
                            <td className="px-4 py-3.5 font-montserrat text-sm text-charcoal">
                              <a
                                href={`mailto:${appt.email}`}
                                className="hover:text-navy transition-colors"
                              >
                                {appt.email}
                              </a>
                            </td>
                            <td className="px-4 py-3.5 font-montserrat text-sm text-charcoal whitespace-nowrap">
                              {appt.serviceNeeded}
                            </td>
                            <td className="px-4 py-3.5 font-montserrat text-sm text-charcoal whitespace-nowrap">
                              {appt.preferredDate}
                            </td>
                            <td className="px-4 py-3.5">
                              <TimeOfDayBadge
                                time={String(appt.preferredTime)}
                              />
                            </td>
                            <td className="px-4 py-3.5 font-montserrat text-sm text-charcoal max-w-[200px]">
                              <span
                                className="block truncate"
                                title={appt.message ?? ""}
                              >
                                {appt.message ?? (
                                  <span className="text-charcoal-light italic">
                                    —
                                  </span>
                                )}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
