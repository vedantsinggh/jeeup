// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBesnr9xa7OVJJYfGL0C5LCBiyM-YrfZJ4",
  authDomain: "jeeup-2b746.firebaseapp.com",
  projectId: "jeeup-2b746",
  storageBucket: "jeeup-2b746.appspot.com",
  messagingSenderId: "563164884802",
  appId: "1:563164884802:web:d39fa14fa5df0e71be62db",
  measurementId: "G-FVSZN5TXLE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
