// src/App.jsx
import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { store } from "@store";
import { fetchEntriesRequest } from "@store/vaultSlice";
import DailyCanvas from "@components/DailyCanvas";
import BentoTimeline from "@components/BentoTimeline";
import InputSheet from "@components/InputSheet"; // Added!

function DashboardLoader() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchEntriesRequest());
  }, [dispatch]);

  return (
    <main className="max-w-3xl mx-auto px-4 pt-8 pb-24 md:py-12 min-h-screen bg-background text-textPrimary">
      <DailyCanvas />

      {/* We can clean out the ugly mock buttons block now because we have our polished slide tray tool! */}
      <BentoTimeline />

      {/* Control hub engine entry tier */}
      <InputSheet />
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
