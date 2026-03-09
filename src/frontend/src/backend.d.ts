import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ProcedureRecord {
    doctorNotes: string;
    cost: bigint;
    date: string;
    procedureName: string;
    receiptId: bigint;
}
export interface PatientProfile {
    dateOfBirth: string;
    name: string;
    email: string;
    bloodGroup: string;
    notes: string;
    phone: string;
    allergies: Array<string>;
}
export interface Appointment {
    fullName: string;
    email: string;
    message?: string;
    preferredDate: string;
    preferredTime: TimeOfDay;
    phoneNumber: string;
    serviceNeeded: string;
}
export interface UserProfile {
    dateOfBirth: string;
    name: string;
    email: string;
    bloodGroup: string;
    notes: string;
    phone: string;
    allergies: Array<string>;
}
export enum Role {
    patient = "patient",
    doctor = "doctor"
}
export enum TimeOfDay {
    morning = "morning",
    evening = "evening",
    afternoon = "afternoon"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addDoctorPrincipal(doctorPrincipal: Principal): Promise<void>;
    addProcedureRecord(patient: Principal, procedureName: string, date: string, cost: bigint, doctorNotes: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllAppointments(): Promise<Array<Appointment>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMyProcedures(): Promise<Array<ProcedureRecord>>;
    getMyProfile(): Promise<PatientProfile | null>;
    getMyRole(): Promise<Role | null>;
    getPatientProcedures(patient: Principal): Promise<Array<ProcedureRecord>>;
    getPatientProfile(patientPrincipal: Principal): Promise<PatientProfile | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    registerPatientProfile(name: string, email: string, phone: string, dateOfBirth: string, bloodGroup: string, allergies: Array<string>, notes: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitAppointment(fullName: string, phoneNumber: string, email: string, preferredDate: string, preferredTime: TimeOfDay, serviceNeeded: string, message: string | null): Promise<void>;
    updatePatientProfile(name: string, email: string, phone: string, dateOfBirth: string, bloodGroup: string, allergies: Array<string>, notes: string): Promise<void>;
}
