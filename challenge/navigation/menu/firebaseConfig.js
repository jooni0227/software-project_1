import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB_bx1qEnzYXXZFqFmqlRKCzGyGmZPjbdI",
    authDomain: "drinking-fa921.firebaseapp.com",
    databaseURL: "https://drinking-fa921-default-rtdb.firebaseio.com",
    projectId: "drinking-fa921",
    storageBucket: "drinking-fa921.appspot.com",
    messagingSenderId: "106921754397",
    appId: "1:106921754397:web:73ccec87d82dd006e0abf4",
    measurementId: "G-X1WXJDB2CK"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);