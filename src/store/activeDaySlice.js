// src/store/activeDaySlice.js
import { createSlice } from "@reduxjs/toolkit";

// Pre-defined fallback themes to combat daily "brain leakage" friction
const FALLBACK_THEMES = [
  "A Clean Slate",
  "Celebrate Small Wins",
  "Unlocking Momentum",
  "Focus and Flow",
  "Stay Curious",
];

const getTodayDateString = () => {
  const today = new Date();
  // Returns YYYY-MM-DD local format
  return today.toISOString().split("T")[0];
};

const getRandomFallbackTheme = () => {
  const randomIndex = Math.floor(Math.random() * FALLBACK_THEMES.length);
  return FALLBACK_THEMES[randomIndex];
};

const initialState = {
  selectedDate: getTodayDateString(), // Defaults to current client date calendar baseline
  dayTheme: getRandomFallbackTheme(),
};

const activeDaySlice = createSlice({
  name: "activeDay",
  initialState,
  reducers: {
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    setDayTheme: (state, action) => {
      state.dayTheme = action.payload || getRandomFallbackTheme();
    },
    resetToToday: (state) => {
      state.selectedDate = getTodayDateString();
    },
  },
});

export const { setSelectedDate, setDayTheme, resetToToday } =
  activeDaySlice.actions;
export default activeDaySlice.reducer;
