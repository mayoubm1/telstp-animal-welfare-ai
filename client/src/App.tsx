import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/HomeV2";
import Dashboard from "./pages/DashboardV2";
import SymptomChecker from "./pages/SymptomChecker";
import KnowledgeBase from "./pages/KnowledgeBase";
import PetRegistration from "./pages/PetRegistration";
import ImageDiagnosis from "./pages/ImageDiagnosis";
import VetDashboard from "./pages/VetDashboard";
import VetRegistration from "./pages/VetRegistration";
import ClinicLocator from "./pages/ClinicLocator";
import EmergencyTriage from "./pages/EmergencyTriage";
import CaseHistory from "./pages/CaseHistory";
import ImageUploadTriage from "./pages/ImageUploadTriage";
import AIVisualDiagnosis from "./pages/AIVisualDiagnosis";
import EducationHub from "./pages/EducationHub";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/symptom-checker"} component={SymptomChecker} />
      <Route path={"/knowledge-base"} component={KnowledgeBase} />
      <Route path={"/register-pet"} component={PetRegistration} />
      <Route path={"/image-diagnosis"} component={ImageDiagnosis} />
      <Route path={"/vet-dashboard"} component={VetDashboard} />
      <Route path={"/vet-registration"} component={VetRegistration} />
      <Route path={"/clinic-locator"} component={ClinicLocator} />
      <Route path={"/emergency-triage"} component={EmergencyTriage} />
      <Route path={"/case-history"} component={CaseHistory} />
      <Route path={"/image-upload"} component={ImageUploadTriage} />
      <Route path="/ai-diagnosis" component={AIVisualDiagnosis} />
      <Route path="/education" component={EducationHub} />
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
