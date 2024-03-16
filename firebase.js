// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBFyuiQiE0usHpviTie8GPQxV6Je_Mfo6I",
  authDomain: "maps-2cc51.firebaseapp.com",
  projectId: "maps-2cc51",
  storageBucket: "maps-2cc51.appspot.com",
  messagingSenderId: "84861572138",
  appId: "1:84861572138:web:42ca00fc9fb7ef1f051f53",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app);
const storage = getStorage(app);
export { app, database, storage };
