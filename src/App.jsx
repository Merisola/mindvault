// src/App.jsx
import React, { useEffect } from "react"; // Fixed!
import { Provider, useDispatch } from "react-redux";
import { store } from "@store";
import { fetchEntriesRequest, saveEntryRequest } from "@store/vaultSlice";
import DailyCanvas from "@components/DailyCanvas";
import BentoTimeline from "@components/BentoTimeline";

function DashboardLoader() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchEntriesRequest());
  }, [dispatch]);

  const triggerMockLog = (category, text) => {
    const mock = {
      id: `mv_test_${Math.random().toString(36).substr(2, 9)}`,
      auto_title: `${category.toUpperCase()} Logged`,
      category,
      day_period: new Date().getHours() < 12 ? "Morning" : "Afternoon",
      year: 2026,
      date_string: "2026-07-01",
      text_content: text,
      reminder_completed: false,
    };
    dispatch(saveEntryRequest(mock));
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-8 md:py-12 min-h-screen bg-background text-textPrimary">
      <DailyCanvas />

      <div className="mb-6 p-4 bg-surface border border-borderCustom rounded-2xl flex flex-wrap gap-2 items-center justify-center">
        <span className="text-xs text-textSecondary font-medium">
          Quick Test Node:
        </span>
        <button
          onClick={() =>
            triggerMockLog(
              "moment",
              "Caught a gorgeous golden hour reflection hitting the office glass.",
            )
          }
          className="text-xs bg-moment/10 text-moment border border-moment/20 px-3 py-1.5 rounded-lg font-semibold hover:bg-moment/20 transition-colors"
        >
          ✨ +Moment
        </button>
        <button
          onClick={() =>
            triggerMockLog(
              "vibe",
              "Feeling highly caffeinated but focused today.",
            )
          }
          className="text-xs bg-vibe/10 text-vibe border border-vibe/20 px-3 py-1.5 rounded-lg font-semibold hover:bg-vibe/20 transition-colors"
        >
          💭 +Vibe
        </button>
        <button
          onClick={() =>
            triggerMockLog(
              "spark",
              "Idea: Native mobile framework compilation checks for Phase 2 targets.",
            )
          }
          className="text-xs bg-spark/10 text-spark border border-spark/20 px-3 py-1.5 rounded-lg font-semibold hover:bg-spark/20 transition-colors"
        >
          💡 +Spark
        </button>
        <button
          onClick={() =>
            triggerMockLog(
              "reminder",
              "Submit weekly project status deck review block by Friday morning.",
            )
          }
          className="text-xs bg-reminder/10 text-reminder border border-reminder/20 px-3 py-1.5 rounded-lg font-semibold hover:bg-reminder/20 transition-colors"
        >
          🔔 +Reminder
        </button>
      </div>

      <BentoTimeline />
    </main>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <DashboardLoader />
    </Provider>
  );
}
