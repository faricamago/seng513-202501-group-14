// upload.js


import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase-config.js";
import multer from "multer";


const upload = multer({ storage: multer.memoryStorage() });


async function uploadImage(file) {
  if (!file) return;

 
  const fileName = `${Date.now()}-${file.originalname}`;
 
  const firebaseStorageRef = ref(storage, `uploads/${fileName}`);

  try {
   
    await uploadBytes(firebaseStorageRef, file.buffer);
  
    const url = await getDownloadURL(firebaseStorageRef);
    console.log("Uploaded file available at:", url);
    return url;
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
}

export { upload, uploadImage };

