import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB2NqvJMUCK5C3QfVW31ILwsW7oPV52O5c",
  authDomain: "watch-ai-new.firebaseapp.com",
  projectId: "watch-ai-new",
  storageBucket: "watch-ai-new.firebasestorage.app",
  messagingSenderId: "510683991264",
  appId: "1:510683991264:web:7b5b955f50d0c4de029485",
  measurementId: "G-QK3KV6LVMN"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();