// src/components/InputSheet.jsx
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveEntryRequest } from "@store/vaultSlice";
import useAudioRecorder from "@hooks/useAudioRecorder"; // Added!

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

  // Initialize our shiny new native voice capture engine
  const {
    isRecording,
    formattedTime,
    audioBlobUrl,
    startRecording,
    stopRecording,
    clearRecording,
  } = useAudioRecorder();

  useEffect(() => {
    if (isOpen && activePipeline === "text" && textInputRef.current) {
      setTimeout(() => textInputRef.current.focus(), 200);
    }
  }, [isOpen, activePipeline]);

  // Clean up recording if the user snaps the entire sheet shut abruptly
  useEffect(() => {
    if (!isOpen) {
      stopRecording();
      clearRecording();
      setTextContent("");
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation guard depending on active layer type
    if (activePipeline === "text" && !textContent.trim()) return;
    if (activePipeline === "audio" && !audioBlobUrl) return;

    const finalContent =
      activePipeline === "audio"
        ? `🎙️ Voice Memo Clip [${formattedTime}] captured successfully.`
        : textContent.trim();

    const payload = {
      id: `mv_${Math.random().toString(36).substr(2, 9)}`,
      auto_title: `${selectedCategory.toUpperCase()} Capture`,
      category: selectedCategory,
      day_period: new Date().getHours() < 12 ? "Morning" : "Afternoon",
      year: 2026,
      date_string: selectedDate || new Date().toISOString().split("T")[0],
      text_content: finalContent,
      pipeline_type: activePipeline,
      reminder_completed: false,
    };

    dispatch(saveEntryRequest(payload));

    // Purge inputs and close tray
    clearRecording();
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
          {/* Section 1: Pipeline Switcher Tabs */}
          <div className="grid grid-cols-3 gap-1 bg-background p-1 rounded-xl border border-borderCustom">
            {PIPELINES.map((pipe) => (
              <button
                key={pipe.id}
                type="button"
                onClick={() => {
                  if (isRecording) stopRecording();
                  setActivePipeline(pipe.id);
                }}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${activePipeline === pipe.id ? "bg-surface text-accentCustom shadow-md border border-borderCustom" : "text-textSecondary hover:text-textPrimary"}`}
              >
                <span>{pipe.icon}</span>
                <span>{pipe.label}</span>
              </button>
            ))}
          </div>

          {/* Section 2: Dynamic Pipeline Input Area */}
          <div className="min-h-[110px] bg-background/50 border border-borderCustom rounded-xl p-4 flex flex-col justify-center relative">
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
                  <div className="flex flex-col items-center gap-2">
                    {isRecording ? (
                      <button
                        type="button"
                        onClick={stopRecording}
                        className="w-12 h-12 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center border border-red-500/40 animate-pulse transition-all transform hover:scale-105"
                      >
                        ⏹️
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={startRecording}
                        className="w-12 h-12 rounded-full bg-accentCustom text-background flex items-center justify-center transition-all transform hover:scale-105 shadow-md shadow-accentCustom/10"
                      >
                        🎙️
                      </button>
                    )}
                    <span
                      className={`text-xs font-mono font-semibold tracking-wider ${isRecording ? "text-red-400" : "text-textSecondary"}`}
                    >
                      {isRecording
                        ? `RECORDING: ${formattedTime}`
                        : "Tap mic to initialize hardware sequence"}
                    </span>
                  </div>
                ) : (
                  <div className="w-full flex flex-col items-center gap-3">
                    {/* Native player wrapper for recorded webm/mp3 blob */}
                    <audio
                      src={audioBlobUrl}
                      controls
                      className="w-full max-w-sm h-8 rounded"
                    />
                    <button
                      type="button"
                      onClick={clearRecording}
                      className="text-[10px] font-bold tracking-wider text-red-400 uppercase hover:underline"
                    >
                      Clear & Re-record
                    </button>
                  </div>
                )}
              </div>
            )}

            {activePipeline === "image" && (
              <div className="h-24 flex flex-col items-center justify-center gap-2 text-center border border-dashed border-borderCustom/60 rounded-lg bg-background/20">
                <span className="text-2xl">📸</span>
                <span className="text-xs text-textSecondary font-medium">
                  Drag or drop media layer matrix
                </span>
              </div>
            )}
          </div>

          {/* Section 3: Category Metadata Selector */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-textSecondary">
              Assign Stream Node
            </span>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all duration-200 ${isSelected ? `${cat.color} ${cat.border} shadow-lg shadow-black/10 scale-105` : "border-borderCustom bg-background text-textSecondary hover:border-textSecondary/30"}`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Actions Bar */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-borderCustom/60">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-textSecondary hover:text-textPrimary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                (activePipeline === "text" && !textContent.trim()) ||
                (activePipeline === "audio" && !audioBlobUrl)
              }
              className="bg-accentCustom hover:bg-accentCustom/90 text-background px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Log Node
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
