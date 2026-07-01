// src/components/InputSheet.jsx
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveEntryRequest } from "@store/vaultSlice";
import useAudioRecorder from "@hooks/useAudioRecorder";
import useSpeechTranscript from "@hooks/useSpeechTranscript";
import { generateTemporalMetadata } from "@utils/temporalEngine";

const PIPELINES = [
  { id: "text", label: "Text Note", icon: "✍️" },
  { id: "audio", label: "Voice Memo", icon: "🎙️" },
  { id: "image", label: "Photo Capture", icon: "📸" },
];

const CATEGORIES = [
  {
    id: "moment",
    label: "Moment",
    color: "bg-moment text-background",
    border: "border-moment",
  },
  {
    id: "vibe",
    label: "Vibe",
    color: "bg-vibe text-background",
    border: "border-vibe",
  },
  {
    id: "spark",
    label: "Spark",
    color: "bg-spark text-background",
    border: "border-spark",
  },
  {
    id: "reminder",
    label: "Reminder",
    color: "bg-reminder text-background",
    border: "border-reminder",
  },
];

export default function InputSheet() {
  const dispatch = useDispatch();
  const { selectedDate } = useSelector((state) => state.activeDay);

  const [isOpen, setIsOpen] = useState(false);
  const [activePipeline, setActivePipeline] = useState("text");
  const [selectedCategory, setSelectedCategory] = useState("moment");
  const [textContent, setTextContent] = useState("");
  const textInputRef = useRef(null);

  const [imageDataUrl, setImageDataUrl] = useState(null);
  const fileInputRef = useRef(null);

  // Audio Capture Hook
  const {
    isRecording,
    formattedTime,
    audioBlobUrl,
    startRecording,
    stopRecording,
    clearRecording,
  } = useAudioRecorder();

  // Speech to Text Hook
  const {
    transcript,
    isListening,
    errorDebug,
    startTranscription,
    stopTranscription,
    transcribeAudioBlob,
    resetTranscript,
    setTranscript,
  } = useSpeechTranscript();

  useEffect(() => {
    if (isOpen && activePipeline === "text" && textInputRef.current) {
      setTimeout(() => textInputRef.current.focus(), 200);
    }
  }, [isOpen, activePipeline]);

  useEffect(() => {
    if (!isOpen) {
      if (isRecording) stopRecording();
      if (isListening) stopTranscription();
      clearRecording();
      resetTranscript();
      setImageDataUrl(null);
      setTextContent("");
    }
  }, [isOpen]);

  const handleStartAudioPipeline = () => {
    startRecording();
    startTranscription();
  };

  const handleStopAudioPipeline = () => {
    stopRecording();
    stopTranscription();

    // We fetch the compiled binary from the window hook stream directly
    setTimeout(async () => {
      if (audioBlobUrl) {
        try {
          const response = await fetch(audioBlobUrl);
          const blob = await response.blob();
          await transcribeAudioBlob(blob);
        } catch (e) {
          console.error("Blob parsing error:", e);
        }
      }
    }, 400);
  };

  const handleClearAudioPipeline = () => {
    clearRecording();
    resetTranscript();
  };

  // Inside src/components/InputSheet.jsx -> handleImageChange function
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        // Scale down high-resolution smartphone photographs before writing to local disk
        const lowResStream = await downsampleImage(reader.result, 800, 600);
        setImageDataUrl(lowResStream);
      } catch (err) {
        console.error("Compression utility dropped frame:", err);
        setImageDataUrl(reader.result); // Fallback to raw stream if canvas breaks
      }
    };
    reader.readAsDataURL(file);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (activePipeline === "text" && !textContent.trim()) return;
    if (activePipeline === "audio" && !audioBlobUrl) return;
    if (activePipeline === "image" && !imageDataUrl) return;

    let finalContent = textContent.trim();
    if (activePipeline === "audio") {
      finalContent = `🎙️ Voice Memo Clip [${formattedTime}]\n"${transcript || "No transcribed content captured."}"`;
    } else if (activePipeline === "image") {
      finalContent =
        finalContent || `📸 Photographic Snapshot captured securely.`;
    }

    const temporalMeta = generateTemporalMetadata(selectedCategory);

    const payload = {
      id: `mv_${Math.random().toString(36).substr(2, 9)}`,
      auto_title: temporalMeta.autoTitle,
      category: selectedCategory,
      day_period: temporalMeta.dayPeriod,
      year: temporalMeta.year,
      date_string: selectedDate || temporalMeta.dateString,
      text_content: finalContent,
      pipeline_type: activePipeline,
      image_data: imageDataUrl,
      reminder_completed: false,
    };

    dispatch(saveEntryRequest(payload));
    handleClearAudioPipeline();
    setImageDataUrl(null);
    setTextContent("");
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Trigger Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background/90 to-transparent z-40 flex justify-center">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="w-full max-w-xl bg-surface border border-borderCustom hover:border-accentCustom/50 text-textSecondary px-5 py-3 rounded-2xl shadow-xl flex items-center justify-between transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 group"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg group-hover:scale-110 transition-transform">
                ✨
              </span>
              <span className="font-medium text-sm tracking-wide">
                Capture a fleeting thought or vibe...
              </span>
            </div>
            <kbd className="hidden sm:inline-block bg-background px-2 py-0.5 border border-borderCustom rounded text-[10px] font-bold tracking-wider">
              LNCH
            </kbd>
          </button>
        )}
      </div>

      {/* Backdrop Overlay */}
      <div
        className={`fixed inset-0 bg-background/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Slide-up Container Sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-surface border-t border-borderCustom rounded-t-[2rem] shadow-2xl z-50 transition-transform duration-300 ease-out transform max-w-2xl mx-auto w-full ${isOpen ? "translate-y-0" : "translate-y-full"}`}
      >
        <div
          className="w-full flex justify-center pt-3 pb-2 cursor-pointer"
          onClick={() => setIsOpen(false)}
        >
          <div className="w-12 h-1 bg-borderCustom rounded-full hover:bg-textSecondary/30 transition-colors" />
        </div>

        <form
          onSubmit={handleSubmit}
          className="px-6 pb-8 pt-2 flex flex-col gap-5"
        >
          {/* Section 1: Tabs */}
          <div className="grid grid-cols-3 gap-1 bg-background p-1 rounded-xl border border-borderCustom">
            {PIPELINES.map((pipe) => (
              <button
                key={pipe.id}
                type="button"
                onClick={() => {
                  if (isRecording) handleStopAudioPipeline();
                  setActivePipeline(pipe.id);
                }}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${activePipeline === pipe.id ? "bg-surface text-accentCustom shadow-md border border-borderCustom" : "text-textSecondary hover:text-textPrimary"}`}
              >
                <span>{pipe.icon}</span>
                <span>{pipe.label}</span>
              </button>
            ))}
          </div>

          {/* Section 2: Dynamic Core Input Field Canvas */}
          <div className="min-h-[120px] bg-background/50 border border-borderCustom rounded-xl p-4 flex flex-col justify-center relative">
            {activePipeline === "text" && (
              <textarea
                ref={textInputRef}
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Spill details here... Press Cmd+Enter to instantly seal the log node."
                className="w-full h-24 bg-transparent outline-none resize-none text-sm text-textPrimary placeholder:text-textSecondary/60 leading-relaxed"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    handleSubmit(e);
                  }
                }}
              />
            )}

            {activePipeline === "audio" && (
              <div className="w-full flex flex-col items-center justify-center py-2 gap-3">
                {!audioBlobUrl ? (
                  <div className="flex flex-col items-center gap-2 w-full">
                    {isRecording ? (
                      <button
                        type="button"
                        onClick={handleStopAudioPipeline}
                        className="w-12 h-12 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center border border-red-500/40 animate-pulse"
                      >
                        ⏹️
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleStartAudioPipeline}
                        className="w-12 h-12 rounded-full bg-accentCustom text-background flex items-center justify-center shadow-md shadow-accentCustom/10"
                      >
                        🎙️
                      </button>
                    )}
                    <span
                      className={`text-xs font-mono font-semibold tracking-wider ${isRecording ? "text-red-400" : "text-textSecondary"}`}
                    >
                      {isRecording
                        ? `RECORDING & TRANSCRIBING: ${formattedTime}`
                        : "Tap mic to initialize hardware voice sequence"}
                    </span>

                    {/* LIVE STREAMING CONTAINER (Visible in your screenshot phase) */}
                    {isRecording && transcript && (
                      <div className="w-full mt-3 p-3 bg-background/90 border border-accentCustom/30 rounded-xl text-xs text-accentCustom italic text-center animate-pulse">
                        "{transcript}"
                      </div>
                    )}
                    {errorDebug && (
                      <div className="text-[11px] text-red-400 mt-1">
                        ⚠️ {errorDebug}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full flex flex-col items-center gap-3">
                    <audio
                      src={audioBlobUrl}
                      controls
                      className="w-full max-w-sm h-8 rounded"
                    />

                    {/* POST-RECORDING REVIEW TEXTBOX */}
                    <div className="w-full flex flex-col gap-1 px-2 text-left">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-textSecondary">
                        Review Auto-Transcript
                      </span>
                      <textarea
                        value={transcript}
                        onChange={(e) => setTranscript(e.target.value)}
                        className="w-full p-2.5 bg-background border border-borderCustom rounded-xl text-xs text-textPrimary leading-relaxed resize-none h-20 outline-none focus:border-accentCustom/40"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleClearAudioPipeline}
                      className="text-[10px] font-bold tracking-wider text-red-400 uppercase hover:underline"
                    >
                      Clear & Re-record
                    </button>
                  </div>
                )}
              </div>
            )}

            {activePipeline === "image" && (
              <div className="w-full flex flex-col items-center justify-center">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                />
                {!imageDataUrl ? (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="w-full h-24 flex flex-col items-center justify-center gap-2 text-center border border-dashed border-borderCustom/80 hover:border-accentCustom/50 rounded-lg bg-background/20 transition-colors group"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">
                      📸
                    </span>
                    <span className="text-xs text-textSecondary font-semibold">
                      Snap image or upload layer
                    </span>
                  </button>
                ) : (
                  <div className="w-full flex items-center gap-4 bg-background/40 p-2 rounded-lg border border-borderCustom">
                    <img
                      src={imageDataUrl}
                      alt="Capture preview"
                      className="w-20 h-20 object-cover rounded-xl border border-borderCustom"
                    />
                    <div className="flex flex-col gap-1.5 flex-grow">
                      <input
                        type="text"
                        value={textContent}
                        onChange={(e) => setTextContent(e.target.value)}
                        placeholder="Add caption..."
                        className="bg-transparent border-b border-borderCustom text-xs text-textPrimary outline-none py-1 focus:border-accentCustom"
                      />
                      <button
                        type="button"
                        onClick={() => setImageDataUrl(null)}
                        className="text-[10px] font-bold tracking-wider text-red-400 uppercase text-left hover:underline"
                      >
                        Remove Photo
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section 3: Categories */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-textSecondary">
              Assign Stream Node
            </span>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all duration-200 ${selectedCategory === cat.id ? `${cat.color} ${cat.border} shadow-lg scale-105` : "border-borderCustom bg-background text-textSecondary hover:border-textSecondary/30"}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section 4: Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-borderCustom/60">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-textSecondary hover:text-textPrimary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                (activePipeline === "text" && !textContent.trim()) ||
                (activePipeline === "audio" && !audioBlobUrl) ||
                (activePipeline === "image" && !imageDataUrl)
              }
              className="bg-accentCustom hover:bg-accentCustom/90 text-background px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md disabled:opacity-40"
            >
              Log Node
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
