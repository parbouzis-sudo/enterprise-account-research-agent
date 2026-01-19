/**
 * Meeting Notes page component
 */

import { useState } from "react";

export function MeetingNotes() {
  const [meetings, setMeetings] = useState<any[]>([]);

  return (
    <div className="meeting-notes-page">
      <h2>Meeting Notes</h2>
      <p>Record and analyze meeting notes with AI-powered insights.</p>

      <div className="meetings-list">
        {meetings.length === 0 ? (
          <p>No meeting notes yet. Start by transcribing a meeting.</p>
        ) : (
          <ul>
            {meetings.map((meeting) => (
              <li key={meeting.id}>
                <h3>{meeting.title}</h3>
                <p>{meeting.summary}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
