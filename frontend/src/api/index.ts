// Export all services
export { authService } from './services/auth.service';
export { userService } from './services/user.service';
export { patientService } from './services/patient.service';
export { doctorService } from './services/doctor.service';
export { appointmentService } from './services/appointment.service';
export { availabilityService } from './services/availability.service';
export { ticketService } from './services/ticket.service';
export * from './services/follow.service';
export * from './services/bookmark.service';

// Export types
export * from './types/user.types';
export * from './types/patient.types';
export * from './types/doctor.types';
export * from './types/appointment.types';
export * from './types/availability.types';
export * from './types/ticket.types';
