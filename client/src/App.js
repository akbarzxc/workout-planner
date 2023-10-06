import React from "react";
import WelcomePage from "./pages/welcomePage";
import SiteLayout from "./components/siteLayout";

function App() {
  return (
    <SiteLayout>
      <WelcomePage />
    </SiteLayout>
  );
}

export default App;
