import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import HomeV3 from "./pages/HomeV3";
const Home = HomeV3;
import Dashboard from "./pages/DashboardV2";
import SymptomChecker from "./pages/SymptomChecker";
import KnowledgeBase from "./pages/KnowledgeBase";
import PetRegistration from "./pages/PetRegistration";
import ImageDiagnosis from "./pages/ImageDiagnosis";
import VetDashboard from "./pages/VetDashboard";
import VetRegistration from "./pages/VetRegistration";
import ClinicLocator from "./pages/ClinicLocator";
import EmergencyTriage from "./pages/EmergencyTriage";
import EmergencyMedications from "./pages/EmergencyMedications";
import OwnerEducation from "./pages/OwnerEducation";
import CaseHistory from "./pages/CaseHistory";
import ImageUploadTriage from "./pages/ImageUploadTriage";
import AIVisualDiagnosis from "./pages/AIVisualDiagnosis";
import EducationHub from "./pages/EducationHub";
import NaturalAlternativesPage from "./pages/NaturalAlternativesPage";
import TrainingProgramsPage from "./pages/TrainingProgramsPage";
import BestPracticesPage from "./pages/BestPracticesPage";
import BestPracticesEnhanced from "./pages/BestPracticesEnhanced";
import VirtualPetAvatarPage from "./pages/VirtualPetAvatarPage";
import Landing from "./pages/Landing";
import PawsAndPurposeLanding from "./pages/PawsAndPurposeLanding";
import PetSelectionLanding from "./pages/PetSelectionLanding";
import PetProfileCreation from "./pages/PetProfileCreation";
import VirtualPetCompanion from "./pages/VirtualPetCompanion";
import UserProfile from "./pages/UserProfile";
import VetClinicSearch from "./pages/VetClinicSearch";
import RatingReviewSystem from "./pages/RatingReviewSystem";
import BookingSystem from "./pages/BookingSystem";
import ShoppingCart from "./pages/ShoppingCart";
import FinancialDashboard from "./pages/FinancialDashboard";
import EducationHubEnhanced from "./pages/EducationHubEnhanced";
import TrainingProgramsEnhanced from "./pages/TrainingProgramsEnhanced";
import NaturalAlternativesEnhanced from "./pages/NaturalAlternativesEnhanced";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/pet-selection/:species?"} component={PetSelectionLanding} />
      <Route path={"/pet-selection/:species/create"} component={PetProfileCreation} />
      <Route path={"/pet-companion"} component={VirtualPetCompanion} />
      <Route path={"/profile"} component={UserProfile} />
      <Route path={"/vet-clinic-search"} component={VetClinicSearch} />
      <Route path={"/ratings-reviews"} component={RatingReviewSystem} />
      <Route path={"/booking"} component={BookingSystem} />
      <Route path={"/shopping-cart"} component={ShoppingCart} />
      <Route path={"/financial-dashboard"} component={FinancialDashboard} />
      <Route path={"/landing"} component={Landing} />
      <Route path={"/"} component={Home} />
      <Route path={"/home-v3"} component={Home} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/symptom-checker"} component={SymptomChecker} />
      <Route path={"/knowledge-base"} component={KnowledgeBase} />
      <Route path={"/register-pet"} component={PetRegistration} />
      <Route path={"/image-diagnosis"} component={ImageDiagnosis} />
      <Route path={"/vet-dashboard"} component={VetDashboard} />
      <Route path={"/vet-registration"} component={VetRegistration} />
      <Route path={"/clinic-locator"} component={ClinicLocator} />
      <Route path={"/emergency-triage"} component={EmergencyTriage} />
      <Route path={"/emergency-medications"} component={EmergencyMedications} />
      <Route path={"/owner-education"} component={OwnerEducation} />
      <Route path={"/case-history"} component={CaseHistory} />
      <Route path={"/image-upload"} component={ImageUploadTriage} />
      <Route path="/ai-diagnosis" component={AIVisualDiagnosis} />
      <Route path="/education" component={EducationHub} />
      <Route path="/education-enhanced" component={EducationHubEnhanced} />
      <Route path="/natural-alternatives" component={NaturalAlternativesPage} />
      <Route path="/natural-alternatives-enhanced" component={NaturalAlternativesEnhanced} />
      <Route path="/training-programs" component={TrainingProgramsPage} />
      <Route path="/training-programs-enhanced" component={TrainingProgramsEnhanced} />
      <Route path={"/best-practices"} component={BestPracticesPage} />
      <Route path={"/best-practices-enhanced"} component={BestPracticesEnhanced} />
      <Route path="/virtual-pet-avatar" component={VirtualPetAvatarPage} />
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
