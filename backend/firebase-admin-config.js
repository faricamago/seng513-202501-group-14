// firebase-admin-config.js
import admin from "firebase-admin";
// import serviceAccount from "./dinoverse-file-uploads-firebase-adminsdk-fbsvc-3163feb581.json" assert { type: "json" };
// Don't delete it!!!!
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const serviceAccount = require("./dinoverse-file-uploads-firebase-adminsdk-fbsvc-3163feb581.json");

// Initialize the Firebase Admin app if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "dinoverse-file-uploads.firebasestorage.app", // Ensure this is the correct bucket name
  });
}

// Get a reference to the storage bucket
const bucket = admin.storage().bucket();

export { admin, bucket };
