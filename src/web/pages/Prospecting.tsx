/**
 * Prospecting & Outreach page
 */

import React, { useState } from "react";

export function Prospecting() {
  const [selectedContact, setSelectedContact] = useState("");
  const [messageType, setMessageType] = useState<
    "email" | "phone" | "linkedin"
  >("email");
  const [context, setContext] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerateMessage = async () => {
    if (!selectedContact) return;

    setLoading(true);
    try {
      const response = await fetch("/api/prospecting/generate-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactId: selectedContact,
          messageType,
          context,
        }),
      });
      const data = await response.json();
      setMessage(data.content);
    } catch (error) {
      console.error("Error generating message:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1>Prospecting & Outreach</h1>

      <div className="prospecting-container">
        <div className="form-section">
          <h2>Generate Outreach Message</h2>

          <div className="form-group">
            <label>Contact</label>
            <select
              value={selectedContact}
              onChange={(e) => setSelectedContact(e.target.value)}
            >
              <option value="">Select contact...</option>
            </select>
          </div>

          <div className="form-group">
            <label>Message Type</label>
            <select
              value={messageType}
              onChange={(e) => setMessageType(e.target.value as any)}
            >
              <option value="email">Email</option>
              <option value="phone">Phone Script</option>
              <option value="linkedin">LinkedIn Message</option>
            </select>
          </div>

          <div className="form-group">
            <label>Additional Context</label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Any additional context about the account or contact?"
              rows={4}
            />
          </div>

          <button
            onClick={handleGenerateMessage}
            disabled={!selectedContact || loading}
            className="btn btn-primary"
          >
            {loading ? "Generating..." : "Generate Message"}
          </button>
        </div>

        <div className="message-output">
          <h2>Generated Message</h2>
          {message ? (
            <div className="message-content">{message}</div>
          ) : (
            <p>Select a contact to generate personalized outreach messages.</p>
          )}
        </div>
      </div>
    </div>
  );
}
