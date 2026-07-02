// src/hooks/useAudioRecorder.js
import { useState, useRef, useEffect } from "react";

export default function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlobUrl, setAudioBlobUrl] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null); // <-- Keep raw blob reference safely inside state

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  // Format seconds to 00:00 display matrix
  const formattedTime = new Date(recordingTime * 1000)
    .toISOString()
    .substr(14, 5);

  const startRecording = async () => {
    chunksRef.current = [];
    setRecordingTime(0);
    setAudioBlobUrl(null);
    setAudioBlob(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Select standard supported client audio containers safely
      const options = MediaRecorder.isTypeSupported("audio/webm")
        ? { mimeType: "audio/webm" }
        : { mimeType: "audio/aac" };

      const recorder = new MediaRecorder(stream, options);

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blobType = options.mimeType;
        const compiledBlob = new Blob(chunksRef.current, { type: blobType });
        const localUrl = URL.createObjectURL(compiledBlob);

        setAudioBlob(compiledBlob);
        setAudioBlobUrl(localUrl);
      };

      mediaRecorderRef.current = recorder;
      recorder.start(250); // Slice data streams every 250ms to prevent buffer drops
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Failed to initialize microphone hardware:", err);
    }
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    setIsRecording(false);
  };

  const clearRecording = () => {
    stopRecording();
    if (audioBlobUrl) URL.revokeObjectURL(audioBlobUrl);
    setAudioBlobUrl(null);
    setAudioBlob(null);
    setRecordingTime(0);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return {
    isRecording,
    formattedTime,
    audioBlobUrl,
    audioBlob,
    startRecording,
    stopRecording,
    clearRecording,
  };
}
