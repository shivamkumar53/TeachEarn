  // Importing Firebase and necessary modules from Firebase v9+
  import { initializeApp } from 'firebase/app';  // Initialize Firebase
  import { getAuth, GoogleAuthProvider } from 'firebase/auth';  // Authentication methods
  import { getFirestore } from 'firebase/firestore';  // Firestore methods

  // 🔹 Firebase Config (Already Provided)
  const firebaseConfig = {
    apiKey: "AIzaSyDug5Jzdx_XXoAsUIYfc5YRaDGSS4RMnY0",
    authDomain: "edumatch-bf103.firebaseapp.com",
    projectId: "edumatch-bf103",
    storageBucket: "edumatch-bf103.appspot.com",  // Fixed storage bucket URL
    messagingSenderId: "951932783213",
    appId: "1:951932783213:web:6d65d1e56708fb703a0d64",
    measurementId: "G-Q0R7EE7CWD",
  };

  // 🔹 Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // 🔹 Firebase Authentication
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();

  // 🔹 Firebase Firestore (Database)
  const db = getFirestore(app);

  // Exporting Auth, Firestore, and GoogleAuthProvider for use in other parts of your app
  export { auth, db, googleProvider };

