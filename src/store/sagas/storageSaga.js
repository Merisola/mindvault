// src/store/sagas/storageSaga.js
import { call, put } from "redux-saga/effects";
import mindVaultStorage from "../storageDriver";
import {
  fetchEntriesSuccess,
  fetchEntriesFailure,
  saveEntrySuccess,
  saveEntryFailure,
} from "../vaultSlice";

// Database Key Constants
const VAULT_STORAGE_KEY = "mindvault_entries_array";

/**
 * Low-Level Storage Worker Engine
 * Directly reads the entries array collection array from IndexedDB
 */
export function* readEntriesFromDB() {
  try {
    // call wraps the asynchronous LocalForage promise wrapper
    const entries = yield call(
      [mindVaultStorage, mindVaultStorage.getItem],
      VAULT_STORAGE_KEY,
    );
    return entries || [];
  } catch (error) {
    // eslint-disable-next-line preserve-caught-error
    throw new Error(`IndexedDB read failure: ${error.message}`);
  }
}

/**
 * Worker Saga: Fetches all entries to populate the Bento Timeline
 */
export function* fetchEntriesWorkerSaga() {
  try {
    const entries = yield call(readEntriesFromDB);
    yield put(fetchEntriesSuccess(entries));
  } catch (error) {
    yield put(fetchEntriesFailure(error.message));
  }
}

/**
 * Worker Saga: Commits a fresh multimodal entry to the local IndexedDB state
 */
export function* saveEntryWorkerSaga(action) {
  try {
    const currentEntries = yield call(readEntriesFromDB);
    const newEntry = action.payload;

    // Unshift ensures the newest entry rests at index position 0
    const updatedEntries = [newEntry, ...currentEntries];

    // Commit payload collection write array directly to IndexedDB
    yield call(
      [mindVaultStorage, mindVaultStorage.setItem],
      VAULT_STORAGE_KEY,
      updatedEntries,
    );

    // Tell the Redux UI state everything is secured safely
    yield put(saveEntrySuccess(newEntry));
  } catch (error) {
    yield put(saveEntryFailure(error.message));
  }
}
