import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Appointment {
    fullName: string;
    email: string;
    message?: string;
    preferredDate: string;
    preferredTime: TimeOfDay;
    phoneNumber: string;
    serviceNeeded: string;
}
export enum TimeOfDay {
    morning = "morning",
    evening = "evening",
    afternoon = "afternoon"
}
export interface backendInterface {
    getAllAppointments(): Promise<Array<Appointment>>;
    submitAppointment(fullName: string, phoneNumber: string, email: string, preferredDate: string, preferredTime: TimeOfDay, serviceNeeded: string, message: string | null): Promise<void>;
}
