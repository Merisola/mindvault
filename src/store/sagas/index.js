// src/store/sagas/index.js
import { all, takeLatest } from "redux-saga/effects";
import { fetchEntriesWorkerSaga, saveEntryWorkerSaga } from "./storageSaga";

/**
 * Root Saga Watcher Engine
 * Listens for specific incoming action dispatches and hands off execution
 * to designated IndexedDB database storage workers.
 */
function* watchVaultActions() {
  // takeLatest ensures that if a user double-clicks rapidly, we only execute the latest action
  yield takeLatest("vault/fetchEntriesRequest", fetchEntriesWorkerSaga);
  yield takeLatest("vault/saveEntryRequest", saveEntryWorkerSaga);
}

export default function* rootSaga() {
  yield all([watchVaultActions()]);
}
