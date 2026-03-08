import List "mo:core/List";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";

actor {
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

  module Appointment {
    public func compare(appointment1 : Appointment, appointment2 : Appointment) : Order.Order {
      switch (Text.compare(appointment1.preferredDate, appointment2.preferredDate)) {
        case (#equal) { Text.compare(appointment1.fullName, appointment2.fullName) };
	      case (order) { order };
      };
    };
  };

  let appointments = List.empty<Appointment>();

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

  public query ({ caller }) func getAllAppointments() : async [Appointment] {
    appointments.toArray().sort();
  };
};
