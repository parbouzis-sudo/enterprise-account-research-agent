/**
 * Enterprise Account Planning page
 */

import React, { useState } from "react";

export function EnterprisePlanning() {
  const [accountId, setAccountId] = useState("");
  const [objectives, setObjectives] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreatePlan = async () => {
    if (!accountId || !objectives) return;

    setLoading(true);
    try {
      setPlan("Enterprise account plan generated");
    } catch (error) {
      console.error("Error creating plan:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1>Enterprise Account Planning</h1>

      <div className="planning-container">
        <div className="form-section">
          <h2>Create Account Plan</h2>

          <div className="form-group">
            <label>Account</label>
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
            >
              <option value="">Select account... </option>
            </select>
          </div>

          <div className="form-group">
            <label>Business Objectives</label>
            <textarea
              value={objectives}
              onChange={(e) => setObjectives(e.target.value)}
              placeholder="What are your goals for this account?"
              rows={5}
            />
          </div>

          <button
            onClick={handleCreatePlan}
            disabled={!accountId || !objectives || loading}
            className="btn btn-primary"
          >
            {loading ? "Creating Plan..." : "Generate Enterprise Plan"}
          </button>
        </div>

        <div className="plan-output">
          <h2>Account Plan</h2>
          {plan ? (
            <div className="plan-content">{plan}</div>
          ) : (
            <p>Create a plan to see strategic account planning recommendations.</p>
          )}
        </div>
      </div>
    </div>
  );
}
