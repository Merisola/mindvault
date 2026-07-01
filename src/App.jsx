// src/App.jsx
import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@store";
import mindVaultStorage from "./store/storageDriver";

function App() {
  useEffect(() => {
    const verifyIndexedDBChannel = async () => {
      console.log("⚡ Starting MindVault Storage Driver Verification Check...");
      try {
        // Construct an SRS-compliant test item mock object
        const testMockEntry = {
          id: `mv_verification_test_${Date.now()}`,
          auto_title: "💡 Spark logged on July 1, 2026 Afternoon",
          category: "spark",
          day_period: "Afternoon",
          year: 2026,
          date_string: "2026-07-01",
          day_theme: "Verify Storage Systems",
          media_type: "text",
          audio_blob_url: null,
          transcript: null,
          image_url: null,
          text_content:
            "Testing LocalForage baseline abstraction write speed performance.",
          reminder_completed: false,
        };

        // Attempt direct hardware write transaction
        await mindVaultStorage.setItem("verification_test_key", testMockEntry);
        console.log("✅ IndexedDB Write Test: SUCCESS. Data secured locally.");

        // Attempt confirmation read transaction
        const verifiedResult = await mindVaultStorage.getItem(
          "verification_test_key",
        );
        console.log(
          "📖 IndexedDB Read Test: SUCCESS. Retransmitted payload content:",
          verifiedResult,
        );
      } catch (error) {
        console.error("❌ IndexedDB Pipeline Failure Error Details:", error);
      }
    };

    verifyIndexedDBChannel();
  }, []);

  return (
    <Provider store={store}>
      <div
        style={{
          fontFamily: "system-ui, sans-serif",
          padding: "2rem",
          textAlign: "center",
          background: "#121214",
          color: "#e1e1e6",
          minHeight: "100vh",
        }}
      >
        <h1 style={{ color: "#04d361" }}>✨ MindVault Storage Driver Active</h1>
        <p>
          Check your browser console (F12) to verify local memory sandbox
          transactions.
        </p>
      </div>
    </Provider>
  );
}

export default App;
