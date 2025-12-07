# TimBitER Refactoring - Complete File Path List

## Backend Files to DELETE

### Models
```
backend/models/ops/OpsMember.js
backend/models/ops/
backend/models/its/ITMember.js
backend/models/its/
backend/models/finance/FinanceMember.js
backend/models/finance/Invoice.js
backend/models/finance/BillingReport.js
backend/models/finance/
backend/models/medications/MedOrder.js
backend/models/medications/
backend/models/messaging/Conversation.js
backend/models/messaging/Message.js
backend/models/messaging/
backend/models/tickets/BugTicket.js
backend/models/tickets/PatientRequestTicket.js
```

### Controllers
```
backend/controllers/ops/opsMemberController.js
backend/controllers/ops/
backend/controllers/its/itController.js
backend/controllers/its/
backend/controllers/finances/financeController.js
backend/controllers/finances/invoiceController.js
backend/controllers/finances/reportController.js
backend/controllers/finances/
backend/controllers/medications/medOrderController.js
backend/controllers/medications/
backend/controllers/chat/chatController.js
backend/controllers/chat/
backend/controllers/tickets/bugTicketController.js
backend/controllers/tickets/patientRequestChangeController.js
```

### Routes
```
backend/routes/ops/opsMemberRoutes.js
backend/routes/ops/
backend/routes/its/itRoutes.js
backend/routes/its/
backend/routes/finance/financeRoutes.js
backend/routes/finance/
backend/routes/medications/medOrderRoutes.js
backend/routes/medications/
backend/routes/messaging/conversations.js
backend/routes/messaging/
backend/routes/chat/chatRoutes.js
backend/routes/chat/
backend/routes/tickets/bugTicketRoutes.js
backend/routes/tickets/patientRequestChangeRoutes.js
```

### WebSocket
```
backend/websocket/socketServer.js
backend/websocket/
```

---

## Frontend Files to DELETE

### Pages
```
frontend/src/pages/Operations/DoctorDashboard.tsx
frontend/src/pages/Operations/PatientDashboard.tsx
frontend/src/pages/Operations/HistoryDashboard.tsx
frontend/src/pages/Operations/Profile.tsx
frontend/src/pages/Operations/
frontend/src/pages/IT/PendingDashboard.tsx
frontend/src/pages/IT/ITHistory.tsx
frontend/src/pages/IT/Profile.tsx
frontend/src/pages/IT/
frontend/src/pages/Finance/Invoices.tsx
frontend/src/pages/Finance/Billing.tsx
frontend/src/pages/Finance/Profile.tsx
frontend/src/pages/Finance/
frontend/src/pages/Patients/Messages.tsx
frontend/src/pages/Patients/PatientEditRequest.tsx
frontend/src/pages/Patients/ViewInvoices.tsx
frontend/src/pages/Patients/Insurance.tsx
frontend/src/pages/Patients/Medications.tsx
frontend/src/pages/Doctor/DoctorMessages.tsx
frontend/src/pages/General/BugReport.tsx
```

### Components
```
frontend/src/components/sidebar/OpsSidebar.tsx
frontend/src/components/sidebar/ItSidebar.tsx
frontend/src/components/sidebar/FinanceSidebar.tsx
frontend/src/components/chats/
frontend/src/components/messages/
```

### Contexts
```
frontend/src/contexts/WebSocketContext.tsx
```

### API Services
```
frontend/src/api/services/ops.service.ts
frontend/src/api/services/it.service.ts
frontend/src/api/services/finance.service.ts
frontend/src/api/services/medorder.service.ts
frontend/src/api/services/message.service.ts
```

### API Types
```
frontend/src/api/types/ops.types.ts
frontend/src/api/types/it.types.ts
frontend/src/api/types/finance.types.ts
frontend/src/api/types/medorder.types.ts
frontend/src/api/types/message.types.ts
```

### Directories to Remove
```
frontend/src/Bugs/
frontend/src/Operations/
frontend/src/IT/
```

---

## Backend Files to MODIFY

### Priority 1 (Critical - Must Do First)
1. **`backend/server.js`**
   - Remove: `import http from "http"`
   - Remove: `import socketServer from "./websocket/socketServer.js"`
   - Remove: Imports for opsMemberRoutes, itMemberRoutes, financeMemberRoutes, medOrderRoutes, bugTicketRoutes, patientRequestChangeRoutes, doctorRequestChangeRoutes, chatRoutes, availabilityRoutes (optional simplify)
   - Remove: `const server = http.createServer(app); socketServer.initialize(server);`
   - Remove: All app.use() calls for deleted routes
   - Update: Change to `app.listen(PORT, ...)`
   - Keep: User, Patient, Doctor, Appointment routes only

2. **`backend/models/users/User.js`**
   - Update role enum from: `["Doctor", "Patient", "Ops", "IT", "Finance"]`
   - To: `["Doctor", "Patient"]`
   - Remove messaging-related fields if they're WebSocket-specific (isOnline, lastActive, etc.)
   - Remove: messagingPreferences object if not needed

3. **`backend/package.json`**
   - Remove: `"ws": "^8.18.3"`

### Priority 2 (Important - Update Next)
4. **`backend/models/patients/Patient.js`**
   - Review and remove: insuranceCard, insuranceCardUrl fields if present

5. **`backend/controllers/auth/authController.js`**
   - Review role validation - ensure only "Doctor" and "Patient" are allowed
   - Check registration logic to prevent other roles

6. **`backend/controllers/patients/patientController.js`**
   - Remove any references to Ops/IT/Finance roles

7. **`backend/controllers/doctors/doctorController.js`**
   - Remove any references to Ops/IT/Finance roles

8. **`backend/middleware/authentication.js`**
   - Review and ensure role checks work with only 2 roles

---

## Frontend Files to MODIFY

### Priority 1 (Critical - Must Do First)
1. **`frontend/src/App.tsx`** - MAJOR FILE (~400 lines, needs ~50% removal)
   - Remove ALL imports related to Operations, IT, Finance pages
   - Remove: Ops/IT/Finance sidebar imports
   - Remove: Messages, DoctorMessages imports
   - Remove: WebSocketProvider import
   - Remove: WebSocketProvider wrapping the entire app
   - Remove: OpsLayout, ItsLayout, FinanceLayout component definitions
   - Remove: All route definitions for deleted pages (OpsDoctor, OpsPatient, OpsHistory, ITPages, FinancePages, Messages, etc.)
   - Keep: PatientLayout, DoctorLayout only
   - Keep: Auth routes, Onboarding routes, Patient routes, Doctor routes, Appointment routes
   - Simplify: Remove unnecessary route nesting for deleted roles

2. **`frontend/src/api/index.ts`**
   - Remove exports: opsService, itService, financeService, medorderService, messageService
   - Remove types: ops.types, it.types, finance.types, medorder.types, message.types

3. **`frontend/src/package.json`** (if it has WebSocket dependency)
   - Remove any WebSocket-related dependencies if present

### Priority 2 (Important - Update Next)
4. **`frontend/src/contexts/SignUpContext.tsx`**
   - Update role selection to only Patient and Doctor
   - Remove Ops/IT/Finance role logic

5. **`frontend/src/contexts/AuthContext.tsx`**
   - Review role-based access control
   - Remove references to deleted roles in permission checks

6. **`frontend/src/components/sidebar/PatientSidebar.tsx`**
   - Remove links to: Messages, Medications, Insurance, ViewInvoices, PatientEditRequest
   - Keep: Dashboard, Profile, Appointments, MedicalRecords

7. **`frontend/src/components/sidebar/DoctorSidebar.tsx`**
   - Remove links to: DoctorMessages
   - Keep: Dashboard, Patients, Appointments, Profile

8. **`frontend/src/pages/Onboarding/RollSelection.tsx`**
   - Show only Patient and Doctor radio buttons
   - Remove Ops, IT, Finance options

9. **`frontend/src/pages/Onboarding/SignUp1.tsx`**
   - Update role validation to only accept "Patient" or "Doctor"

10. **`frontend/src/pages/Onboarding/SignUp2.tsx`**
    - Update conditional rendering for only 2 roles
    - Remove Ops/IT/Finance specific fields

11. **`frontend/src/pages/Onboarding/SignUp3.tsx`**
    - Remove role-specific onboarding steps for deleted roles

12. **`frontend/src/pages/Onboarding/Staff/`**
    - DELETE entire directory if only contains Ops/IT/Finance onboarding
    - OR MODIFY if contains Doctor onboarding - keep only DoctorOnboarding.tsx

13. **`frontend/src/hooks/useRequireRole.ts`**
    - Update to only check for "Patient" or "Doctor" roles

---

## Detailed Modification Instructions

### backend/server.js - Changes Summary
**Lines to remove:** ~40-50 lines
**Lines to modify:** ~5-10 lines

```javascript
// BEFORE:
import http from "http";
import socketServer from "./websocket/socketServer.js";
import opsMemberRoutes from "./routes/ops/opsMemberRoutes.js";
import itMemberRoutes from "./routes/its/itRoutes.js";
// ... etc

// ... later
const server = http.createServer(app);
socketServer.initialize(server);

app.use("/api/opsMembers", opsMemberRoutes);
// ... etc

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket ready on ws://localhost:${PORT}/ws`);
});

// AFTER:
// Remove http import entirely
// Remove socketServer import
// Remove deleted routes imports

// ... later
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### backend/models/users/User.js - Changes Summary
**Lines to modify:** 1 line

```javascript
// BEFORE:
role: {
  type: String,
  enum: ["Doctor", "Patient", "Ops", "IT", "Finance"],
  required: true,
},

// AFTER:
role: {
  type: String,
  enum: ["Doctor", "Patient"],
  required: true,
},
```

### frontend/src/App.tsx - Changes Summary
**Lines to remove:** ~80-100 lines
**Lines to modify:** ~30-40 lines
**Major sections:** Remove 3 Layout components, remove 15+ route definitions, simplify Router

```typescript
// Remove these imports entirely:
import OpsSidebar from "components/sidebar/OpsSidebar";
import ItSidebar from "components/sidebar/ItSidebar";
import FinanceSidebar from "components/sidebar/FinanceSidebar";
import { WebSocketProvider } from "./contexts/WebSocketContext";
// ... and more

// Remove these components:
const OpsLayout = () => { ... };
const ItsLayout = () => { ... };
const FinanceLayout = () => { ... };

// In Routes, keep only:
<Route path="/auth/login" ... />
<Route path="/auth/register" ... />
<Route path="/patients" element={<PatientLayout />}>
  // patient routes only
</Route>
<Route path="/doctors" element={<DoctorLayout />}>
  // doctor routes only
</Route>
```

---

## Validation Commands

After modifications, run these to verify:

```bash
# Backend
cd backend
npm install  # Remove ws package
npm start    # Should start without WebSocket errors

# Frontend  
cd frontend
npm start    # Should compile without errors
```

Check browser console for:
- No missing import errors
- No undefined route errors
- WebSocket not initialized
- Only Patient and Doctor in role dropdowns
- Deleted pages return 404 (expected)

---

## File Count Summary

### Total Files to DELETE: ~70 files
- Models: 11 files + directories
- Controllers: 8 files + directories
- Routes: 8 files + directories
- WebSocket: 1 directory (multiple files)
- Frontend Pages: 15+ files
- Frontend Components: 10+ files
- API Services: 5 files
- API Types: 5 files

### Total Files to MODIFY: ~20 files
- Backend: 8 files
- Frontend: 12 files

### Total Files to CREATE: ~12 files (after cleanup, for new features)
- Backend: 5 files (controllers, routes, models)
- Frontend: 7 files (pages, components, services)

