// src/components/BentoTimeline.jsx
import { useSelector, useDispatch } from "react-redux";
import { toggleReminderComplete } from "@store/vaultSlice";

// Taxonomy dictionary mapping category strings to specific UI tokens
const TAXONOMY_MAP = {
  moment: {
    label: "Moment",
    emoji: "✨",
    border: "border-moment/30",
    badgeBg: "bg-moment/10",
    text: "text-moment",
  },
  vibe: {
    label: "Vibe",
    emoji: "💭",
    border: "border-vibe/30",
    badgeBg: "bg-vibe/10",
    text: "text-vibe",
  },
  spark: {
    label: "Spark",
    emoji: "💡",
    border: "border-spark/30",
    badgeBg: "bg-spark/10",
    text: "text-spark",
  },
  reminder: {
    label: "Reminder",
    emoji: "🔔",
    border: "border-reminder/30",
    badgeBg: "bg-reminder/10",
    text: "text-reminder",
  },
};

export default function BentoTimeline() {
  const dispatch = useDispatch();
  const { entries, isLoading } = useSelector((state) => state.vault);

  if (isLoading) {
    return (
      <div className="text-center py-12 text-textSecondary animate-pulse">
        Reading secure mental sanctuary...
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed border-borderCustom rounded-2xl bg-surface/50">
        <p className="text-textSecondary text-sm italic">
          The vault is currently hollow.
        </p>
        <p className="text-xs text-textSecondary/70 mt-1">
          Capture a passing flash before it leaks away.
        </p>
      </div>
    );
  }

  return (
    <section className="mt-8">
      <h2 className="text-xs font-bold uppercase tracking-widest text-textSecondary mb-4">
        Timeline Stream
      </h2>

      {/* Responsive Bento Grid Matrix: 1 col on mobile, 2 cols on tablet, spanning elegantly on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {entries.map((entry) => {
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
                  <span
                    className={`text-xs font-bold uppercase tracking-wider ${meta.text}`}
                  >
                    {meta.label}
                  </span>
                </div>

                {/* Auto-generated Temporal Stamp */}
                <span className="text-xs font-medium text-textSecondary bg-background px-2.5 py-1 rounded-full border border-borderCustom/40">
                  {entry.day_period} '{String(entry.year).slice(-2)}
                </span>
              </div>

              {/* Central Core Content Body */}
              <div className="flex-grow">
                {entry.text_content && (
                  <p className="text-textPrimary text-sm leading-relaxed whitespace-pre-wrap">
                    {entry.text_content}
                  </p>
                )}
              </div>

              {/* Interactive Contextual Footer (Shows checklist for reminders) */}
              {isReminder && (
                <div className="mt-4 pt-3 border-t border-borderCustom/50 flex items-center justify-between">
                  <span className="text-xs text-textSecondary">
                    Action Checklist
                  </span>
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
    </section>
  );
}
