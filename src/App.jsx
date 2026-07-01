// src/App.jsx
import { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "@store";
import { fetchEntriesRequest, saveEntryRequest } from "./store/vaultSlice";

// A temporary mini-component to test our live Redux-Saga async loop integrations
function VaultTestingDashboard() {
  const dispatch = useDispatch();
  const { entries, isLoading } = useSelector((state) => state.vault);
  const { selectedDate, dayTheme } = useSelector((state) => state.activeDay);

  // Pull all archived items from IndexedDB on initial mount
  useEffect(() => {
    dispatch(fetchEntriesRequest());
  }, [dispatch]);

  const handleCreateMockEntry = () => {
    const mockEntry = {
      id: `mv_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`,
      auto_title: `✨ Moment logged on July 1, 2026 Afternoon`,
      category: "moment",
      day_period: "Afternoon",
      year: 2026,
      date_string: selectedDate,
      day_theme: dayTheme,
      media_type: "text",
      audio_blob_url: null,
      transcript: null,
      image_url: null,
      text_content: "Checking the live asynchronous Redux-Saga watcher cycle!",
      reminder_completed: false,
    };

    // Dispatch the request action into our background Saga thread
    dispatch(saveEntryRequest(mockEntry));
  };

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "600px",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <h1 style={{ color: "#00adb5" }}>🔒 MindVault Architecture Active</h1>
      <p style={{ color: "#b5b5b5" }}>
        Current Theme Context: <strong>"{dayTheme}"</strong>
      </p>

      <button
        onClick={handleCreateMockEntry}
        style={{
          padding: "0.8rem 1.5rem",
          background: "#00adb5",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          fontSize: "1rem",
          cursor: "pointer",
          margin: "1rem 0",
        }}
      >
        Test Async Log Entry
      </button>

      <div style={{ marginTop: "2rem", textAlign: "left" }}>
        <h3>Timeline Sync Log ({entries.length} items found)</h3>
        {isLoading && <p>Reading secure local sandbox...</p>}
        <ul style={{ listStyle: "none", padding: 0 }}>
          {entries.map((entry) => (
            <li
              key={entry.id}
              style={{
                background: "#222831",
                padding: "1rem",
                borderRadius: "6px",
                marginBottom: "0.5rem",
                borderLeft: "4px solid #00adb5",
              }}
            >
              <strong>{entry.auto_title}</strong>
              <p
                style={{
                  margin: "0.5rem 0 0",
                  fontSize: "0.9rem",
                  color: "#eeeeee",
                }}
              >
                {entry.text_content}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <div
        style={{
          background: "#1a1a2e",
          color: "#fff",
          minHeight: "100vh",
          paddingTop: "2rem",
        }}
      >
        <VaultTestingDashboard />
      </div>
    </Provider>
  );
}

export default App;
