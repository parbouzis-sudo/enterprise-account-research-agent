/**
 * Dashboard page - Overview of accounts and recent activity
 */

import React from "react";

export function Dashboard() {
  return (
    <div className="page-container">
      <h1>Dashboard</h1>
      <div className="dashboard-grid">
        <div className="card">
          <h3>Accounts</h3>
          <p className="stat">0</p>
          <p className="subtitle">Total accounts</p>
        </div>
        <div className="card">
          <h3>Contacts</h3>
          <p className="stat">0</p>
          <p className="subtitle">Key contacts</p>
        </div>
        <div className="card">
          <h3>Active Opportunities</h3>
          <p className="stat">0</p>
          <p className="subtitle">In pipeline</p>
        </div>
        <div className="card">
          <h3>Recent Research</h3>
          <p className="stat">0</p>
          <p className="subtitle">Analyses completed</p>
        </div>
      </div>

      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <p>No recent activity yet.  Start by syncing with LinkedIn Navigator.</p>
      </div>
    </div>
  );
}
