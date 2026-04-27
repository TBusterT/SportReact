// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // <-- Додали імпорт Firestore

const firebaseConfig = {
    apiKey: "AIzaSyCteHXUNMLgN_McOGabNTl05UaVNwcZGN8",
    authDomain: "fitmonitor-38915.firebaseapp.com",
    projectId: "fitmonitor-38915",
    storageBucket: "fitmonitor-38915.firebasestorage.app",
    messagingSenderId: "917150804724",
    appId: "1:917150804724:web:b3f76488a46c5bd7f08ca1",
    measurementId: "G-H411ZFXZLG"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
// Експортуємо базу даних, щоб використовувати її в компонентах!
export const db = getFirestore(app);