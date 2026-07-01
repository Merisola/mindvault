// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import activeDayReducer from "./activeDaySlice";
import vaultReducer from "./vaultSlice";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    activeDay: activeDayReducer,
    vault: vaultReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false, // Disabling native thunks since we enforce strict Redux-Saga pipelines
      serializableCheck: false, // Needed for local binary Blob pipeline stream items later
    }).concat(sagaMiddleware),
});

// Export saga run trigger proxy for Milestone 6 hook-up
export const runSaga = (rootSaga) => sagaMiddleware.run(rootSaga);
