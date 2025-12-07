# TimBitER Refactoring - Step-by-Step Execution Plan

## Phase 1: Analysis & Validation (COMPLETE ✓)
- [x] Identified all files to delete
- [x] Identified all files to modify
- [x] Created comprehensive file lists
- [x] Documented changes for each file

---

## Phase 2: Backend Cleanup (DELETE - Backend)

### Step 1: Delete Backend Directories (Ops, IT, Finance, WebSocket, Messaging)
**Estimated time: 5 minutes**

Execute in order:
```powershell
# Navigate to backend
cd backend

# Delete Ops role
Remove-Item -Path "models/ops" -Recurse -Force
Remove-Item -Path "controllers/ops" -Recurse -Force
Remove-Item -Path "routes/ops" -Recurse -Force

# Delete IT role
Remove-Item -Path "models/its" -Recurse -Force
Remove-Item -Path "controllers/its" -Recurse -Force
Remove-Item -Path "routes/its" -Recurse -Force

# Delete Finance role
Remove-Item -Path "models/finance" -Recurse -Force
Remove-Item -Path "controllers/finances" -Recurse -Force
Remove-Item -Path "routes/finance" -Recurse -Force

# Delete WebSocket/Messaging
Remove-Item -Path "websocket" -Recurse -Force
Remove-Item -Path "models/messaging" -Recurse -Force
Remove-Item -Path "routes/messaging" -Recurse -Force
Remove-Item -Path "routes/chat" -Recurse -Force
Remove-Item -Path "controllers/chat" -Recurse -Force

# Delete Medication system
Remove-Item -Path "models/medications" -Recurse -Force
Remove-Item -Path "controllers/medications" -Recurse -Force
Remove-Item -Path "routes/medications" -Recurse -Force

# Delete specific model files
Remove-Item -Path "models/tickets/BugTicket.js" -Force
Remove-Item -Path "models/tickets/PatientRequestTicket.js" -Force

# Delete specific controller files
Remove-Item -Path "controllers/tickets/bugTicketController.js" -Force
Remove-Item -Path "controllers/tickets/patientRequestChangeController.js" -Force

# Delete specific route files
Remove-Item -Path "routes/tickets/bugTicketRoutes.js" -Force
Remove-Item -Path "routes/tickets/patientRequestChangeRoutes.js" -Force
```

### Step 2: Modify backend/server.js
**Estimated time: 5 minutes**

Actions:
1. Remove import statements for deleted routes (lines ~22-35)
2. Remove WebSocket server initialization code
3. Keep only essential route registrations
4. Change server startup from `http.createServer` to `app.listen`

**Critical sections to remove:**
- `import http from "http"`
- `import socketServer from "./websocket/socketServer.js"`
- All deleted route imports
- `const server = http.createServer(app)`
- `socketServer.initialize(server)`
- All `app.use()` for deleted routes
- WebSocket console.log

### Step 3: Modify backend/models/users/User.js
**Estimated time: 2 minutes**

Actions:
1. Find the role enum definition (around line 18)
2. Change from: `enum: ["Doctor", "Patient", "Ops", "IT", "Finance"]`
3. Change to: `enum: ["Doctor", "Patient"]`
4. Optional: Remove WebSocket-specific fields (isOnline, lastActive, messagingPreferences) if not needed

### Step 4: Modify backend/package.json
**Estimated time: 1 minute**

Actions:
1. Remove `"ws": "^8.18.3"` dependency

### Step 5: Modify backend/models/patients/Patient.js
**Estimated time: 2 minutes**

Actions:
1. Search for insuranceCard, insuranceCardUrl fields
2. Remove if present
3. Save file

### Step 6: Review backend/controllers/auth/authController.js
**Estimated time: 3 minutes**

Actions:
1. Check role validation in registration
2. Ensure role can only be "Doctor" or "Patient"
3. Add validation if needed

---

## Phase 3: Frontend Cleanup (DELETE - Frontend Pages/Components)

### Step 7: Delete Frontend Pages and Components
**Estimated time: 5 minutes**

Execute in order:
```powershell
# Navigate to frontend/src
cd ../frontend/src

# Delete role-specific pages
Remove-Item -Path "pages/Operations" -Recurse -Force
Remove-Item -Path "pages/IT" -Recurse -Force
Remove-Item -Path "pages/Finance" -Recurse -Force

# Delete messaging pages
Remove-Item -Path "pages/Patients/Messages.tsx" -Force

# Delete feature pages
Remove-Item -Path "pages/Patients/PatientEditRequest.tsx" -Force
Remove-Item -Path "pages/Patients/ViewInvoices.tsx" -Force
Remove-Item -Path "pages/Patients/Insurance.tsx" -Force
Remove-Item -Path "pages/Patients/Medications.tsx" -Force
Remove-Item -Path "pages/Doctor/DoctorMessages.tsx" -Force
Remove-Item -Path "pages/General/BugReport.tsx" -Force

# Delete components
Remove-Item -Path "components/sidebar/OpsSidebar.tsx" -Force
Remove-Item -Path "components/sidebar/ItSidebar.tsx" -Force
Remove-Item -Path "components/sidebar/FinanceSidebar.tsx" -Force
Remove-Item -Path "components/chats" -Recurse -Force
Remove-Item -Path "components/messages" -Recurse -Force

# Delete contexts
Remove-Item -Path "contexts/WebSocketContext.tsx" -Force

# Delete directories if they exist
Remove-Item -Path "Bugs" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "Onboarding/Staff" -Recurse -Force -ErrorAction SilentlyContinue
```

### Step 8: Delete Frontend API Services and Types
**Estimated time: 2 minutes**

Execute:
```powershell
# From frontend/src
# Delete services
Remove-Item -Path "api/services/ops.service.ts" -Force
Remove-Item -Path "api/services/it.service.ts" -Force
Remove-Item -Path "api/services/finance.service.ts" -Force
Remove-Item -Path "api/services/medorder.service.ts" -Force
Remove-Item -Path "api/services/message.service.ts" -Force

# Delete types
Remove-Item -Path "api/types/ops.types.ts" -Force
Remove-Item -Path "api/types/it.types.ts" -Force
Remove-Item -Path "api/types/finance.types.ts" -Force
Remove-Item -Path "api/types/medorder.types.ts" -Force
Remove-Item -Path "api/types/message.types.ts" -Force
```

---

## Phase 4: Frontend Modification (CRITICAL FILES)

### Step 9: Modify frontend/src/api/index.ts
**Estimated time: 2 minutes**

Actions:
1. Open file
2. Remove these export lines:
   ```typescript
   export { opsService } from './services/ops.service';
   export { itService } from './services/it.service';
   export { financeService } from './services/finance.service';
   export { medorderService } from './services/medorder.service';
   export { messageService } from './services/message.service';
   ```
3. Remove these type exports:
   ```typescript
   export * from './types/ops.types';
   export * from './types/it.types';
   export * from './types/finance.types';
   export * from './types/medorder.types';
   export * from './types/message.types';
   ```

### Step 10: Modify frontend/src/App.tsx (MAJOR REFACTOR)
**Estimated time: 20-30 minutes**

This is the largest file change. Follow these steps:

**Step 10a: Remove Imports (Lines ~1-70)**
Remove all these import lines:
- All Operations page imports (OpsDoctorDashboard, OpsPatientDashboard, OpsHistory)
- All IT page imports (PendingDashboard, ITHistory)
- All Finance page imports (Invoices, Billing)
- All Sidebar imports (OpsSidebar, ItSidebar, FinanceSidebar)
- Messages imports (Messages, DoctorMessages)
- WebSocketProvider import
- PatientEditRequest, ViewInvoices, Insurance, Medications imports
- BugReportPage import
- Any other deleted page imports

**Step 10b: Remove Layout Components (Lines ~70-130)**
Delete these entire function components:
- `OpsLayout: React.FC = () => { ... }`
- `ItsLayout: React.FC = () => { ... }`
- `FinanceLayout: React.FC = () => { ... }`

Keep:
- `PatientLayout`
- `DoctorLayout`

**Step 10c: Modify Routes Section**
In the `<Routes>` section:
1. Remove ALL routes for deleted pages:
   - `/ops/*`
   - `/its/*`
   - `/finance/*`
   - `/patients/messages`
   - `/doctor/messages`
   - `/patients/medications`
   - `/patients/insurance`
   - `/patients/edit-request`
   - `/patients/invoices`
   - `/bug-report`

2. Keep only:
   - Auth routes (login, register, forgot password, reset password)
   - Patient layout routes (dashboard, profile, appointments, medical records)
   - Doctor layout routes (dashboard, patients, appointments, profile)
   - Error route

**Step 10d: Remove WebSocketProvider Wrapper**
Find the outer structure where `<WebSocketProvider>` wraps everything and remove it, keeping only the inner content.

### Step 11: Modify frontend/src/components/sidebar/PatientSidebar.tsx
**Estimated time: 3 minutes**

Remove navigation links to:
- Messages
- Medications
- Insurance
- Invoices (View Invoices)
- Edit Request

Keep links to:
- Dashboard
- Profile
- Appointments
- Medical Records

### Step 12: Modify frontend/src/components/sidebar/DoctorSidebar.tsx
**Estimated time: 2 minutes**

Remove navigation links to:
- Messages (if present)

Keep links to:
- Dashboard
- Patients
- Appointments
- Profile

### Step 13: Modify frontend/src/contexts/SignUpContext.tsx
**Estimated time: 5 minutes**

Actions:
1. Find role-related state and type definitions
2. Update role validation to accept only "Doctor" or "Patient"
3. Remove any Ops/IT/Finance specific logic
4. Update enums if used

### Step 14: Modify frontend/src/pages/Onboarding/RollSelection.tsx
**Estimated time: 3 minutes**

Actions:
1. Find role selection UI (usually radio buttons)
2. Remove Ops, IT, Finance options
3. Keep only Patient and Doctor
4. Update labels and descriptions if needed

### Step 15: Modify frontend/src/pages/Onboarding/SignUp1.tsx, SignUp2.tsx, SignUp3.tsx
**Estimated time: 10 minutes**

Actions:
- SignUp1: Update role validation to only allow "Doctor" or "Patient"
- SignUp2: Remove role-specific UI conditionals for deleted roles
- SignUp3: Remove role-specific onboarding steps for deleted roles

---

## Phase 5: Testing & Validation

### Step 16: Backend Testing
**Estimated time: 5 minutes**

```bash
cd backend
npm install  # Re-install to remove ws
npm start
```

Verify:
- Server starts without errors
- No mention of WebSocket
- No import errors in console
- Server listening on correct port

### Step 17: Frontend Testing
**Estimated time: 10 minutes**

```bash
cd frontend
npm start
```

Verify:
- Frontend compiles without errors
- No "Cannot find module" errors in console
- Homepage loads
- Login/Register works
- Can select only "Patient" or "Doctor" in signup
- Navigation has no dead links
- Sidebars show correct options for each role

### Step 18: Functional Testing
**Estimated time: 15 minutes**

Test scenarios:
1. [ ] Register as Patient
2. [ ] Login as Patient
3. [ ] Access Patient dashboard and all allowed pages
4. [ ] Verify deleted pages return 404
5. [ ] Register as Doctor
6. [ ] Login as Doctor
7. [ ] Access Doctor dashboard and all allowed pages
8. [ ] Create an appointment
9. [ ] No WebSocket errors in console
10. [ ] Check all sidebars have correct links

### Step 19: Code Quality Check
**Estimated time: 10 minutes**

```bash
# Backend
cd backend
npm run lint  # If linter available

# Frontend
cd frontend
npm run lint  # If linter available
```

Fix any remaining issues.

---

## Phase 6: New Features (AFTER CLEANUP)

### Step 20: Create External API Integration
**Estimated time: 20 minutes**

1. Create `backend/controllers/external/externalApiController.js`
2. Create `backend/routes/external/externalApiRoutes.js`
3. Add routes to `backend/server.js`
4. Create `frontend/src/api/services/external.service.ts`
5. Create `frontend/src/pages/General/Search.tsx`
6. Create `frontend/src/pages/General/Details.tsx`

### Step 21: Create Following System
**Estimated time: 30 minutes**

1. Update `backend/models/users/User.js` to add followers/following arrays
2. Create `backend/controllers/social/followingController.js`
3. Create `backend/routes/social/followingRoutes.js`
4. Create `frontend/src/api/services/following.service.ts`
5. Update profile pages to show followers/following

### Step 22: Add Privacy Policy Page
**Estimated time: 10 minutes**

1. Create `frontend/src/pages/General/Privacy.tsx`
2. Add route to `frontend/src/App.tsx`
3. Add link to footer/navigation

---

## Summary Timeline

| Phase | Task | Estimated Time | Status |
|-------|------|-----------------|--------|
| 1 | Analysis & Documentation | 30 min | ✓ Complete |
| 2 | Backend Cleanup | 20 min | [ ] Ready |
| 3 | Frontend Cleanup | 10 min | [ ] Ready |
| 4 | Frontend Modifications | 60 min | [ ] Ready |
| 5 | Testing & Validation | 50 min | [ ] Ready |
| 6 | New Features | 60 min | [ ] Optional |
| **TOTAL** | **Full Refactoring** | **≈4-5 hours** | |

---

## Troubleshooting Guide

### Issue: "Cannot find module" errors after backend startup
**Solution:** 
- Check if all deleted imports are removed from `server.js`
- Run `npm install` to ensure clean node_modules
- Check for typos in remaining imports

### Issue: Frontend won't compile
**Solution:**
- Search entire project for references to deleted pages (Ctrl+Shift+F)
- Check `App.tsx` for any remaining imports of deleted pages
- Check `api/index.ts` for deleted service exports

### Issue: Routes show blank pages
**Solution:**
- Check browser console for component errors
- Verify route paths match component names
- Check for broken imports in page components

### Issue: WebSocket errors still appearing
**Solution:**
- Remove WebSocketProvider wrapper from App.tsx
- Check for any remaining WebSocket context usage
- Search codebase for "useWebSocket" hook references
- Remove any useEffect hooks connecting to WebSocket

### Issue: Role enum validation failing
**Solution:**
- Verify User.js has only ["Doctor", "Patient"] in enum
- Check auth controller role validation
- Clear database or update existing user roles

---

## Checklist for Completion

### Backend Cleanup
- [ ] All Ops/IT/Finance directories deleted
- [ ] WebSocket directory deleted
- [ ] Messaging/Chat directories deleted
- [ ] Medication directories deleted
- [ ] server.js updated
- [ ] User.js role enum updated
- [ ] package.json cleaned
- [ ] Backend starts without errors
- [ ] No console warnings about missing routes

### Frontend Cleanup
- [ ] All Ops/IT/Finance pages deleted
- [ ] All Ops/IT/Finance components deleted
- [ ] Messaging pages deleted
- [ ] WebSocketContext deleted
- [ ] Deleted API services removed
- [ ] api/index.ts cleaned
- [ ] App.tsx refactored (major file)
- [ ] Sidebars updated
- [ ] Onboarding pages simplified
- [ ] Frontend compiles without errors

### Validation
- [ ] Application runs without errors
- [ ] Login/Register works for both roles
- [ ] Patient features accessible
- [ ] Doctor features accessible
- [ ] Appointments work
- [ ] No broken links in navigation
- [ ] Role selection shows only 2 options
- [ ] Deleted pages return 404

### Optional: New Features
- [ ] External API integration added
- [ ] Search functionality works
- [ ] Following system implemented
- [ ] Privacy policy page created

