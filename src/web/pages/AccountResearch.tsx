/**
 * Account Research page - Deep analysis powered by Claude
 */

import React, { useState } from "react";

export function AccountResearch() {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [research, setResearch] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!selectedAccount) return;

    setLoading(true);
    setError(null);
    setResearch("");

    try {
      const response = await fetch("/api/research/analyze", {
        method: "POST",
        headers: { "Content-Type":  "application/json" },
        body: JSON.stringify({
          accountId: selectedAccount,
        }),
      });

      // Check if the response was successful
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: "Failed to analyze account",
          details: `Server returned ${response.status}: ${response.statusText}`
        }));

        throw new Error(errorData.details || errorData.error || "Failed to analyze account");
      }

      const data = await response.json();

      // Validate the response has expected data
      if (!data) {
        throw new Error("Received empty response from server");
      }

      setResearch(JSON.stringify(data, null, 2));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Error analyzing account:", errorMessage);
      setError(errorMessage);
      setResearch("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1>Account Research</h1>

      <div className="research-container">
        <div className="research-panel">
          <h2>Select Account</h2>
          <select
            value={selectedAccount || ""}
            onChange={(e) => setSelectedAccount(e.target.value)}
          >
            <option value="">Choose an account... </option>
          </select>

          <button
            onClick={handleAnalyze}
            disabled={!selectedAccount || loading}
            className="btn btn-primary"
          >
            {loading ? "Analyzing..." : "Analyze Account"}
          </button>
        </div>

        <div className="research-results">
          <h2>Research Insights</h2>
          {error && (
            <div className="error-message" style={{ color: 'red', padding: '10px', border: '1px solid red', borderRadius: '4px', marginBottom: '10px' }}>
              <strong>Error:</strong> {error}
            </div>
          )}
          {research ?  (
            <pre className="json-display">{research}</pre>
          ) : (
            <p>Select an account and click analyze to see insights powered by Claude.</p>
          )}
        </div>
      </div>
    </div>
  );
}
