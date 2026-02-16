import React, { Suspense, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';

// Global Components
import ErrorBoundary from "./components/ErrorBoundary";
import SubscriptionGatedUI from "./components/SubscriptionGatedUI";
import { AuthProvider } from "./providers/AuthProvider";
import Navbar from "./components/Navbar";
import { useAuthStore } from "@/hooks/use-auth-store"; //

// Lazy Loaded Pages
const Index = React.lazy(() => import("./pages/Index"));
const Login = React.lazy(() => import("./pages/auth/Login"));
const SignUp = React.lazy(() => import("./pages/auth/SignUp"));
const MovieDetail = React.lazy(() => import("./pages/MovieDetail"));
const SeriesDetail = React.lazy(() => import("./pages/SeriesDetail"));
const SearchPage = React.lazy(() => import("./pages/SearchPage"));
const MoviesPage = React.lazy(() => import("./pages/MoviesPage"));
const SeriesPage = React.lazy(() => import("./pages/SeriesPage"));
const Account = React.lazy(() => import("./pages/Account"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const Docs = React.lazy(() => import("./pages/Docs"));
const OneTime = React.lazy(() => import("./components/OneTime"));
const Magic = React.lazy(() => import("./components/Magic"));
const Wizard = React.lazy(() => import("./components/Wizard"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false, staleTime: 300000 },
  },
});

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // Pull state directly from Zustand store
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location.pathname } });
    }
  }, [isAuthenticated, isLoading, navigate, location]);

  if (isLoading) return <PageLoader />;
  if (!isAuthenticated) return null;

  // Subscription Logic
  const isSubscriptionPath = location.pathname.startsWith('/subscribe');
  const isAccountPath = location.pathname === '/account';
  
  if (!user?.subscribed && !isSubscriptionPath && !isAccountPath) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <SubscriptionGatedUI />
      </div>
    );
  }

  return <>{children}</>;
};

const App = () => (
  <HelmetProvider>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthProvider>
            <BrowserRouter>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/" element={<Index />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/movies" element={<MoviesPage />} />
                  <Route path="/series" element={<SeriesPage />} />
                  <Route path="/docs" element={<Docs />} />
                  <Route path="/subscribe" element={<ProtectedRoute><OneTime /></ProtectedRoute>} />
                  <Route path="/subscribe/magic" element={<ProtectedRoute><Magic /></ProtectedRoute>} />
                  <Route path="/subscribe/wizard" element={<ProtectedRoute><Wizard /></ProtectedRoute>} />
                  <Route path="/movie/:id" element={<ProtectedRoute><MovieDetail /></ProtectedRoute>} />
                  <Route path="/series/:id" element={<ProtectedRoute><SeriesDetail /></ProtectedRoute>} />
                  <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </HelmetProvider>
);

export default App;