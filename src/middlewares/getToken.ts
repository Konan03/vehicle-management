import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAD7EU0gvckFhseO9sXEXtw1s7I6OxmFgw",
  authDomain: "car-garage-management-d4a33.firebaseapp.com",
  databaseURL: "https://car-garage-management-d4a33-default-rtdb.firebaseio.com",
  projectId: "car-garage-management-d4a33",
  storageBucket: "car-garage-management-d4a33.firebasestorage.app",
  messagingSenderId: "106467122299",
  appId: "1:106467122299:web:0b9659f8b6ab619aea56de",
  measurementId: "G-DBPR4MM3ZH"
};

// Inicializa la aplicación de Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function getIdToken() {
  try {
    // Autenticación del usuario
    const userCredential = await signInWithEmailAndPassword(
      auth,
      "testuser@example.com", // Cambia este correo electrónico
      "password123"           // Cambia esta contraseña
    );

    const user = userCredential.user;
    if (user) {
      const idToken = await user.getIdToken();
      console.log("ID Token:", idToken);
    } else {
      console.log("No user logged in.");
    }
  } catch (error) {
    console.error("Error al autenticar:", error);
  }
}

getIdToken();
