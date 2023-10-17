import React from "react";
import WelcomePage from "./pages/welcomePage";
import SiteLayout from "./components/siteLayout";

import { Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/dashboardPage";
import WorkoutPlanner from "./pages/workoutPlanner";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            <SiteLayout>
              <WelcomePage />
            </SiteLayout>
          }
        />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="workoutplan" element={<WorkoutPlanner />} />
      </Routes>
    </div>
  );
}

export default App;
