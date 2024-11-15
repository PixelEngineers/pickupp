import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDnPFSoduIba9ySUFWnQAZ3-tkPQ1ymTPM",
    authDomain: "pickupp-6b3bf.firebaseapp.com",
    projectId: "pickupp-6b3bf",
    storageBucket: "pickupp-6b3bf.firebasestorage.app",
    messagingSenderId: "594050637954",
    appId: "1:594050637954:web:dc59d1413afdfdee19549b",
    measurementId: "G-502K5LG7PH",

    // https://stackoverflow.com/a/78714313
    signInFlow: 'popup'
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);