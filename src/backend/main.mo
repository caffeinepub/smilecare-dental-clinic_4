import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Iter "mo:core/Iter";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

// Specify the migration module in the with-clause to perform transformations on upgrade

actor {
  type Role = {
    #doctor;
    #patient;
  };

  type TimeOfDay = {
    #morning;
    #afternoon;
    #evening;
  };

  type Appointment = {
    fullName : Text;
    phoneNumber : Text;
    email : Text;
    preferredDate : Text;
    preferredTime : TimeOfDay;
    serviceNeeded : Text;
    message : ?Text;
  };

  type PatientProfile = {
    name : Text;
    email : Text;
    phone : Text;
    dateOfBirth : Text;
    bloodGroup : Text;
    allergies : [Text];
    notes : Text;
  };

  type ProcedureRecord = {
    procedureName : Text;
    date : Text;
    cost : Nat;
    doctorNotes : Text;
    receiptId : Nat;
  };

  // UserProfile type required by frontend
  public type UserProfile = PatientProfile;

  module Appointment {
    public func compare(appointment1 : Appointment, appointment2 : Appointment) : Order.Order {
      switch (Text.compare(appointment1.preferredDate, appointment2.preferredDate)) {
        case (#equal) { Text.compare(appointment1.fullName, appointment2.fullName) };
        case (order) { order };
      };
    };
  };

  // Initialize mixin with access control state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  var nextReceiptId = 1;

  let appointments = List.empty<Appointment>();
  let patientProfiles = Map.empty<Principal, PatientProfile>();
  let procedures = Map.empty<Principal, List.List<ProcedureRecord>>();
  let registeredDoctors = Map.empty<Principal, ()>();

  // Admin-only: Register a doctor principal
  public shared ({ caller }) func addDoctorPrincipal(doctorPrincipal : Principal) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can add doctor principals");
    };
    registeredDoctors.add(doctorPrincipal, ());
  };

  // Returns the caller's role in the dental clinic system
  public query ({ caller }) func getMyRole() : async ?Role {
    if (registeredDoctors.containsKey(caller)) {
      return ?#doctor;
    };
    if (patientProfiles.containsKey(caller)) {
      return ?#patient;
    };
    null;
  };

  // Public: Anyone can submit an appointment request
  public shared ({ caller }) func submitAppointment(
    fullName : Text,
    phoneNumber : Text,
    email : Text,
    preferredDate : Text,
    preferredTime : TimeOfDay,
    serviceNeeded : Text,
    message : ?Text,
  ) : async () {
    let appointment : Appointment = {
      fullName;
      phoneNumber;
      email;
      preferredDate;
      preferredTime;
      serviceNeeded;
      message;
    };
    appointments.add(appointment);
  };

  // Doctor-only: View all appointments
  public query ({ caller }) func getAllAppointments() : async [Appointment] {
    if (not isDoctor(caller)) {
      Runtime.trap("Unauthorized: Only doctors can access all appointments");
    };
    appointments.toArray().sort();
  };

  // Public: Patients can self-register
  public shared ({ caller }) func registerPatientProfile(
    name : Text,
    email : Text,
    phone : Text,
    dateOfBirth : Text,
    bloodGroup : Text,
    allergies : [Text],
    notes : Text,
  ) : async () {
    // Check if already registered
    if (patientProfiles.containsKey(caller)) {
      Runtime.trap("Profile already exists. Use updatePatientProfile to modify.");
    };
    
    let profile : PatientProfile = {
      name;
      email;
      phone;
      dateOfBirth;
      bloodGroup;
      allergies;
      notes;
    };
    patientProfiles.add(caller, profile);
  };

  // Patient can update their own profile
  public shared ({ caller }) func updatePatientProfile(
    name : Text,
    email : Text,
    phone : Text,
    dateOfBirth : Text,
    bloodGroup : Text,
    allergies : [Text],
    notes : Text,
  ) : async () {
    // Verify caller has a profile (is a patient)
    switch (patientProfiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found. Use registerPatientProfile first.") };
      case (?_existing) {
        let updatedProfile : PatientProfile = {
          name;
          email;
          phone;
          dateOfBirth;
          bloodGroup;
          allergies;
          notes;
        };
        patientProfiles.add(caller, updatedProfile);
      };
    };
  };

  // Patient can view their own profile
  public query ({ caller }) func getMyProfile() : async ?PatientProfile {
    patientProfiles.get(caller);
  };

  // Doctor-only: View any patient's profile
  public query ({ caller }) func getPatientProfile(patientPrincipal : Principal) : async ?PatientProfile {
    if (not isDoctor(caller)) {
      Runtime.trap("Unauthorized: Only doctors can view patient profiles");
    };
    patientProfiles.get(patientPrincipal);
  };

  // Doctor-only: Add a procedure record to a patient
  public shared ({ caller }) func addProcedureRecord(
    patient : Principal,
    procedureName : Text,
    date : Text,
    cost : Nat,
    doctorNotes : Text,
  ) : async () {
    if (not isDoctor(caller)) {
      Runtime.trap("Unauthorized: Only doctors can add procedure records");
    };

    let record : ProcedureRecord = {
      procedureName;
      date;
      cost;
      doctorNotes;
      receiptId = nextReceiptId;
    };
    nextReceiptId += 1;

    let existingRecords = switch (procedures.get(patient)) {
      case (null) { List.empty<ProcedureRecord>() };
      case (?records) { records };
    };
    existingRecords.add(record);
    procedures.add(patient, existingRecords);
  };

  // Patient can view their own procedure records
  public query ({ caller }) func getMyProcedures() : async [ProcedureRecord] {
    switch (procedures.get(caller)) {
      case (null) { [] };
      case (?records) { records.toArray() };
    };
  };

  // Doctor-only: View any patient's procedure records
  public query ({ caller }) func getPatientProcedures(patient : Principal) : async [ProcedureRecord] {
    if (not isDoctor(caller)) {
      Runtime.trap("Unauthorized: Only doctors can view patient procedures");
    };

    switch (procedures.get(patient)) {
      case (null) { [] };
      case (?records) { records.toArray() };
    };
  };

  // Required by frontend: Get caller's user profile
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    patientProfiles.get(caller);
  };

  // Required by frontend: Save caller's user profile
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    patientProfiles.add(caller, profile);
  };

  // Required by frontend: Get another user's profile (doctor-only or own profile)
  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not isDoctor(caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile unless you are a doctor");
    };
    patientProfiles.get(user);
  };

  // Helper function to check if a principal is a registered doctor
  func isDoctor(principal : Principal) : Bool {
    registeredDoctors.containsKey(principal);
  };
};
