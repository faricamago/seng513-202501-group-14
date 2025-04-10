// firebaseStorageHelper.js

import { bucket } from "./firebase-admin-config.js";

export function getStoragePathFromUrl(url) {
  try {
    // Firebase URL example:
    // https://firebasestorage.googleapis.com/v0/b/your-project-id.appspot.com/o/uploads%2F123456-filename.jpg?alt=media&token=...
    const parts = url.split("/o/");
    if (parts.length < 2) return null;
    const filePart = parts[1].split("?")[0];
    return decodeURIComponent(filePart);
  } catch (error) {
    console.error("Error extracting storage path:", error);
    return null;
  }
}

export async function deleteFileFromFirebase(storagePath) {
  try {
    if (!storagePath) return;
    await bucket.file(storagePath).delete();
    console.log(`Deleted file from Firebase Storage: ${storagePath}`);
  } catch (error) {
    console.error("Error deleting file from Firebase Storage:", error);
  }
}
