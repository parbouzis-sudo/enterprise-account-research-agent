/**
 * LinkedIn Navigator Sync page
 */

import React, { useState } from "react";

export function LinkedInSync() {
  const [syncStatus, setSyncStatus] = useState("idle");
  const [accountsCount, setAccountsCount] = useState(0);
  const [contactsCount, setContactsCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSyncLinkedIn = async () => {
    setSyncStatus("syncing");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/linkedin/sync", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountUrls: [],
          contactUrls: [],
        }),
      });

      // Check if the response was successful
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: "Failed to sync LinkedIn data",
          details: `Server returned ${response.status}: ${response.statusText}`
        }));

        throw new Error(errorData.details || errorData.error || "Failed to sync LinkedIn data");
      }

      const data = await response.json();

      // Validate the response has expected data
      if (!data) {
        throw new Error("Received empty response from server");
      }

      setAccountsCount(data. accountIds?. length || 0);
      setContactsCount(data.contactIds?.length || 0);
      setSyncStatus("completed");
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "An unknown error occurred during sync";
      console.error("Sync error:", errorMsg);
      setErrorMessage(errorMsg);
      setSyncStatus("error");
    }
  };

  return (
    <div className="page-container">
      <h1>LinkedIn Navigator Sync</h1>

      <div className="sync-container">
        <div className="sync-info">
          <h2>Sync Your LinkedIn Data</h2>
          <p>
            Connect your LinkedIn Navigator account to import accounts and
            contacts directly into AccountAI for analysis.
          </p>

          <div className="sync-stats">
            <div className="stat-card">
              <h3>Accounts</h3>
              <p className="stat-number">{accountsCount}</p>
            </div>
            <div className="stat-card">
              <h3>Contacts</h3>
              <p className="stat-number">{contactsCount}</p>
            </div>
          </div>

          <button
            onClick={handleSyncLinkedIn}
            disabled={syncStatus === "syncing"}
            className="btn btn-primary btn-large"
          >
            {syncStatus === "syncing"
              ? "⏳ Syncing..."
              : "🔗 Sync from LinkedIn Navigator"}
          </button>

          {syncStatus === "completed" && (
            <p className="success-message">
              ✅ Sync completed!  {accountsCount} accounts and {contactsCount} contacts imported.
            </p>
          )}
          {syncStatus === "error" && (
            <div className="error-message" style={{ color: 'red', padding: '10px', border: '1px solid red', borderRadius: '4px', marginTop: '10px' }}>
              <strong>❌ Sync failed:</strong> {errorMessage || "Please try again."}
            </div>
          )}
        </div>

        <div className="sync-guide">
          <h2>How to Use LinkedIn Navigator</h2>
          <ol>
            <li>Log in to LinkedIn Navigator</li>
            <li>Search for accounts and contacts</li>
            <li>Click "Sync to AccountAI" to import your selections</li>
            <li>View detailed AI analysis and recommendations</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
