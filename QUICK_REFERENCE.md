# TimBitER Refactoring - Quick Reference Guide

## BY FEATURE - Quick Delete Checklist

### ✂️ Feature 1: Remove Operations Role

**Backend - DELETE:**
- [ ] `backend/models/ops/OpsMember.js`
- [ ] `backend/models/ops/` (directory)
- [ ] `backend/controllers/ops/opsMemberController.js`
- [ ] `backend/controllers/ops/` (directory)
- [ ] `backend/routes/ops/opsMemberRoutes.js`
- [ ] `backend/routes/ops/` (directory)

**Frontend - DELETE:**
- [ ] `frontend/src/pages/Operations/` (entire directory with 4 files)
- [ ] `frontend/src/components/sidebar/OpsSidebar.tsx`

**Files to MODIFY:**
- [ ] `backend/server.js` (remove opsMemberRoutes imports and usage)
- [ ] `backend/models/users/User.js` (remove "Ops" from role enum)
- [ ] `frontend/src/App.tsx` (remove OpsDoctorDashboard, OpsPatientDashboard, OpsHistory imports and routes, remove OpsLayout)

---

### ✂️ Feature 2: Remove IT Role

**Backend - DELETE:**
- [ ] `backend/models/its/ITMember.js`
- [ ] `backend/models/its/` (directory)
- [ ] `backend/controllers/its/itController.js`
- [ ] `backend/controllers/its/` (directory)
- [ ] `backend/routes/its/itRoutes.js`
- [ ] `backend/routes/its/` (directory)
- [ ] `backend/controllers/tickets/bugTicketController.js`
- [ ] `backend/models/tickets/BugTicket.js`
- [ ] `backend/routes/tickets/bugTicketRoutes.js`

**Frontend - DELETE:**
- [ ] `frontend/src/pages/IT/` (entire directory with 3 files)
- [ ] `frontend/src/components/sidebar/ItSidebar.tsx`
- [ ] `frontend/src/pages/General/BugReport.tsx`
- [ ] `frontend/src/Bugs/` (if exists - bug reporting components)

**Files to MODIFY:**
- [ ] `backend/server.js` (remove itMemberRoutes and bugTicketRoutes imports and usage)
- [ ] `backend/models/users/User.js` (remove "IT" from role enum)
- [ ] `frontend/src/App.tsx` (remove ItSidebar, PendingDashboard, ITHistory, BugReportPage imports and routes, remove ItsLayout)

---

### ✂️ Feature 3: Remove Finance Role

**Backend - DELETE:**
- [ ] `backend/models/finance/FinanceMember.js`
- [ ] `backend/models/finance/Invoice.js`
- [ ] `backend/models/finance/BillingReport.js`
- [ ] `backend/models/finance/` (directory)
- [ ] `backend/controllers/finances/financeController.js`
- [ ] `backend/controllers/finances/invoiceController.js`
- [ ] `backend/controllers/finances/reportController.js`
- [ ] `backend/controllers/finances/` (directory)
- [ ] `backend/routes/finance/financeRoutes.js`
- [ ] `backend/routes/finance/` (directory)

**Frontend - DELETE:**
- [ ] `frontend/src/pages/Finance/` (entire directory with 3 files)
- [ ] `frontend/src/components/sidebar/FinanceSidebar.tsx`
- [ ] `frontend/src/pages/Patients/ViewInvoices.tsx`
- [ ] `frontend/src/api/services/finance.service.ts`
- [ ] `frontend/src/api/types/finance.types.ts`

**Files to MODIFY:**
- [ ] `backend/server.js` (remove financeMemberRoutes imports and usage)
- [ ] `backend/models/users/User.js` (remove "Finance" from role enum)
- [ ] `frontend/src/App.tsx` (remove FinanceSidebar, Invoices, Billing, ViewInvoices imports and routes, remove FinanceLayout)
- [ ] `frontend/src/components/sidebar/PatientSidebar.tsx` (remove Invoices link)

---

### ✂️ Feature 4: Remove WebSocket Real-Time Messaging

**Backend - DELETE:**
- [ ] `backend/websocket/socketServer.js`
- [ ] `backend/websocket/` (directory)
- [ ] `backend/models/messaging/Conversation.js`
- [ ] `backend/models/messaging/Message.js`
- [ ] `backend/models/messaging/` (directory)
- [ ] `backend/controllers/chat/chatController.js`
- [ ] `backend/controllers/chat/` (directory)
- [ ] `backend/routes/messaging/conversations.js`
- [ ] `backend/routes/messaging/` (directory)
- [ ] `backend/routes/chat/chatRoutes.js` (if separate from controllers)
- [ ] `backend/routes/chat/` (directory if exists)

**Frontend - DELETE:**
- [ ] `frontend/src/pages/Patients/Messages.tsx`
- [ ] `frontend/src/pages/Doctor/DoctorMessages.tsx`
- [ ] `frontend/src/contexts/WebSocketContext.tsx`
- [ ] `frontend/src/components/chats/` (entire directory)
- [ ] `frontend/src/components/messages/` (entire directory)
- [ ] `frontend/src/api/services/message.service.ts`
- [ ] `frontend/src/api/types/message.types.ts`

**Files to MODIFY:**
- [ ] `backend/server.js` (remove WebSocket initialization, http import, socketServer import, chatRoutes)
- [ ] `backend/package.json` (remove "ws" dependency)
- [ ] `frontend/src/App.tsx` (remove WebSocketProvider wrapper, remove Messages imports, remove message routes)
- [ ] `frontend/src/api/index.ts` (remove messageService export and types)
- [ ] `frontend/src/components/sidebar/PatientSidebar.tsx` (remove Messages link)
- [ ] `frontend/src/components/sidebar/DoctorSidebar.tsx` (remove Messages link)

---

### ✂️ Feature 5: Remove Medication Management

**Backend - DELETE:**
- [ ] `backend/models/medications/MedOrder.js`
- [ ] `backend/models/medications/` (directory)
- [ ] `backend/controllers/medications/medOrderController.js`
- [ ] `backend/controllers/medications/` (directory)
- [ ] `backend/routes/medications/medOrderRoutes.js`
- [ ] `backend/routes/medications/` (directory)

**Frontend - DELETE:**
- [ ] `frontend/src/pages/Patients/Medications.tsx`
- [ ] `frontend/src/api/services/medorder.service.ts`
- [ ] `frontend/src/api/types/medorder.types.ts`

**Files to MODIFY:**
- [ ] `backend/server.js` (remove medOrderRoutes imports and usage)
- [ ] `frontend/src/App.tsx` (remove Medications import and route)
- [ ] `frontend/src/api/index.ts` (remove medorderService export and types)
- [ ] `frontend/src/components/sidebar/PatientSidebar.tsx` (remove Medications link)

---

### ✂️ Feature 6: Remove Patient Change Request Workflow

**Backend - DELETE:**
- [ ] `backend/models/tickets/PatientRequestTicket.js`
- [ ] `backend/controllers/tickets/patientRequestChangeController.js`
- [ ] `backend/routes/tickets/patientRequestChangeRoutes.js`

**Frontend - DELETE:**
- [ ] `frontend/src/pages/Patients/PatientEditRequest.tsx`

**Files to MODIFY:**
- [ ] `backend/server.js` (remove patientRequestChangeRoutes imports and usage)
- [ ] `frontend/src/App.tsx` (remove PatientEditRequest import and route)

---

### ✂️ Feature 7: Remove Insurance Card Upload

**Backend - Files to MODIFY:**
- [ ] `backend/models/patients/Patient.js` (remove insuranceCard, insuranceCardUrl fields if present)

**Frontend - DELETE:**
- [ ] `frontend/src/pages/Patients/Insurance.tsx` (entire page)

**Files to MODIFY:**
- [ ] `frontend/src/App.tsx` (remove Insurance import and route)
- [ ] `frontend/src/components/sidebar/PatientSidebar.tsx` (remove Insurance link)

---

### ✂️ Feature 8: Update User Roles

**Files to MODIFY:**
- [ ] `backend/models/users/User.js` - Update role enum to only ["Doctor", "Patient"]

---

### ✂️ Feature 9: Simplify Onboarding

**Files to MODIFY:**
- [ ] `frontend/src/pages/Onboarding/RollSelection.tsx` - Show only Patient and Doctor options
- [ ] `frontend/src/pages/Onboarding/SignUp1.tsx` - Update for simplified roles
- [ ] `frontend/src/pages/Onboarding/SignUp2.tsx` - Update for simplified roles
- [ ] `frontend/src/pages/Onboarding/SignUp3.tsx` - Update for simplified roles
- [ ] `frontend/src/contexts/SignUpContext.tsx` - Update to only handle Patient/Doctor signup

**Frontend - DELETE (if they exist and only contain Ops/IT/Finance content):**
- [ ] `frontend/src/pages/Onboarding/Staff/` - Check if contains non-doctor content
- [ ] `frontend/src/pages/Onboarding/Staff/StaffOnboarding.tsx` - Delete if only for non-doctor staff

---

## CRITICAL FILES TO MODIFY COMPLETELY

### Backend
1. **`backend/server.js`** - Remove ~15 import lines and ~10 route lines
2. **`backend/models/users/User.js`** - Update role enum line
3. **`backend/package.json`** - Remove "ws" dependency

### Frontend
1. **`frontend/src/App.tsx`** - Major refactor: remove ~60 import lines, remove 3 layout components, remove 15+ route definitions
2. **`frontend/src/api/index.ts`** - Remove 6 service exports and 6 type exports
3. **`frontend/src/contexts/SignUpContext.tsx`** - Simplify role handling
4. **`frontend/src/components/sidebar/PatientSidebar.tsx`** - Remove 6+ links
5. **`frontend/src/components/sidebar/DoctorSidebar.tsx`** - Remove 2-3 links

---

## NEW FILES TO CREATE (After Cleanup)

### Backend
- [ ] `backend/controllers/external/externalApiController.js` - External API integration
- [ ] `backend/routes/external/externalApiRoutes.js` - External API routes
- [ ] `backend/controllers/social/followingController.js` - Follow system
- [ ] `backend/routes/social/followingRoutes.js` - Following routes
- [ ] `backend/models/social/Following.js` - Following model (or add to User)

### Frontend
- [ ] `frontend/src/pages/General/Search.tsx` - Search page
- [ ] `frontend/src/pages/General/SearchResults.tsx` - Results page  
- [ ] `frontend/src/pages/General/Details.tsx` - Details page
- [ ] `frontend/src/pages/General/Privacy.tsx` - Privacy policy
- [ ] `frontend/src/components/search/SearchBar.tsx`
- [ ] `frontend/src/components/search/SearchResults.tsx`
- [ ] `frontend/src/api/services/external.service.ts` - External API service
- [ ] `frontend/src/api/services/following.service.ts` - Following service

---

## Validation Checklist

After all deletions and modifications:

- [ ] Application starts without errors
- [ ] User model only has "Doctor" and "Patient" roles
- [ ] Login/Register works for both roles
- [ ] Patient can access: Dashboard, Profile, Appointments, Medical Records
- [ ] Doctor can access: Dashboard, Patients, Appointments, Profile
- [ ] Appointment booking works between Patient and Doctor
- [ ] No broken imports or 404 routes
- [ ] WebSocket not initialized
- [ ] No references to deleted features in code
- [ ] Navigation sidebars cleaned up
- [ ] All `.tsx`, `.ts`, and `.js` files have no "Cannot find module" errors

