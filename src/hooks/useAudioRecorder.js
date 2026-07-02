// src/hooks/useAudioRecorder.js
import { useState, useRef, useEffect } from "react";

export default function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlobUrl, setAudioBlobUrl] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  // Clean up streaming handles and tracking intervals on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    chunksRef.current = [];
    setAudioBlobUrl(null);
    setAudioBlob(null);

    try {
      // 1. Request hardware microphone permissions stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // 2. Initialize MediaRecorder with standard WebM fallback
      const options = { mimeType: "audio/webm;codecs=opus" };
      let recorder;

      try {
        recorder = new MediaRecorder(stream, options);
      } catch (e) {
        // Fallback for browsers that don't support standard WebM container configurations
        recorder = new MediaRecorder(stream);
      }

      mediaRecorderRef.current = recorder;

      // 3. Buffer live streaming chunks raw data
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      // 4. Assemble standard payload on complete stream cutoff
      recorder.onstop = () => {
        const mimeType = recorder.mimeType || "audio/webm";
        const compiledBlob = new Blob(chunksRef.current, { type: mimeType });
        const localUrl = URL.createObjectURL(compiledBlob);

        setAudioBlob(compiledBlob);
        setAudioBlobUrl(localUrl);
      };

      // 5. Fire up capturing sequences
      recorder.start(200); // Slices data chunks every 200ms
      setIsRecording(true);
      setRecordingTime(0);

      // Start human-readable duration timer counter
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Failed to capture native audio pipeline streams:", err);
      alert(
        "Microphone hardware access was denied or could not be initialized.",
      );
    }
  };

  const stopRecording = () => {
    if (
      !mediaRecorderRef.current ||
      mediaRecorderRef.current.state === "inactive"
    )
      return;

    // Cut off hardware streams safely
    mediaRecorderRef.current.stop();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    // Reset tracking configurations
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
  };

  const clearRecording = () => {
    if (audioBlobUrl) URL.revokeObjectURL(audioBlobUrl);
    setAudioBlobUrl(null);
    setAudioBlob(null);
    setRecordingTime(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return {
    isRecording,
    recordingTime,
    formattedTime: formatTime(recordingTime),
    audioBlob,
    audioBlobUrl,
    startRecording,
    stopRecording,
    clearRecording,
  };
}
