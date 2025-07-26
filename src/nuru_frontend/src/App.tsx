import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthProvider";
import { AppProvider } from "./contexts/AppContext";
import { LoginComponent } from "./components/LoginComponent";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/Dashboard";
import SavingsPage from "./pages/SavingsPage";
import YieldPage from "./pages/YieldPage";
import GovernancePage from "./pages/Governance";
import AdminPage from "./pages/AdminPage";

// ✅ Simple loading spinner while auth initializes
const LoadingScreen: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
    <div className="flex items-center space-x-2 text-white">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400"></div>
      <span className="text-lg">Loading Nuru Finance...</span>
    </div>
  </div>
);

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return <LoginComponent />;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/savings" element={<SavingsPage />} />
        <Route path="/yield" element={<YieldPage />} />
        <Route path="/governance" element={<GovernancePage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
};

// ✅ Root App component
export function App() {
  return (
    <AuthProvider>
      {/* ✅ AppProvider is now ALWAYS available, even during login */}
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}
