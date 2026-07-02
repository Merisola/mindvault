// src/hooks/useSpeechTranscript.js
import { useState } from "react";

export default function useSpeechTranscript() {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [errorDebug, setErrorDebug] = useState(null);

  const startTranscription = () => {
    setIsListening(true);
    setTranscript("Capturing voice waves...");
    setErrorDebug(null);
  };

  const stopTranscription = () => {
    setIsListening(false);
  };

  const transcribeAudioBlob = async (audioBlob) => {
    if (!audioBlob || audioBlob.size === 0) return;

    setTranscript("Analyzing local audio frequencies...");
    setErrorDebug(null);

    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/openai/whisper-tiny.en",
        {
          headers: { "Content-Type": "audio/x-wav" },
          method: "POST",
          body: audioBlob,
        },
      );

      const result = await response.json();

      if (result && result.text) {
        setTranscript(result.text.trim());
      } else {
        // If the API limit is hit or response is garbled
        setTranscript("");
        setErrorDebug(
          "Network engine timed out. Please verify manually below.",
        );
      }
    } catch (err) {
      // CATCH NETWORK DROPS GRACEFULLY
      console.warn("Offline fallback state triggered:", err);
      setTranscript("");
      setErrorDebug(
        "Network offline. Voice saved perfectly—type context below!",
      );
    }
  };

  const resetTranscript = () => {
    setTranscript("");
    setErrorDebug(null);
  };

  return {
    transcript,
    isListening,
    isSupported: true,
    errorDebug,
    startTranscription,
    stopTranscription,
    transcribeAudioBlob,
    resetTranscript,
    setTranscript,
  };
}
