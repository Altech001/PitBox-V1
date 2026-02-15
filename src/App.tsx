import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import MovieDetail from "./pages/MovieDetail";
import SeriesDetail from "./pages/SeriesDetail";
import SearchPage from "./pages/SearchPage";
import MoviesPage from "./pages/MoviesPage";
import SeriesPage from "./pages/SeriesPage";
import Account from "./pages/Account";
import NotFound from "./pages/NotFound";
import OneTime from "./components/OneTime";
import Magic from "./components/Magic";
import Wizard from "./components/Wizard";
import Docs from "./pages/Docs";

import { AuthProvider, useAuth } from "./providers/AuthProvider";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";

const queryClient = new QueryClient();

/**
 * Guards content that requires authentication + active subscription.
 * Redirects to /login if not authenticated, or /subscribe if not subscribed.
 */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      navigate("/login", { state: { from: location.pathname } });
    } else if (!user?.subscribed && !location.pathname.startsWith('/subscribe') && location.pathname !== '/account') {
      navigate("/subscribe");
    }
  }, [isAuthenticated, user, isLoading, navigate, location]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Auth pages — always accessible */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Public pages — browse without logging in */}
            <Route path="/" element={<Index />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/series" element={<SeriesPage />} />
            <Route path="/docs" element={<Docs />} />

            {/* Subscription flow — needs auth but not subscription */}
            <Route path="/subscribe" element={<OneTime />} />
            <Route path="/subscribe/magic" element={<Magic />} />
            <Route path="/subscribe/wizard" element={<Wizard />} />

            {/* Protected pages — need auth + subscription */}
            <Route path="/movie/:id" element={<ProtectedRoute><MovieDetail /></ProtectedRoute>} />
            <Route path="/series/:id" element={<ProtectedRoute><SeriesDetail /></ProtectedRoute>} />
            <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
