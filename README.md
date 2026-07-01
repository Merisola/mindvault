# 🔒 MindVault

MindVault is an everyday, multimodal mental sanctuary designed to capture life continuously, preventing daily "brain leakage" of sudden thoughts, snapshots, flashes of inspiration, and reminders. 

Built with a modern, high-performance web architecture, it handles client-side asset processing and state management independently of active servers, creating a flawless foundation for future native mobile deployment.

---

## 🚀 Key Features (MVP Phase)

- **The Daily Canvas & Theme Engine:** Treats every day as a clean slate. Captures a centralized "Day Theme" and stamps it contextually onto every piece of logged data.
- **Multimodal Capture Pipeline:** Integrated audio recording (via native browser MediaRecorder), local real-time text transcription (via Web Speech API), and photography upload optimizations.
- **Precision-Free Auto-Naming:** Eliminates the cognitive friction of naming files by dynamically synthesizing entry titles using a custom formula: `[Category Emoji] [Category Name] logged on [Month Day], [Year] [Day Period]`.
- **4-Tier Taxonomy:** Organizes thoughts instantly into `✨ Moment`, `💭 Vibe`, `💡 Spark`, or `🔔 Reminder` containers.
- **Offline-First Resilience:** Secures high-footprint binary structures and base64 strings completely offline in the browser sandbox utilizing **IndexedDB**.

---

## 🛠️ The Tech Stack & Strategic Runway

- **Core Engine:** React 18 + Vite (Single Page Application SPA framework)
- **State Architecture:** Redux Toolkit (RTK)
- **Async Execution Layer:** Redux-Saga
- **Styling & Layout:** Emotion (CSS-in-JS Architecture)
- **Offline Driver:** LocalForage (IndexedDB abstraction layer)

> **Strategic Architecture Note:** The decision to construct MindVault as a client-independent Vite SPA allows the entire core asset-handling pipeline to be seamlessly compiled or wrapped into native mobile shells (like CapacitorJS) for iOS and Android deployment in Phase 2 without rewriting state management logic.

---

## 📦 Local Installation & Setup

1. **Clone the Repository:**
   ```bash
   git clone [https://github.com/yourusername/mindvault.git](https://github.com/yourusername/mindvault.git)
   cd mindvault