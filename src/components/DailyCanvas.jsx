// src/components/DailyCanvas.jsx
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setDayTheme } from "@store/activeDaySlice";

export default function DailyCanvas() {
  const dispatch = useDispatch();
  const { selectedDate, dayTheme } = useSelector((state) => state.activeDay);
  const [localTheme, setLocalTheme] = useState(dayTheme);

  useEffect(() => {
    setLocalTheme(dayTheme);
  }, [dayTheme]);

  const formatHeroDate = (dateStr) => {
    if (!dateStr) return "";
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const handleThemeBlur = () => {
    dispatch(setDayTheme(localTheme.trim()));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.target.blur();
    }
  };

  return (
    <header className="relative overflow-hidden bg-surface border border-borderCustom rounded-2xl p-6 md:p-8 mb-8">
      {/* Decorative Brand Accent Strip */}
      <div className="absolute top-0 left-0 w-1 h-full bg-accentCustom" />

      <h1 className="font-heading text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
        {formatHeroDate(selectedDate)}
      </h1>

      <div className="flex flex-col gap-1 mt-4">
        <span className="text-xs font-bold uppercase tracking-widest text-textSecondary">
          Today's Focus Theme
        </span>
        <input
          type="text"
          value={localTheme}
          onChange={(e) => setLocalTheme(e.target.value)}
          onBlur={handleThemeBlur}
          onKeyDown={handleKeyDown}
          placeholder="Set a focal intention for your thoughts today..."
          className="bg-transparent border-b border-dashed border-borderCustom text-lg font-medium text-accentCustom py-1 w-full outline-none focus:border-accentCustom transition-colors placeholder:text-textSecondary placeholder:italic"
        />
      </div>
    </header>
  );
}
