// upload.js

// Use ES modules-style imports for Firebase Storage functions.
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase-config.js";
import multer from "multer";

// Use multer's memory storage so that uploaded files are stored in memory as buffers.
const upload = multer({ storage: multer.memoryStorage() });

// Function to upload an image file to Firebase Storage.
async function uploadImage(file) {
  if (!file) return;

  // Create a unique filename using the current timestamp and the original filename.
  const fileName = `${Date.now()}-${file.originalname}`;
  // Create a storage reference at a path like "uploads/<fileName>"
  const firebaseStorageRef = ref(storage, `uploads/${fileName}`);

  try {
    // Because we're using memoryStorage, the file is in file.buffer.
    await uploadBytes(firebaseStorageRef, file.buffer);
    // Retrieve the download URL for the uploaded file.
    const url = await getDownloadURL(firebaseStorageRef);
    console.log("Uploaded file available at:", url);
    return url;
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
}

export { upload, uploadImage };

