/**
 * Account Research page - Deep analysis powered by Claude
 */

import React, { useState } from "react";

export function AccountResearch() {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [research, setResearch] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!selectedAccount) return;

    setLoading(true);
    try {
      const response = await fetch("/api/research/analyze", {
        method: "POST",
        headers: { "Content-Type":  "application/json" },
        body: JSON.stringify({
          accountId: selectedAccount,
        }),
      });
      const data = await response.json();
      setResearch(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Error analyzing account:", error);
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
