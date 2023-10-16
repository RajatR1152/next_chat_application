import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"


const firebaseConfig = {
  apiKey: "AIzaSyBI8EdBTYabemE60DfSm8WzUi2jbb_kOks",
  authDomain: "insta-clone-2aa4f.firebaseapp.com",
  databaseURL: "https://insta-clone-2aa4f-default-rtdb.firebaseio.com",
  projectId: "insta-clone-2aa4f",
  storageBucket: "insta-clone-2aa4f.appspot.com",
  messagingSenderId: "968180758142",
  appId: "1:968180758142:web:5a6a93c2a38e22679c8a2f",
  measurementId: "G-538S84HMEW"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);