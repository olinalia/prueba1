const firebaseConfig = {
  apiKey: "AIzaSyBnO16zDtZcXnlkKNr9OOGwSUrRDY",
  authDomain: "perfumes-olinalia-820a5.firebaseapp.com",
  projectId: "perfumes-olinalia-820a5",
  storageBucket: "perfumes-olinalia-820a5.appspot.com",
  messagingSenderId: "372996498236",
  appId: "1:372996498236:web:ff23aabdf6494086b14b9",
  measurementId: "G-C9XKV0VSWF"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage(); 