/**
 * Main navigation component
 */

import { Page } from "../App";

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const navItems: { id: Page; label: string }[] = [
    { id: "dashboard", label: "Dashboard" },
    { id: "research", label: "Account Research" },
    { id: "planning", label: "Enterprise Planning" },
    { id: "prospecting", label: "Prospecting" },
    { id: "meetings", label: "Meeting Notes" },
    { id: "linkedin", label: "LinkedIn Sync" },
  ];

  return (
    <nav className="navigation">
      <div className="nav-header">
        <h1>Enterprise Account Research</h1>
      </div>
      <ul className="nav-list">
        {navItems.map((item) => (
          <li key={item.id}>
            <button
              className={`nav-button ${currentPage === item.id ? "active" : ""}`}
              onClick={() => onNavigate(item.id)}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
