// src/store/storageDriver.js
import localforage from "localforage";

// Configure a dedicated IndexedDB sandbox for MindVault
const mindVaultStorage = localforage.createInstance({
  name: "MindVaultDB",
  storeName: "user_vault_entries",
  description:
    "Secure local sandbox for storing multimodal text, compressed snap photos, and raw voice recording streams.",
});

export default mindVaultStorage;
