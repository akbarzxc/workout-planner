import React from "react";

import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/clerk-react";
import { QueryClient, QueryClientProvider } from "react-query";

import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";

import SiteLayout from "./components/siteLayout";
import Welcome from "./pages/welcome";
import DashboardPage from "./pages/dashboard";
import WorkoutPlanner from "./pages/workoutPlanner";
import NotFound from "./pages/notFound";

if (!process.env.REACT_APP_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}
const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

function ClerkProviderWithRoutes() {
  const navigate = useNavigate();

  return (
    <ClerkProvider publishableKey={clerkPubKey} navigate={(to) => navigate(to)}>
      <Routes>
        <Route
          path="/"
          element={
            <SiteLayout>
              <Welcome />
            </SiteLayout>
          }
        />
        <Route
          path="/dashboard"
          element={
            <>
              <SignedIn>
                <DashboardPage />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />
        <Route
          path="/workoutplan"
          element={
            <>
              <SignedIn>
                <WorkoutPlanner />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ClerkProvider>
  );
}

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ClerkProviderWithRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
export default App;
