import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDt3LiS8dC9qc3VW9Nq9kqc1kFXtR01TVU",
  authDomain: "intelliitask.firebaseapp.com",
  projectId: "intelliitask",
  storageBucket: "intelliitask.firebasestorage.app",
  messagingSenderId: "196240105264",
  appId: "1:196240105264:web:b352e095258921b9abb2f5",
  measurementId: "G-5PPYVM7WFZ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();