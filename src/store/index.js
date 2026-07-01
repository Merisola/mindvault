// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import activeDayReducer from "./activeDaySlice";
import vaultReducer from "./vaultSlice";
import rootSaga from "./sagas"; // Import our brand new root watcher loop

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    activeDay: activeDayReducer,
    vault: vaultReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: false,
    }).concat(sagaMiddleware),
});

// Fire up the continuous background watcher thread
sagaMiddleware.run(rootSaga);
