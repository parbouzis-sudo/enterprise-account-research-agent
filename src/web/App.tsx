/**
 * Main React application component
 */

import React, { useState } from "react";
import { Dashboard } from "./pages/Dashboard";
import { AccountResearch } from "./pages/AccountResearch";
import { EnterprisePlanning } from "./pages/EnterprisePlanning";
import { Prospecting } from "./pages/Prospecting";
import { MeetingNotes } from "./pages/MeetingNotes";
import { LinkedInSync } from "./pages/LinkedInSync";
import { Navigation } from "./components/Navigation";

export type Page =
  | "dashboard"
  | "research"
  | "planning"
  | "prospecting"
  | "meetings"
  | "linkedin";

export function App() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "research": 
        return <AccountResearch />;
      case "planning": 
        return <EnterprisePlanning />;
      case "prospecting":
        return <Prospecting />;
      case "meetings": 
        return <MeetingNotes />;
      case "linkedin":
        return <LinkedInSync />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="main-content">{renderPage()}</main>
    </div>
  );
}
