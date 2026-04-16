import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import NotFound from "./pages/NotFound.tsx";
import DashboardLayout from "./layouts/DashboardLayout.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Notes from "./pages/dashboard/Notes.tsx";
import Assessments from "./pages/dashboard/Assessments.tsx";
import Interviews from "./pages/dashboard/Interviews.tsx";
import ProgressPage from "./pages/dashboard/ProgressPage.tsx";
import Profile from "./pages/dashboard/Profile.tsx";
import Test from "./pages/dashboard/Test";
import Assistant from "./pages/dashboard/Assistant";
import Resources from "./pages/dashboard/Resources";
import Career from "./pages/dashboard/Career";
import Planner from "./pages/dashboard/Planner";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="notes" element={<Notes />} />
            <Route path="assessments" element={<Assessments />} />
            <Route path="interviews" element={<Interviews />} />
            <Route path="progress" element={<ProgressPage />} />
            <Route path="test" element={<Test />} />
            <Route path="assistant" element={<Assistant />} />
            <Route path="resources" element={<Resources />} />
            <Route path="career" element={<Career />} />
            <Route path="planner" element={<Planner />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
