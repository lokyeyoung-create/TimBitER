import React from "react";
import "./App.css";
import PatientSidebar from "./components/sidebar/PatientSidebar";
import Dashboard from "./pages/Patients/Dashboard";
import Appointments from "./pages/Patients/Appointments/Appointments";
import HelpSupportPage from "./pages/General/HelpSupport";
import { SignupProvider } from "./contexts/SignUpContext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import Landing from "./pages/Onboarding/Landing";
import SearchPage from "./pages/Search/SearchPage";
import DetailsPage from "./pages/Details/DetailsPage";
import PrivacyPolicy from "./pages/Privacy/PrivacyPolicy";
import SignUp1 from "./pages/Onboarding/SignUp1";
import SignUp2 from "./pages/Onboarding/SignUp2";
import SignUp3 from "./pages/Onboarding/SignUp3";
import RollSelection from "./pages/Onboarding/RollSelection";
import PatientOnboarding1 from "./pages/Onboarding/Patient/PatientOnboarding1";
import PatientOnboarding2 from "./pages/Onboarding/Patient/PatientOnboarding2";
import PatientOnboarding3 from "./pages/Onboarding/Patient/PatientOnboarding3";
import PatientOnboarding4 from "./pages/Onboarding/Patient/PatientOnboarding4";
import DoctorOnboarding from "./pages/Onboarding/Staff/DoctorOnboarding";
import Login from "./pages/Login/LoginScreen";
import ForgotPassword from "./pages/Login/ForgotPassword";
import ResetPassword from "pages/Login/ResetPassword";
import Error from "./pages/Error/ErrorPage";
import { AuthProvider, useAuth } from "contexts/AuthContext";
import DoctorSidebar from "components/sidebar/DoctorSidebar";
import DoctorDashboard from "pages/Doctor/DoctorDashboard";
import DoctorPatientsPage from "pages/Doctor/Patients/DoctorPatients";
import DoctorAppointments from "pages/Doctor/Appointments/DoctorAppointments";
import PatientProfile from "pages/Patients/Profile";
import PatientProfileEdit from "pages/Patients/ProfileEdit";
import AppointmentDetails from "pages/Doctor/Appointments/[id]";
import DoctorProfile from "pages/Doctor/Profile/Profile";
import DoctorProfileEdit from "pages/Doctor/Profile/ProfileEdit";
import PatientAppointmentView from "pages/Patients/Appointments/[id]";
import DoctorPatientProfile from "pages/Doctor/Patients/[id]";
import PublicDoctorProfile from "pages/Doctor/Profile/PublicProfile";
import PatientBookmarks from "pages/Patients/Bookmarks";
import DoctorResearchLibrary from "pages/Doctor/DoctorResearchLibrary";

const PatientLayout: React.FC = () => {
  return (
    <div className="flex">
      <div className="w-56 h-screen bg-background border-r border-stroke flex flex-col sticky top-0">
        <PatientSidebar />
      </div>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

const DoctorLayout: React.FC = () => {
  return (
    <div className="flex">
      <div className="w-56 h-screen bg-background border-r border-stroke flex flex-col sticky top-0">
        <DoctorSidebar />
      </div>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

// Logout Component
const Logout: React.FC = () => {
  const { logout } = useAuth();

  React.useEffect(() => {
    const performLogout = async () => {
      try {
        await logout();
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        // Redirect to login
        window.location.href = "/login";
      } catch (error) {
        console.error("Logout error:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    };

    performLogout();
  }, [logout]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-500">Logging out...</p>
      </div>
    </div>
  );
};

// Main App Routes Component that uses Auth Context
const AppRoutes: React.FC = () => {
  const { user, token, isLoading } = useAuth();

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show public routes
  if (!user || !token) {
    return (
      <SignupProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/search" element={<SearchPage />} />
          <Route path="/search/:criteria" element={<SearchPage />} />
          <Route path="/details/:id" element={<DetailsPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/signup1" element={<SignUp1 />} />
          <Route path="/signup2" element={<SignUp2 />} />
          <Route path="/signup3" element={<SignUp3 />} />
          <Route path="/roleselection" element={<RollSelection />} />
          <Route path="/patientonboarding1" element={<PatientOnboarding1 />} />
          <Route path="/patientonboarding2" element={<PatientOnboarding2 />} />
          <Route path="/patientonboarding3" element={<PatientOnboarding3 />} />
          <Route path="/patientonboarding4" element={<PatientOnboarding4 />} />
          <Route path="/doctoronboarding" element={<DoctorOnboarding />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/error" element={<Error />} />
          {/* Redirect everything else to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </SignupProvider>
    );
  }

  return (
    <SignupProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup1" element={<SignUp1 />} />
        <Route path="/signup2" element={<SignUp2 />} />
        <Route path="/signup3" element={<SignUp3 />} />
        <Route path="/roleselection" element={<RollSelection />} />
        <Route path="/patientonboarding1" element={<PatientOnboarding1 />} />
        <Route path="/patientonboarding2" element={<PatientOnboarding2 />} />
        <Route path="/patientonboarding3" element={<PatientOnboarding3 />} />
        <Route path="/patientonboarding4" element={<PatientOnboarding4 />} />
        <Route path="/doctoronboarding" element={<DoctorOnboarding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Patient routes */}
        <Route element={<PatientLayout />}>
          <Route path="/patientdashboard" element={<Dashboard />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/patient-profile" element={<PatientProfile />} />
          <Route path="/patient-profile-edit" element={<PatientProfileEdit />} />
          <Route
            path="/patient/appointment/:appointmentId"
            element={<PatientAppointmentView />}
          />
          <Route path="/doctor/:doctorId" element={<PublicDoctorProfile />} />
          <Route path="/patientbookmarks" element={<PatientBookmarks />} />
        </Route>

        {/* Doctor routes */}
        <Route element={<DoctorLayout />}>
          <Route path="/doctordashboard" element={<DoctorDashboard />} />
          <Route path="/doctorpatients" element={<DoctorPatientsPage />} />
          <Route path="/doctorappointments" element={<DoctorAppointments />} />
          <Route
            path="/doctor/appointment/:appointmentId"
            element={<AppointmentDetails />}
          />
          <Route
            path="/patient/:patientId"
            element={<DoctorPatientProfile />}
          />
          <Route path="/doctorbookmarks" element={<DoctorResearchLibrary />} />
          <Route path="/doctor-profile" element={<DoctorProfile />} />
          <Route path="/doctor-profile-edit" element={<DoctorProfileEdit />} />
        </Route>

        <Route path="/error" element={<Error />} />
        <Route path="*" element={<Navigate to="/error" replace />} />
      </Routes>
    </SignupProvider>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;
