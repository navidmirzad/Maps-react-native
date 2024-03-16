// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDB6rVJ3CIVSVOe8jkFl-BitUqEVO3po2E",
  authDomain: "react-native-maps-25e17.firebaseapp.com",
  projectId: "react-native-maps-25e17",
  storageBucket: "react-native-maps-25e17.appspot.com",
  messagingSenderId: "708225740109",
  appId: "1:708225740109:web:0c4575b0109e67f70a5b04",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app);
const storage = getStorage(app);
export { app, database, storage };
