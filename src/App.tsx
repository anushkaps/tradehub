import { BrowserRouter as Router, Routes, Route, Navigate, useParams, Outlet, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { HelmetProvider } from 'react-helmet-async';
import 'react-toastify/dist/ReactToastify.css';
import { useIdleTimer } from './hooks/useIdleTimer';

import { UserProvider } from './contexts/UserContext';
import { Layout } from './components/Layout';
import TestConnection from './components/TestConnection';

// Public / Root Pages
import { HomePage } from './pages/HomePage';
import { AboutUs } from './pages/AboutUs';
import { Careers } from './pages/Careers';
import { CookiePolicy } from './pages/CookiePolicy';
import { FindPros } from './pages/FindPros';
import Guidelines from './pages/Guidelines';
import { HelpCenter } from './pages/HelpCenter';
import { HowItWorks } from './pages/HowItWorks';
import { JoinAsPro } from './pages/JoinAsPro';
import { Press } from './pages/Press';
import { Pricing } from './pages/Pricing';
import { ProResources } from './pages/ProResources';
import SafetyCenter from './pages/SafetyCenter';
import { Services } from './pages/Services';
import { SuccessStories } from './pages/SuccessStories';

// About & Membership
import { CompanyInformation } from './pages/about/CompanyInformation';
import { MembershipPricing } from './pages/about/MembershipPricing';

// Legal & Help
import { ContactUs } from './pages/help/ContactUs';
import { HelpAndFAQ } from './pages/help/HelpAndFAQ';
import { Account } from './pages/help/Account';
import { AdviceAndInspiration } from './pages/help/AdviceAndInspiration';
import { RateGuide } from './pages/help/RateGuide';
import { PrivacyPolicy } from './pages/legal/PrivacyPolicy';
import { TermsAndConditions } from './pages/legal/TermsAndConditions';

// Email confirmation & password reset
import { PleaseConfirmEmail } from './pages/auth/PleaseConfirmEmail';
import HomeownerEmailConfirmedCallback from './pages/homeowner/HomeownerEmailConfirmedCallback';
import ProfessionalEmailConfirmedCallback from './pages/professional/ProfessionalEmailConfirmedCallback';
import { ResetPassword } from './pages/auth/ResetPassword';
import { UpdatePassword } from './pages/auth/UpdatePassword';

// Homeowner Auth & Pages
import HomeownerSignUp from './pages/homeowner/HomeownerSignUp';
import HomeownerLogin from './pages/homeowner/HomeownerLogin';
import HomeownerLoginOTP from './pages/homeowner/HomeownerLoginOTP';
import { HiringGuide } from './pages/homeowner/HiringGuide';
import { PostJob } from './pages/homeowner/PostJob';
import SupportHomeowner from './pages/homeowner/Support';
import ComplaintsHomeowner from './pages/homeowner/Complaints';
import HomeownerProfile from './pages/homeowner/HomeownerProfile';
import HomeownerMessages from './pages/homeowner/Messages';
import JobDetails from './pages/homeowner/JobDetails';
import ProfessionalSearch from './pages/homeowner/ProfessionalSearch';
import ReviewsAndRatings from './pages/homeowner/ReviewsAndRatings';
import HomeownerPaymentHistory from './pages/homeowner/PaymentHistory';
import Notifications from './pages/homeowner/Notifications';
import HomeownerSettings from './pages/homeowner/Settings';
import HomeownerDashboard from './pages/homeowner/HomeownerDashboard';

// Professional Auth & Pages
import { ProfessionalHome } from './pages/professional/ProfessionalHome';
import ProfessionalSignUp from './pages/professional/ProfessionalSignUp';
import ProfessionalLogin from './pages/professional/ProfessionalLogin';
import ProfessionalLoginOTP from './pages/professional/ProfessionalLoginOTP';
import { ProfessionalDashboard } from './pages/professional/ProfessionalDashboard';
import { Complaints } from './pages/professional/Complaints';
import { ProfessionalSupport } from './pages/professional/ProfessionalSupport';
import ProfessionalProfile from './pages/professional/ProfessionalProfile';
import ProfessionalMessages from './pages/professional/Messages';
import BidManagement from './pages/professional/BidManagement';
import JobSearch from './pages/professional/JobSearch';
import AvailabilityCalendar from './pages/professional/AvailabilityCalendar';
import ProfessionalPaymentHistory from './pages/professional/PaymentHistory';
import ReviewsProfessional from './pages/professional/Reviews';
import Subscription from './pages/professional/Subscription';
import ProfessionalSettings from './pages/professional/Settings';
import FindJobs from './pages/professional/FindJobs';
import { HowItWorks as ProfessionalHowItWorks } from './pages/professional/HowItWorks';

// Multi-step Professional Registration Pages
import ProfessionalRegistrationStep2 from './pages/professional/ProfessionalRegistrationStep2';
import ProfessionalRegistrationStep3 from './pages/professional/ProfessionalRegistrationStep3';
import ProfessionalRegistrationStep4 from './pages/professional/ProfessionalRegistrationStep4';

// Admin pages (hidden)
import AdminDashboard from './components/admin/Dashboard';
import AdminUsers from './components/admin/Users';
import AdminJobs from './components/admin/Jobs';
import AdminSettings from './components/admin/Settings';
// Note: Ensure AdminLayout uses an <Outlet /> so nested routes render properly.
import AdminLayoutComponent from './components/admin/Layout';

// UI / Theme
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from './components/theme-provider';
import ProtectedRoute from './components/ProtectedRoute';
import { GDPRPolicy } from './pages/GDPRPolicy';
import { CookiePreferences } from './pages/CookiePreferences';

import { PublicHomeownerProfile } from './pages/profiles/PublicHomeownerProfile';
import { PublicProfessionalProfile } from './pages/profiles/PublicProfessionalProfile';

// Updated AdminProtectedRoute using import.meta.env for Vite and a correct URL parameter
function AdminProtectedRoute({ children }: { children: JSX.Element }) {
  const { secret } = useParams<{ secret: string }>();
  const adminSecret = import.meta.env.VITE_ADMIN_SECRET;
  localStorage.setItem('role','admin')
  if (secret !== adminSecret) {
    localStorage.setItem('role','user')
    return <Navigate to="/" replace />;
  }
  return children;
}

// Updated AdminLayout with an <Outlet /> for nested routes (if your current AdminLayout does not have it, update it accordingly)
const AdminLayout = () => {
  return (
    <div>
      {/* You can include your admin header, sidebar, etc. here */}
      <Outlet />
    </div>
  );
};

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl mb-8">Page Not Found</p>
        <Link to="/" className="bg-[#105298] text-white px-6 py-3 rounded-md hover:bg-[#0a407a] transition-colors">
          Go Back Home
        </Link>
      </div>
    </div>
  );
}

function App() {
  // Auto-logout after 30 minutes of inactivity
  useIdleTimer({ timeout: 30 * 60_000 });
  localStorage.setItem('role','user')

  return (
    <ThemeProvider defaultTheme="light">
      <HelmetProvider>
        <Router>
          <UserProvider>
            <Layout>
              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} index />
                <Route path="/test-connection" element={<TestConnection />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/cookie-policy" element={<CookiePolicy />} />
                <Route path="/find-pros" element={<FindPros />} />
                <Route path="/guidelines" element={<Guidelines />} />
                <Route path="/help-center" element={<HelpCenter />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/join-as-pro" element={<JoinAsPro />} />
                <Route path="/press" element={<Press />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/pro-resources" element={<ProResources />} />
                <Route path="/safety-center" element={<SafetyCenter />} />
                <Route path="/services" element={<Services />} />
                <Route path="/success-stories" element={<SuccessStories />} />

                {/* About & Membership */}
                <Route path="/about/company-info" element={<CompanyInformation />} />
                <Route path="/about/membership-pricing" element={<MembershipPricing />} />

                {/* Legal & Help */}
                <Route path="/help/contact-us" element={<ContactUs />} />
                <Route path="/help/help-and-faq" element={<HelpAndFAQ />} />
                <Route path="/help/account" element={<Account />} />
                <Route path="/help/advice-and-inspiration" element={<AdviceAndInspiration />} />
                <Route path="/help/rate-guide" element={<RateGuide />} />
                <Route path="/legal/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/legal/terms-and-conditions" element={<TermsAndConditions />} />

                {/* Email confirmation & password reset */}
                <Route path="/auth/please-confirm-email" element={<PleaseConfirmEmail />} />
                <Route path="/homeowner/email-confirmed" element={<HomeownerEmailConfirmedCallback />} />
                <Route path="/professional/email-confirmed" element={<ProfessionalEmailConfirmedCallback />} />
                <Route path="/auth/reset-password" element={<ResetPassword />} />
                <Route path="/auth/update-password" element={<UpdatePassword />} />

                {/* Homeowner Auth */}
                <Route path="/homeowner/signup" element={<HomeownerSignUp />} />
                <Route path="/homeowner/login" element={<HomeownerLogin />} />
                <Route path="/homeowner/login-otp" element={<HomeownerLoginOTP />} />
                <Route path="/homeowner/login-otp-callback" element={<HomeownerLoginOTP />} />

                {/* Public Homeowner */}
                <Route path="/homeowner/hiring-guide" element={<HiringGuide />} />

                {/* Protected Homeowner */}
                <Route
                  path="/homeowner/post-job"
                  element={
                    <ProtectedRoute requiredUserType="homeowner" redirectTo="/homeowner/login">
                      <PostJob />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/homeowner/support"
                  element={
                    <ProtectedRoute requiredUserType="homeowner" redirectTo="/homeowner/login">
                      <SupportHomeowner />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/homeowner/complaints"
                  element={
                    <ProtectedRoute requiredUserType="homeowner" redirectTo="/homeowner/login">
                      <ComplaintsHomeowner />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/homeowner/dashboard"
                  element={
                    <ProtectedRoute requiredUserType="homeowner" redirectTo="/homeowner/login">
                      <HomeownerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/homeowner/profile"
                  element={
                    <ProtectedRoute requiredUserType="homeowner" redirectTo="/homeowner/login">
                      <HomeownerProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/homeowner/messages"
                  element={
                    <ProtectedRoute requiredUserType="homeowner" redirectTo="/homeowner/login">
                      <HomeownerMessages />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/homeowner/job-details"
                  element={
                    <ProtectedRoute requiredUserType="homeowner" redirectTo="/homeowner/login">
                      <JobDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/homeowner/professional-search"
                  element={
                    <ProtectedRoute requiredUserType="homeowner" redirectTo="/homeowner/login">
                      <ProfessionalSearch />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/homeowner/reviews-and-ratings"
                  element={
                    <ProtectedRoute requiredUserType="homeowner" redirectTo="/homeowner/login">
                      <ReviewsAndRatings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/homeowner/payment-history"
                  element={
                    <ProtectedRoute requiredUserType="homeowner" redirectTo="/homeowner/login">
                      <HomeownerPaymentHistory />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/homeowner/notifications"
                  element={
                    <ProtectedRoute requiredUserType="homeowner" redirectTo="/homeowner/login">
                      <Notifications />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/homeowner/settings"
                  element={
                    <ProtectedRoute requiredUserType="homeowner" redirectTo="/homeowner/login">
                      <HomeownerSettings />
                    </ProtectedRoute>
                  }
                />

                {/* Professional Auth */}
                <Route path="/professional/signup" element={<ProfessionalSignUp />} />
                <Route path="/professional/login" element={<ProfessionalLogin />} />
                <Route path="/professional/login-otp" element={<ProfessionalLoginOTP />} />
                <Route path="/professional/login-otp-callback" element={<ProfessionalLoginOTP />} />

                {/* Public Professional */}
                <Route path="/professional/how-it-works" element={<ProfessionalHowItWorks />} />
                <Route path="/professional/find-jobs" element={<FindJobs />} />
                <Route path="/professional/membership" element={<Subscription />} />
                
                <Route path="/h/:username" element={<PublicHomeownerProfile />} />
                <Route path="/p/:username" element={<PublicProfessionalProfile />} />
                {/* Protected Professional */}
                <Route
                  path="/professional/professional-support"
                  element={
                    <ProtectedRoute requiredUserType="professional" redirectTo="/professional/login">
                      <ProfessionalSupport />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/professional/complaints"
                  element={
                    <ProtectedRoute requiredUserType="professional" redirectTo="/professional/login">
                      <Complaints />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/professional/dashboard"
                  element={
                    <ProtectedRoute requiredUserType="professional" redirectTo="/professional/login">
                      <ProfessionalDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/professional/profile"
                  element={
                    <ProtectedRoute requiredUserType="professional" redirectTo="/professional/login">
                      <ProfessionalProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/professional/messages"
                  element={
                    <ProtectedRoute requiredUserType="professional" redirectTo="/professional/login">
                      <ProfessionalMessages />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/professional/bid-management"
                  element={
                    <ProtectedRoute requiredUserType="professional" redirectTo="/professional/login">
                      <BidManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/professional/job-search"
                  element={
                    <ProtectedRoute requiredUserType="professional" redirectTo="/professional/login">
                      <JobSearch />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/professional/availability-calendar"
                  element={
                    <ProtectedRoute requiredUserType="professional" redirectTo="/professional/login">
                      <AvailabilityCalendar />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/professional/payment-history"
                  element={
                    <ProtectedRoute requiredUserType="professional" redirectTo="/professional/login">
                      <ProfessionalPaymentHistory />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/professional/reviews"
                  element={
                    <ProtectedRoute requiredUserType="professional" redirectTo="/professional/login">
                      <ReviewsProfessional />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/professional/subscription"
                  element={
                    <ProtectedRoute requiredUserType="professional" redirectTo="/professional/login">
                      <Subscription />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/professional/settings"
                  element={
                    <ProtectedRoute requiredUserType="professional" redirectTo="/professional/login">
                      <ProfessionalSettings />
                    </ProtectedRoute>
                  }
                />

                {/* Multi-step Professional Registration */}
                <Route
                  path="/professional/registration-step2"
                  element={
                    <ProtectedRoute requiredUserType="professional" redirectTo="/professional/signup">
                      <ProfessionalRegistrationStep2 />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/professional/registration-step3"
                  element={
                    // <ProtectedRoute requiredUserType="professional" redirectTo="/professional/signup">
                      <ProfessionalRegistrationStep3 />
                    // </ProtectedRoute>
                  }
                />
                <Route
                  path="/professional/registration-step4"
                  element={
                    // <ProtectedRoute requiredUserType="professional" redirectTo="/professional/signup">
                      <ProfessionalRegistrationStep4 />
                    // </ProtectedRoute>
                  }
                />

                {/* Admin Routes - Hidden and Protected */}
                <Route
                  path="/admin/:secret"
                  element={
                    <AdminProtectedRoute>
                      <AdminLayoutComponent />
                    </AdminProtectedRoute>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="jobs" element={<AdminJobs />} />
                  <Route path="settings" element={<AdminSettings />} />

                
                </Route>
                {/* Cookies and GDPR POLICIES */}
                <Route path="/cookie-policy" element={<CookiePolicy />} />
                <Route path="/gdpr-policy" element={<GDPRPolicy/>} />
                <Route path="/cookie-preferences" element={<CookiePreferences/>} />
                {/* Catch all route - 404 page */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </UserProvider>
        </Router>
        <Toaster />
      </HelmetProvider>
    </ThemeProvider>
  );
}

export default App;
