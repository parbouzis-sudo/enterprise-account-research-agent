/**
 * Main navigation component
 */

import React from "react";
import { Page } from "../App";
import "./Navigation.css";

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const navItems:  { id: Page; label: string; icon: string }[] = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "linkedin", label: "LinkedIn Sync", icon: "🔗" },
    { id: "research", label:  "Account Research", icon: "🔍" },
    { id: "planning", label: "Enterprise Planning", icon: "📋" },
    { id: "prospecting", label: "Prospecting", icon: "📧" },
    { id: "meetings", label: "Meeting Notes", icon: "🎤" },
  ];

  return (
    <nav className="navigation">
      <div className="nav-header">
        <h1>🤖 AccountAI</h1>
        <p>B2B Enterprise Account Intelligence</p>
      </div>
      <ul className="nav-list">
        {navItems.map((item) => (
          <li key={item.id}>
            <button
              className={`nav-button ${currentPage === item.id ? "active" : ""}`}
              onClick={() => onNavigate(item.id)}
            >
              <span className="icon">{item.icon}</span>
              <span className="label">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
