import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBj5zspsCehVnu3ZAQroQsBRe67jny1pnY",
  authDomain: "house-marketplace-app-f29ed.firebaseapp.com",
  projectId: "house-marketplace-app-f29ed",
  storageBucket: "house-marketplace-app-f29ed.appspot.com",
  messagingSenderId: "653060447895",
  appId: "1:653060447895:web:ef73075234f0e11b2193d2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();
