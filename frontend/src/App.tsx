import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import GISMapPage from "./pages/GISMapPage";
import ElectionResultsPage from "./pages/ElectionResultsPage";
import VoterSearchPage from "./pages/VoterSearchPage";
import ComparativeAnalysisPage from "./pages/ComparativeAnalysisPageNew";
import AnalyticsDashboardPage from "./pages/AnalyticsDashboardPage";
import ReportsPage from "./pages/ReportsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/map" element={<GISMapPage />} />
          <Route path="/results" element={<ElectionResultsPage />} />
          <Route path="/search" element={<VoterSearchPage />} />
          <Route path="/comparative" element={<ComparativeAnalysisPage />} />
          <Route path="/analytics" element={<AnalyticsDashboardPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
