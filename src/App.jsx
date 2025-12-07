import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { getHomePathForRole } from "./utils/roleRoutes";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DonorDonationsPage from "./pages/DonorDonationsPage";
import DonationTracePage from "./pages/DonationTracePage";
import OperatorCampaignsPage from "./pages/OperatorCampaignsPage";
import AccountantAllocationsPage from "./pages/AccountantAllocationsPage";
import AuditorLogsPage from "./pages/AuditorLogsPage";

import ProtectedRoute from "./components/ProtectedRoute";
import ProfilePage from "./pages/ProfilePage";
import CreateDonationPage from "./pages/CreateDonationPage";
import OperatorCreateCampaignPage from "./pages/OperatorCreateCampaignPage";
import OperatorUnverifiedDonationsPage from "./pages/OperatorUnverifiedDonationsPage";
import OperatorApproveAllocationsPage from "./pages/OperatorApproveAllocationsPage";
import AccountantReceiversPage from "./pages/AccountantReceiversPage";
import AccountantDisbursementCreatePage from "./pages/AccountantDisbursementCreatePage";
import DocumentsPage from "./pages/DocumentsPage";
import AuditorMismatchPage from "./pages/AuditorMismatchPage";
import AuditorDocumentHashesPage from "./pages/AuditorDocumentHashesPage";

function RootRedirect() {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Navigate to={getHomePathForRole(user.role)} replace />;
}

export default function App() {
  return (
    <div className="app-root">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* 공통: 내 정보 */}
            <Route
              element={
                <ProtectedRoute
                  allowedRoles={["DONOR", "OPERATOR", "ACCOUNTANT", "AUDITOR", "ADMIN"]}
                />
              }
            >
              <Route path="/me" element={<ProfilePage />} />
            </Route>

            {/* DONOR */}
            <Route element={<ProtectedRoute allowedRoles={["DONOR"]} />}>
              <Route path="/donor/donations" element={<DonorDonationsPage />} />
              <Route path="/donor/donate" element={<CreateDonationPage />} />
              <Route
                path="/donor/donations/:donationId/trace"
                element={<DonationTracePage />}
              />
            </Route>

            {/* OPERATOR */}
            <Route element={<ProtectedRoute allowedRoles={["OPERATOR", "ADMIN"]} />}>
              <Route path="/operator/campaigns" element={<OperatorCampaignsPage />} />
              <Route
                path="/operator/campaigns/new"
                element={<OperatorCreateCampaignPage />}
              />
              <Route
                path="/operator/donations/unverified"
                element={<OperatorUnverifiedDonationsPage />}
              />
              <Route
                path="/operator/allocations/approve"
                element={<OperatorApproveAllocationsPage />}
              />
            </Route>

            {/* ACCOUNTANT */}
            <Route element={<ProtectedRoute allowedRoles={["ACCOUNTANT", "ADMIN"]} />}>
              <Route
                path="/accountant/allocations"
                element={<AccountantAllocationsPage />}
              />
              <Route
                path="/accountant/receivers"
                element={<AccountantReceiversPage />}
              />
              <Route
                path="/accountant/disbursements/new"
                element={<AccountantDisbursementCreatePage />}
              />
              <Route path="/accountant/documents" element={<DocumentsPage />} />
            </Route>

            {/* AUDITOR */}
            <Route element={<ProtectedRoute allowedRoles={["AUDITOR", "ADMIN"]} />}>
              <Route path="/auditor/logs" element={<AuditorLogsPage />} />
              <Route path="/auditor/mismatch" element={<AuditorMismatchPage />} />
              <Route
                path="/auditor/doc-hashes"
                element={<AuditorDocumentHashesPage />}
              />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}
