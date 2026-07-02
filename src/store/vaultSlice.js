// src/store/vaultSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  entries: [],
  isLoading: false,
  error: null,
};

const vaultSlice = createSlice({
  name: "vault",
  initialState,
  reducers: {
    // These actions will be intercepted later by our Redux-Saga layer
    fetchEntriesRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchEntriesSuccess: (state, action) => {
      state.isLoading = false;
      state.entries = action.payload;
    },
    fetchEntriesFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    saveEntryRequest: (state) => {
      state.isLoading = true;
    },
    saveEntrySuccess: (state, action) => {
      state.isLoading = false;
      state.entries.unshift(action.payload); // Stamped at top of bento timeline feed
    },
    saveEntryFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    // Interactive reminder checklist toggle
    toggleReminderComplete: (state, action) => {
      const entryId = action.payload;
      const existingEntry = state.entries.find((entry) => entry.id === entryId);
      if (existingEntry && existingEntry.category === "reminder") {
        existingEntry.reminder_completed = !existingEntry.reminder_completed;
      }
    },
    deleteEntrySuccess: (state, action) => {
      state.entries = state.entries.filter(
        (entry) => entry.id !== action.payload,
      );
    },
  },
});

export const {
  fetchEntriesRequest,
  fetchEntriesSuccess,
  fetchEntriesFailure,
  saveEntryRequest,
  saveEntrySuccess,
  saveEntryFailure,
  toggleReminderComplete,
  deleteEntrySuccess,
} = vaultSlice.actions;

export default vaultSlice.reducer;
