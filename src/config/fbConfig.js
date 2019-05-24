import firebase from "firebase/app";
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/auth';

const config = {
  apiKey: "AIzaSyA_ueUafbArPm3C6bjNl_g6hZ6_sHWVSSE",
  authDomain: "attendance-b753a.firebaseapp.com",
  databaseURL: "https://attendance-b753a.firebaseio.com",
  projectId: "attendance-b753a",
  storageBucket: "attendance-b753a.appspot.com",
  messagingSenderId: "740274845896"
};
firebase.initializeApp(config);

export default firebase;