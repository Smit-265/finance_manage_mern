import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "../context/AuthContext";
import MainLayout from "../layout/MainLayout";
import SalaryPage from "../pages/salary/SalaryPage";

const RootRedirect = () => {
  const { user, token, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user && token) {
    return <Navigate to="/dashboard" replace />;
  } else {
    return <Navigate to="/login" replace />;
  }
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<RootRedirect />} />

        {/* Public route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Layout */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/salary" element={<SalaryPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
