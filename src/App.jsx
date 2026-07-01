// src/App.jsx
import React from "react";
import { Provider } from "react-redux";
import { store } from "@store";
import DailyCanvas from "@components/DailyCanvas";

function App() {
  return (
    <Provider store={store}>
      <main className="max-w-3xl mx-auto px-4 py-8 md:py-12 min-height-screen">
        <DailyCanvas />
      </main>
    </Provider>
  );
}

export default App;
