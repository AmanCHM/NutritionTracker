
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyByo2LkLYbSf0tw6G-ynBGOuNqDhTlikFE",
  authDomain: "nutrition-tracker-45168.firebaseapp.com",
  projectId: "nutrition-tracker-45168",
  storageBucket: "nutrition-tracker-45168.firebasestorage.app",
  messagingSenderId: "652371815139",
  appId: "1:652371815139:web:59bada9aa8fb9c18fb33d6"
};

export default firebaseConfig;
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// Initialize Firestore and Storage
const db = getFirestore(app);  // Firestore initialization
const storage = getStorage(app);  // Firebase Storage initialization


export {auth, storage, db};
