import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAzQm4cmQVUJt94bb1CPA9jS7X6AN8vHVE",
    authDomain: "projectcost-bf1cd.firebaseapp.com",
    projectId: "projectcost-bf1cd",
    storageBucket: "projectcost-bf1cd.firebasestorage.app",
    messagingSenderId: "981370579274",
    appId: "1:981370579274:web:68e37f7b97e471c54679b3"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };