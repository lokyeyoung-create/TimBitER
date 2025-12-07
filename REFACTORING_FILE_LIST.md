# TimBitER Refactoring - Comprehensive File Removal/Modification List

**Goal:** Simplify the application from 5 user roles to 2 roles (Patient, Doctor) while removing WebSocket messaging, medication management, invoice system, and other complex features to meet course requirements.

---

## 1. USER ROLES TO REMOVE: Operations, IT, Finance

### Backend - Models to DELETE
- `backend/models/ops/OpsMember.js`
- `backend/models/its/ITMember.js`
- `backend/models/finance/FinanceMember.js`
- `backend/models/finance/Invoice.js`
- `backend/models/finance/BillingReport.js`

### Backend - Controllers to DELETE
- `backend/controllers/ops/opsMemberController.js`
- `backend/controllers/its/itController.js`
- `backend/controllers/finances/financeController.js`
- `backend/controllers/finances/invoiceController.js`
- `backend/controllers/finances/reportController.js`

### Backend - Routes to DELETE
- `backend/routes/ops/opsMemberRoutes.js`
- `backend/routes/its/itRoutes.js`
- `backend/routes/finance/financeRoutes.js`

### Backend - Directories to DELETE
- `backend/controllers/ops/` (entire directory)
- `backend/controllers/its/` (entire directory)
- `backend/controllers/finances/` (entire directory)
- `backend/routes/ops/` (entire directory)
- `backend/routes/its/` (entire directory)
- `backend/routes/finance/` (entire directory)
- `backend/models/ops/` (entire directory)
- `backend/models/its/` (entire directory)
- `backend/models/finance/` (entire directory)

### Frontend - Pages to DELETE
- `frontend/src/pages/Operations/` (entire directory)
  - `DoctorDashboard.tsx`
  - `PatientDashboard.tsx`
  - `HistoryDashboard.tsx`
  - `Profile.tsx`
- `frontend/src/pages/IT/` (entire directory)
  - `PendingDashboard.tsx`
  - `ITHistory.tsx`
  - `Profile.tsx`
- `frontend/src/pages/Finance/` (entire directory)
  - `Invoices.tsx`
  - `Billing.tsx`
  - `Profile.tsx`

### Frontend - Sidebar Components to DELETE
- `frontend/src/components/sidebar/OpsSidebar.tsx`
- `frontend/src/components/sidebar/ItSidebar.tsx`
- `frontend/src/components/sidebar/FinanceSidebar.tsx`

### Frontend - API Services to DELETE
- `frontend/src/api/services/ops.service.ts`
- `frontend/src/api/services/it.service.ts`
- `frontend/src/api/services/finance.service.ts`

### Frontend - API Types to DELETE
- `frontend/src/api/types/ops.types.ts`
- `frontend/src/api/types/it.types.ts`
- `frontend/src/api/types/finance.types.ts`

### Backend - Files to MODIFY
- `backend/server.js` - Remove imports and routes for Ops, IT, Finance
  ```javascript
  // REMOVE:
  import opsMemberRoutes from "./routes/ops/opsMemberRoutes.js";
  import itMemberRoutes from "./routes/its/itRoutes.js";
  import financeMemberRoutes from "./routes/finance/financeRoutes.js";
  app.use("/api/opsMembers", opsMemberRoutes);
  app.use("/api/itMembers", itMemberRoutes);
  app.use("/api/financeMembers", financeMemberRoutes);
  ```

- `backend/models/users/User.js` - Update role enum
  ```javascript
  // CHANGE FROM:
  role: {
    type: String,
    enum: ["Doctor", "Patient", "Ops", "IT", "Finance"],
    required: true,
  },
  
  // CHANGE TO:
  role: {
    type: String,
    enum: ["Doctor", "Patient"],
    required: true,
  },
  ```

### Frontend - Files to MODIFY
- `frontend/src/App.tsx` - Remove all Ops, IT, Finance imports and routes
  - Remove `OpsDoctorDashboard`, `OpsPatientDashboard`, `OpsHistory` imports
  - Remove `ItSidebar`, `PendingDashboard`, `ITHistory` imports
  - Remove `FinanceSidebar`, `Invoices`, `Billing` imports
  - Remove related route definitions
  - Remove `OpsLayout` component
  - Remove `ItsLayout` component
  - Remove `FinanceLayout` component
  - Keep only `PatientLayout` and `DoctorLayout`

- `frontend/src/api/index.ts` - Remove Ops/IT/Finance service exports
  ```typescript
  // REMOVE:
  export { opsService } from './services/ops.service';
  export { itService } from './services/it.service';
  export { financeService } from './services/finance.service';
  export * from './types/ops.types';
  export * from './types/it.types';
  export * from './types/finance.types';
  ```

---

## 2. WEBSOCKET REAL-TIME MESSAGING SYSTEM

### Backend - Files to DELETE
- `backend/websocket/socketServer.js` (entire WebSocket server)

### Backend - Models to DELETE
- `backend/models/messaging/Conversation.js`
- `backend/models/messaging/Message.js`

### Backend - Routes to DELETE
- `backend/routes/messaging/conversations.js`

### Backend - Controllers to DELETE
- `backend/controllers/chat/chatController.js` (delete entire directory if only contains chat)

### Backend - Directories to DELETE
- `backend/websocket/` (entire directory)
- `backend/models/messaging/` (entire directory)
- `backend/routes/messaging/` (entire directory)
- `backend/controllers/chat/` (entire directory)

### Frontend - Components to DELETE
- `frontend/src/components/chats/` (entire directory - all chat UI components)
- `frontend/src/components/messages/` (entire directory - all message UI components)

### Frontend - Pages to DELETE
- `frontend/src/pages/Patients/Messages.tsx`
- `frontend/src/pages/Doctor/DoctorMessages.tsx`

### Frontend - Contexts to DELETE
- `frontend/src/contexts/WebSocketContext.tsx`

### Frontend - Hooks to DELETE
- `frontend/src/hooks/` - Any WebSocket-related hooks

### Frontend - API Services to DELETE
- `frontend/src/api/services/message.service.ts`

### Frontend - API Types to DELETE
- `frontend/src/api/types/message.types.ts`

### Backend - Files to MODIFY
- `backend/server.js` - Remove WebSocket initialization
  ```javascript
  // REMOVE:
  import socketServer from "./websocket/socketServer.js";
  import http from "http";
  import chatRoutes from "./routes/chat/chatRoutes.js";
  
  const server = http.createServer(app);
  socketServer.initialize(server);
  app.use("/api/chat", chatRoutes);
  
  // CHANGE TO:
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  ```

- `backend/package.json` - Remove WebSocket dependency
  ```json
  // REMOVE:
  "ws": "^8.18.3"
  ```

### Frontend - Files to MODIFY
- `frontend/src/App.tsx` - Remove WebSocket provider and imports
  ```typescript
  // REMOVE:
  import { WebSocketProvider } from "./contexts/WebSocketContext";
  import Messages from "./pages/Patients/Messages";
  import DoctorMessages from "./pages/Doctor/DoctorMessages";
  
  // Remove <WebSocketProvider> wrapper
  ```

- `frontend/src/api/index.ts` - Remove message service export
  ```typescript
  // REMOVE:
  export { messageService } from './services/message.service';
  export * from './types/message.types';
  ```

- `frontend/src/components/sidebar/PatientSidebar.tsx` - Remove Messages link
- `frontend/src/components/sidebar/DoctorSidebar.tsx` - Remove Messages link

---

## 3. MEDICATION MANAGEMENT SYSTEM

### Backend - Models to DELETE
- `backend/models/medications/MedOrder.js`

### Backend - Controllers to DELETE
- `backend/controllers/medications/medOrderController.js`

### Backend - Routes to DELETE
- `backend/routes/medications/medOrderRoutes.js`

### Backend - Directories to DELETE
- `backend/controllers/medications/` (entire directory)
- `backend/routes/medications/` (entire directory)
- `backend/models/medications/` (entire directory)

### Frontend - Pages to DELETE
- `frontend/src/pages/Patients/Medications.tsx`

### Frontend - API Services to DELETE
- `frontend/src/api/services/medorder.service.ts`

### Frontend - API Types to DELETE
- `frontend/src/api/types/medorder.types.ts`

### Backend - Files to MODIFY
- `backend/server.js` - Remove medication routes
  ```javascript
  // REMOVE:
  import medOrderRoutes from "./routes/medications/medOrderRoutes.js";
  app.use("/api/medorders", medOrderRoutes);
  ```

### Frontend - Files to MODIFY
- `frontend/src/App.tsx` - Remove Medications import and routes
  ```typescript
  // REMOVE:
  import Medications from "./pages/Patients/Medications";
  // Remove route: <Route path="medications" element={<Medications />} />
  ```

- `frontend/src/api/index.ts` - Remove medorder service exports
  ```typescript
  // REMOVE:
  export { medorderService } from './services/medorder.service';
  export * from './types/medorder.types';
  ```

- `frontend/src/components/sidebar/PatientSidebar.tsx` - Remove Medications link

---

## 4. INVOICE/BILLING SYSTEM

### Backend - Models to DELETE
- `backend/models/finance/Invoice.js` (already listed above in section 1)
- `backend/models/finance/BillingReport.js` (already listed above in section 1)

### Backend - Controllers to DELETE
- `backend/controllers/finances/invoiceController.js` (already listed above in section 1)
- `backend/controllers/finances/reportController.js` (already listed above in section 1)

### Frontend - Pages to DELETE
- `frontend/src/pages/Patients/ViewInvoices.tsx`

### Backend - Files to MODIFY
- `backend/models/patients/Patient.js` - Remove invoice-related fields if present

### Frontend - Files to MODIFY
- `frontend/src/App.tsx` - Remove ViewInvoices import and routes
  ```typescript
  // REMOVE:
  import ViewInvoices from "pages/Patients/ViewInvoices";
  // Remove route: <Route path="invoices" element={<ViewInvoices />} />
  ```

- `frontend/src/components/sidebar/PatientSidebar.tsx` - Remove Invoices/Billing links

---

## 5. PATIENT CHANGE REQUEST WORKFLOW

### Backend - Models to DELETE
- `backend/models/tickets/PatientRequestTicket.js`

### Backend - Controllers to DELETE
- `backend/controllers/tickets/patientRequestChangeController.js`

### Backend - Routes to DELETE
- `backend/routes/tickets/patientRequestChangeRoutes.js`

### Frontend - Pages to DELETE
- `frontend/src/pages/Patients/PatientEditRequest.tsx`

### Backend - Files to MODIFY
- `backend/server.js` - Remove patient request change routes
  ```javascript
  // REMOVE:
  import patientRequestChangeRoutes from "./routes/tickets/patientRequestChangeRoutes.js";
  app.use("/api/tickets/patientChange", patientRequestChangeRoutes);
  ```

### Frontend - Files to MODIFY
- `frontend/src/App.tsx` - Remove PatientEditRequest import and routes
  ```typescript
  // REMOVE:
  import PatientEditRequest from "pages/Patients/PatientEditRequest";
  // Remove route: <Route path="edit-request" element={<PatientEditRequest />} />
  ```

---

## 6. REMOVE INSURANCE CARD UPLOAD FUNCTIONALITY

### Backend - Files to MODIFY
- `backend/models/patients/Patient.js` - Remove insuranceCard/insuranceCardUrl fields if present

### Frontend - Pages to MODIFY
- `frontend/src/pages/Patients/Insurance.tsx` - Delete this page entirely, or remove insurance card upload
  - **Decision:** DELETE entirely if only contains insurance management
  - OR MODIFY if contains other patient insurance info

### Frontend - Files to MODIFY
- `frontend/src/App.tsx` - Remove Insurance import and routes if deleting page
  ```typescript
  // REMOVE:
  import Insurance from "./pages/Patients/Insurance";
  // Remove route: <Route path="insurance" element={<Insurance />} />
  ```

- `frontend/src/components/sidebar/PatientSidebar.tsx` - Remove Insurance link

---

## 7. TICKET SYSTEM SIMPLIFICATION

### Backend - Models to KEEP (with modifications)
- `backend/models/tickets/DoctorAccountCreationRequest.js` - **KEEP** (for doctor registration approval)

### Backend - Models to DELETE
- `backend/models/tickets/DoctorRequestTicket.js` - Remove doctor request change workflow
- `backend/models/tickets/BugTicket.js` - Remove IT bug reporting system

### Backend - Controllers to DELETE
- `backend/controllers/tickets/bugTicketController.js`
- `backend/controllers/tickets/doctorRequestChangeController.js`

### Backend - Routes to DELETE
- `backend/routes/tickets/bugTicketRoutes.js`
- `backend/routes/tickets/doctorRequestChangeRoutes.js`

### Frontend - Pages to DELETE
- `frontend/src/pages/General/BugReport.tsx` - Delete bug report page

### Backend - Files to MODIFY
- `backend/server.js` - Remove unnecessary ticket routes
  ```javascript
  // REMOVE:
  import bugTicketRoutes from "./routes/tickets/bugTicketRoutes.js";
  import doctorRequestChangeRoutes from "./routes/tickets/doctorRequestChangeRoutes.js";
  app.use("/api/tickets/bugTicket", bugTicketRoutes);
  app.use("/api/tickets/doctorChange", doctorRequestChangeRoutes);
  ```

### Frontend - Files to MODIFY
- `frontend/src/App.tsx` - Remove BugReportPage import and routes
  ```typescript
  // REMOVE:
  import BugReportPage from "./pages/General/BugReport";
  // Remove route
  ```

---

## 8. APPOINTMENT SYSTEM SIMPLIFICATION

### Backend - Files to REVIEW & POTENTIALLY SIMPLIFY
- `backend/controllers/doctors/availabilityController.js` - Simplify if overly complex
- `backend/models/doctors/Availability.js` - Keep but may simplify
- `backend/controllers/appointments/appointmentController.js` - Keep, review for simplification

### Frontend - Pages to REVIEW
- `frontend/src/pages/Patients/Appointments/Appointments.tsx` - Keep
- `frontend/src/pages/Patients/Appointments/[id]/index.tsx` - Keep
- `frontend/src/pages/Doctor/Appointments/DoctorAppointments.tsx` - Keep
- `frontend/src/pages/Doctor/Appointments/[id].tsx` - Keep

**Action:** Keep appointment system but review for unnecessary complexity

---

## 9. FILES TO DELETE (General/Other)

### Frontend - Pages to DELETE
- `frontend/src/pages/Onboarding/Staff/StaffOnboarding.tsx` - Simplify onboarding (no need for Ops/IT/Finance)
- `frontend/src/pages/Onboarding/Staff/` - May need revision if only contains non-Doctor staff

### Frontend - Components to DELETE
- `frontend/src/components/sidebar/` - Remove any Ops/IT/Finance sidebar components (already listed above)

### Frontend - Context/Hooks to DELETE
- `frontend/src/contexts/SignUpContext.tsx` - May need revision to remove Ops/IT/Finance roles

### Backend - Routes to DELETE
- `backend/routes/tickets/bugTicketRoutes.js`
- `backend/routes/tickets/doctorRequestChangeRoutes.js`
- Any other ticket route files not needed

---

## 10. FILES TO MODIFY (Critical Updates)

### Backend - MUST MODIFY
1. **`backend/server.js`** - Remove all Ops, IT, Finance, WebSocket, and unnecessary imports
2. **`backend/models/users/User.js`** - Update role enum to only ["Doctor", "Patient"]
3. **`backend/middleware/authentication.js`** - May need minor updates for role checking
4. **`backend/controllers/auth/authController.js`** - Update to only handle Doctor/Patient registration
5. **`backend/routes/auth/authRoutes.js`** - Update to match simplified auth flow
6. **`backend/controllers/patients/patientController.js`** - Review for Ops/IT references
7. **`backend/controllers/doctors/doctorController.js`** - Review for Ops/IT references
8. **`backend/package.json`** - Remove "ws" dependency for WebSocket

### Frontend - MUST MODIFY
1. **`frontend/src/App.tsx`** - Major cleanup: remove all Ops/IT/Finance routes and providers
2. **`frontend/src/api/index.ts`** - Remove unnecessary service exports
3. **`frontend/src/contexts/AuthContext.tsx`** - May need updates for role verification
4. **`frontend/src/contexts/SignUpContext.tsx`** - Simplify to only Patient/Doctor roles
5. **`frontend/src/components/sidebar/PatientSidebar.tsx`** - Remove removed features links
6. **`frontend/src/components/sidebar/DoctorSidebar.tsx`** - Remove removed features links
7. **`frontend/src/pages/Onboarding/RollSelection.tsx`** - Simplify to only Patient/Doctor
8. **`frontend/src/pages/Onboarding/SignUp1.tsx`** - Update validation for only 2 roles
9. **`frontend/src/pages/Onboarding/SignUp2.tsx`** - Update for simplified roles
10. **`frontend/src/pages/Onboarding/SignUp3.tsx`** - Update for simplified roles

---

## 11. FILES TO KEEP (Core Functionality)

### Backend - KEEP
- `backend/models/users/User.js` (modify as noted)
- `backend/models/patients/Patient.js` (remove insurance card fields)
- `backend/models/doctors/Doctor.js`
- `backend/models/appointments/Appointment.js`
- `backend/models/doctors/Availability.js`
- `backend/models/tickets/DoctorAccountCreationRequest.js`
- `backend/controllers/auth/authController.js`
- `backend/controllers/patients/patientController.js`
- `backend/controllers/doctors/doctorController.js`
- `backend/controllers/appointments/appointmentController.js`
- `backend/controllers/doctors/availabilityController.js`
- `backend/controllers/tickets/doctorAccountCreationController.js`
- `backend/routes/auth/authRoutes.js`
- `backend/routes/patients/patientRoutes.js`
- `backend/routes/doctors/doctorRoutes.js`
- `backend/routes/appointments/appointmentRoutes.js`
- `backend/routes/doctors/availabilityRoutes.js`
- `backend/routes/tickets/doctorAccountCreationRoutes.js`
- All config files (`config/db.js`, `config/redis.js`)
- `backend/utils/` directory

### Frontend - KEEP
- `frontend/src/pages/Onboarding/` (with simplifications)
- `frontend/src/pages/Login/` (keep LoginScreen, ForgotPassword, ResetPassword)
- `frontend/src/pages/Error/ErrorPage.tsx`
- `frontend/src/pages/Patients/Dashboard.tsx`
- `frontend/src/pages/Patients/Profile.tsx`
- `frontend/src/pages/Patients/MedicalRecords.tsx`
- `frontend/src/pages/Patients/Appointments/`
- `frontend/src/pages/Doctor/DoctorDashboard.tsx`
- `frontend/src/pages/Doctor/Patients/`
- `frontend/src/pages/Doctor/Appointments/`
- `frontend/src/pages/Doctor/Profile/`
- `frontend/src/components/sidebar/PatientSidebar.tsx` (modified)
- `frontend/src/components/sidebar/DoctorSidebar.tsx` (modified)
- `frontend/src/api/services/auth.service.ts`
- `frontend/src/api/services/patient.service.ts`
- `frontend/src/api/services/doctor.service.ts`
- `frontend/src/api/services/appointment.service.ts`
- `frontend/src/api/services/availability.service.ts`
- `frontend/src/api/services/user.service.ts`
- `frontend/src/api/services/ticket.service.ts` (keep for doctor account creation)
- `frontend/src/contexts/AuthContext.tsx` (modify)
- Core styling and components

---

## 12. NEW FEATURES TO ADD

### Backend - NEW CONTROLLERS/ROUTES NEEDED
1. **External API Integration** - New controller for health data API calls
   - Create: `backend/controllers/external/externalApiController.js`
   - Create: `backend/routes/external/externalApiRoutes.js`

2. **Search Feature** - New search API integration
   - Add methods to: `backend/controllers/external/externalApiController.js`

3. **Following System** - New model and controller
   - Create: `backend/models/social/Following.js` (or add fields to User model)
   - Create: `backend/controllers/social/followingController.js`
   - Create: `backend/routes/social/followingRoutes.js`

### Frontend - NEW PAGES NEEDED
1. Create: `frontend/src/pages/General/Search.tsx` - Search page `/search`
2. Create: `frontend/src/pages/General/SearchResults.tsx` - Results page `/search/{criteria}`
3. Create: `frontend/src/pages/General/Details.tsx` - Details page `/details/{id}`
4. Create: `frontend/src/pages/General/Privacy.tsx` - Privacy policy page

### Frontend - NEW COMPONENTS NEEDED
1. Create: `frontend/src/components/search/SearchBar.tsx`
2. Create: `frontend/src/components/search/SearchResults.tsx`
3. Create: `frontend/src/components/api/ExternalDataDisplay.tsx`

### Frontend - NEW API SERVICES NEEDED
1. Create: `frontend/src/api/services/external.service.ts` - External API integration
2. Create: `frontend/src/api/services/following.service.ts` - Following system

---

## Summary Statistics

### Files to DELETE
- Backend Models: 11 files
- Backend Controllers: 8 directories/files
- Backend Routes: 8 directories/files
- Backend WebSocket: 1 directory
- Frontend Pages: 12+ pages
- Frontend Sidebars: 3 components
- Frontend API Services: 5 services
- Frontend API Types: 5 type files
- Frontend Components: 2 directories (chats, messages)
- Frontend Context: 1 context

**Total Estimated Files to Delete: 60-80 files**

### Files to MODIFY
- Backend: 8 critical files
- Frontend: 10+ critical files

**Total Estimated Files to Modify: 20-25 files**

### Files to CREATE (New Features)
- Backend Controllers/Routes: 3 new files
- Frontend Pages: 4 new pages
- Frontend Components: 3 new components
- Frontend Services: 2 new services

**Total New Files to Create: 12 files**

---

## Recommended Deletion Order

1. Start with directories (Ops, IT, Finance models, controllers, routes)
2. Delete WebSocket system
3. Delete Medication system
4. Delete Messaging system
5. Delete removed ticket systems
6. Clean up Frontend pages and sidebars
7. Update critical files (server.js, User.js, App.tsx)
8. Remove context providers and imports
9. Clean up API services and types
10. Add new feature files for search, external API, following system
