// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDPvVzwaQkn8PKTvAYF5ij_UMYyKTcV_U4",
  authDomain: "dinoverse-file-uploads.firebaseapp.com",
  projectId: "dinoverse-file-uploads",
  storageBucket: "dinoverse-file-uploads.firebasestorage.app",
  messagingSenderId: "869245451091",
  appId: "1:869245451091:web:55b21b0c3d3d5f4934ffa6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };