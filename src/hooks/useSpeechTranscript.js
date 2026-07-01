// src/hooks/useSpeechTranscript.js
import { useState, useRef } from "react";

export default function useSpeechTranscript() {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [errorDebug, setErrorDebug] = useState(null);
  const recognitionRef = useRef(null);

  const isSupported =
    typeof window !== "undefined" &&
    !!(
      window.SpeechRecognition ||
      window.webkitSpeechRecognition ||
      window.mozSpeechRecognition ||
      window.msSpeechRecognition
    );

  const startTranscription = () => {
    if (!isSupported) {
      setErrorDebug("Speech engine not supported on this browser.");
      return;
    }

    // Always instantiate a fresh recognition session to avoid native browser lifecycle bugs
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition ||
      window.mozSpeechRecognition ||
      window.msSpeechRecognition;

    const recognition = new SpeechRecognition();

    // Configure attributes
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      setErrorDebug(null);
    };

    recognition.onresult = (event) => {
      let accumulatedText = "";
      for (let i = 0; i < event.results.length; i++) {
        const alternative = event.results[i][0];
        if (alternative && alternative.transcript) {
          accumulatedText += alternative.transcript + " ";
        }
      }

      const finalized = accumulatedText.trim();
      if (finalized) {
        setTranscript(finalized);
      }
    };

    recognition.onerror = (err) => {
      // "no-speech" is common and harmless; ignore it or handle gently
      if (err.error === "not-allowed") {
        setErrorDebug("Microphone access blocked. Enable permissions.");
      } else if (err.error !== "no-speech") {
        setErrorDebug(`Engine Error: ${err.error}`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    // Clean up any stray instance if it somehow exists, then start the new one
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {}
    }

    recognitionRef.current = recognition;
    setTranscript("");
    setErrorDebug(null);

    try {
      recognition.start();
    } catch (e) {
      console.warn("Speech system initialization warning:", e);
      setErrorDebug(`Failed to initialize: ${e.message}`);
    }
  };

  const stopTranscription = () => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch (e) {
      console.error(e);
    }
    setIsListening(false);
  };

  const resetTranscript = () => {
    setTranscript("");
    setErrorDebug(null);
  };

  return {
    transcript,
    isListening,
    isSupported,
    errorDebug,
    startTranscription,
    stopTranscription,
    resetTranscript,
    setTranscript,
  };
}
