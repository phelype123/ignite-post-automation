import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

// Public pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import OnboardingPage from "./pages/OnboardingPage";

// App pages
import DashboardPage from "./pages/app/DashboardPage";
import ProductsPage from "./pages/app/ProductsPage";
import ProductDetailPage from "./pages/app/ProductDetailPage";
import ImportPage from "./pages/app/ImportPage";
import MediaPage from "./pages/app/MediaPage";
import PostsPage from "./pages/app/PostsPage";
import PostEditorPage from "./pages/app/PostEditorPage";
import AutopilotPage from "./pages/app/AutopilotPage";
import InsightsPage from "./pages/app/InsightsPage";
import InboxPage from "./pages/app/InboxPage";
import SettingsPage from "./pages/app/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      
      {/* Protected app routes */}
      <Route path="/app" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/app/products" element={<ProtectedRoute><ProductsPage /></ProtectedRoute>} />
      <Route path="/app/products/:id" element={<ProtectedRoute><ProductDetailPage /></ProtectedRoute>} />
      <Route path="/app/import" element={<ProtectedRoute><ImportPage /></ProtectedRoute>} />
      <Route path="/app/media" element={<ProtectedRoute><MediaPage /></ProtectedRoute>} />
      <Route path="/app/posts" element={<ProtectedRoute><PostsPage /></ProtectedRoute>} />
      <Route path="/app/posts/new" element={<ProtectedRoute><PostEditorPage /></ProtectedRoute>} />
      <Route path="/app/calendar" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/app/autopilot" element={<ProtectedRoute><AutopilotPage /></ProtectedRoute>} />
      <Route path="/app/insights" element={<ProtectedRoute><InsightsPage /></ProtectedRoute>} />
      <Route path="/app/inbox" element={<ProtectedRoute><InboxPage /></ProtectedRoute>} />
      <Route path="/app/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="/app/help" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      
      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
