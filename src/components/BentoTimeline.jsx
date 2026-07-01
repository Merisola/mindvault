// src/components/BentoTimeline.jsx
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleReminderComplete } from "@store/vaultSlice";

const TAXONOMY_MAP = {
  moment: { label: "Moment", emoji: "✨", border: "border-moment/30", text: "text-moment", badge: "bg-moment/10 text-moment" },
  vibe: { label: "Vibe", emoji: "💭", border: "border-vibe/30", text: "text-vibe", badge: "bg-vibe/10 text-vibe" },
  spark: { label: "Spark", emoji: "💡", border: "border-spark/30", text: "text-spark", badge: "bg-spark/10 text-spark" },
  reminder: { label: "Reminder", emoji: "🔔", border: "border-reminder/30", text: "text-reminder", badge: "bg-reminder/10 text-reminder" },
};

const FILTER_TABS = [
  { id: "all", label: "All Nodes", emoji: "🌐", activeClass: "bg-accentCustom text-background border-accentCustom" },
  { id: "moment", label: "Moments", emoji: "✨", activeClass: "bg-moment text-background border-moment" },
  { id: "vibe", label: "Vibe Rails", emoji: "💭", activeClass: "bg-vibe text-background border-vibe" },
  { id: "spark", label: "Sparks", emoji: "💡", activeClass: "bg-spark text-background border-spark" },
  { id: "reminder", label: "Reminders", emoji: "🔔", activeClass: "bg-reminder text-background border-reminder" },
];

const formatNodePeriod = (dateStr, period) => {
  if (!dateStr) return period;
  const [year, month, day] = dateStr.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
  return `${weekday} ${period}`;
};

export default function BentoTimeline() {
  const dispatch = useDispatch();
  const { entries, isLoading } = useSelector((state) => state.vault);

  // Local filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  if (isLoading) {
    return (
      <div className="text-center py-12 text-textSecondary animate-pulse">
        Reading secure mental sanctuary...
      </div>
    );
  }

  // Live filtering computation matrix
  const filteredEntries = entries.filter((entry) => {
    const matchesCategory = activeFilter === "all" || entry.category === activeFilter;
    
    const textToSearch = `${entry.text_content} ${entry.auto_title}`.toLowerCase();
    const matchesSearch = textToSearch.includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <section className="mt-4 pb-12">
      {/* Search and Rail Filtering Panel */}
      <div className="flex flex-col gap-4 mb-6">
        {/* Text Search Bar Input */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search raw context keys or filenames (e.g. 'REMINDER_2026')..."
            className="w-full bg-surface border border-borderCustom text-sm text-textPrimary px-4 py-2.5 rounded-xl outline-none focus:border-accentCustom/60 transition-colors placeholder:text-textSecondary/50"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-textSecondary hover:text-textPrimary"
            >
              ✕
            </button>
          )}
        </div>

        {/* Horizontal Scroll Capsule Navigation Rails */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          {FILTER_TABS.map((tab) => {
            const isSelected = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold tracking-wide uppercase border whitespace-nowrap transition-all duration-200 ${
                  isSelected 
                    ? tab.activeClass 
                    : "bg-surface border-borderCustom text-textSecondary hover:border-textSecondary/30"
                }`}
              >
                <span>{tab.emoji}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary Feed Layout Render Block */}
      {filteredEntries.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-borderCustom rounded-2xl bg-surface/30">
          <p className="text-textSecondary text-sm italic">No matching mental records identified.</p>
          <p className="text-xs text-textSecondary/50 mt-1">Refine your search tokens or switch category filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEntries.map((entry) => {
            const meta = TAXONOMY_MAP[entry.category] || TAXONOMY_MAP.vibe;
            const isReminder = entry.category === "reminder";

            return (
              <div
                key={entry.id}
                className={`relative flex flex-col justify-between p-5 bg-surface border ${meta.border} rounded-2xl transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg`}
              >
                {/* Card Header Metrics */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{meta.emoji}</span>
                    <span className={`text-xs font-bold uppercase tracking-wider ${meta.text}`}>
                      {meta.label}
                    </span>
                  </div>

                  <span className="text-xs font-medium text-textSecondary bg-background px-2.5 py-1 rounded-full border border-borderCustom/40">
                    {formatNodePeriod(entry.date_string, entry.day_period)}
                  </span>
                </div>

                {/* Central Core Content Body */}
                <div className="flex-grow flex flex-col gap-3">
                  {entry.image_data && (
                    <div className="w-full overflow-hidden rounded-xl border border-borderCustom/40 bg-background/40">
                      <img
                        src={entry.image_data}
                        alt="Vault attachment"
                        className="w-full max-h-48 object-cover object-center transition-transform duration-500 hover:scale-[1.02]"
                        loading="lazy"
                      />
                    </div>
                  )}

                  {entry.text_content && (
                    <p className="text-textPrimary text-sm leading-relaxed whitespace-pre-wrap">
                      {entry.text_content}
                    </p>
                  )}
                </div>

                {/* Interactive Contextual Footer */}
                {isReminder && (
                  <div className="mt-4 pt-3 border-t border-borderCustom/50 flex items-center justify-between">
                    <span className="text-xs text-textSecondary">Action Checklist</span>
                    <button
                      onClick={() => dispatch(toggleReminderComplete(entry.id))}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors border ${
                        entry.reminder_completed
                          ? "bg-spark/10 text-spark border-spark/20 line-through"
                          : "bg-reminder/10 text-reminder border-reminder/20 hover:bg-reminder/20"
                      }`}
                    >
                      {entry.reminder_completed ? "✓ Completed" : "○ Mark Done"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}