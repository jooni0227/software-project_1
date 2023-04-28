import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB_bx1qEnzYXXZFqFmqlRKCzGyGmZPjbdI",
  authDomain: "drinking-fa921.firebaseapp.com",
  projectId: "drinking-fa921",
  storageBucket: "drinking-fa921.appspot.com",
  messagingSenderId: "106921754397",
  appId: "1:106921754397:web:22121de642b0982ae0abf4",
  measurementId: "G-6QSFWRBD0F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);