// src/App.jsx
import { Provider } from "react-redux";
import { store } from "@store"; // Using our sweet absolute path alias!

function App() {
  return (
    <Provider store={store}>
      <div
        style={{
          fontFamily: "system-ui, sans-serif",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <h1>✨ MindVault Redux Store Initialized</h1>
        <p>
          Active states and taxonomy structures provisioned safely across client
          pipelines.
        </p>
      </div>
    </Provider>
  );
}

export default App;
