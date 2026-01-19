/**
 * Meeting Notes & Voice Transcription page
 */

import React, { useState, useRef } from "react";

export function MeetingNotes() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        const blob = event.data;
        const url = URL.createObjectURL(blob);
        if (audioRef.current) {
          audioRef.current.src = url;
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleTranscribe = async () => {
    if (!audioRef.current?. src) return;

    try {
      setTranscript("Meeting transcript will appear here after transcription.. .");
    } catch (error) {
      console.error("Error transcribing:", error);
    }
  };

  return (
    <div className="page-container">
      <h1>Meeting Notes & Transcription</h1>

      <div className="meeting-container">
        <div className="recording-section">
          <h2>Record Meeting</h2>

          <div className="recording-controls">
            {!isRecording ? (
              <button
                onClick={handleStartRecording}
                className="btn btn-primary btn-large"
              >
                🎤 Start Recording
              </button>
            ) : (
              <button
                onClick={handleStopRecording}
                className="btn btn-danger btn-large"
              >
                ⏹ Stop Recording
              </button>
            )}
          </div>

          {isRecording && <p className="recording-indicator">● Recording...</p>}

          <audio ref={audioRef} controls style={{ marginTop: "20px" }} />

          <button
            onClick={handleTranscribe}
            disabled={!audioRef.current?.src}
            className="btn btn-secondary"
          >
            Transcribe & Analyze
          </button>
        </div>

        <div className="transcript-section">
          <h2>Transcript</h2>
          {transcript ? (
            <div className="transcript-content">{transcript}</div>
          ) : (
            <p>Record and transcribe a meeting to see the transcript here.</p>
          )}
        </div>

        <div className="summary-section">
          <h2>AI Summary & Action Items</h2>
          {summary ? (
            <div className="summary-content">{summary}</div>
          ) : (
            <p>Meeting summary and action items will appear here. </p>
          )}
        </div>
      </div>
    </div>
  );
}
