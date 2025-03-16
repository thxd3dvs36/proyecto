import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDSYa0NUaBIMNCyVd0wpQiKNkac-ig_J7E",
  authDomain: "tiny-town-5c1e4.firebaseapp.com",
  projectId: "tiny-town-5c1e4",
  storageBucket: "tiny-town-5c1e4.firebasestorage.app",
  messagingSenderId: "310925143108",
  appId: "1:310925143108:web:ce054ed527c107532f6011",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
