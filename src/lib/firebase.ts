import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

try {
  // Check if config is provided and not a placeholder
  if (!firebaseConfig || !firebaseConfig.apiKey || firebaseConfig.apiKey.includes('TU_API_KEY')) {
    console.error("Firebase is not configured. Please see README.md for instructions.");
  }
  
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.error("Firebase initialization failed:", error);
}

export { auth, db };
export const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
  if (!auth) throw new Error("Firebase Auth is not initialized.");
  
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error("Login failed with error code:", error.code);
    
    // Improved user-facing errors
    if (error.code === 'auth/popup-blocked') {
      throw new Error("El navegador bloqueó la ventana emergente de inicio de sesión. Por favor, actívalas.");
    } else if (error.code === 'auth/unauthorized-domain') {
      throw new Error(`Este dominio (${window.location.hostname}) no está autorizado en Firebase. Agrégalo en la consola de Firebase.`);
    } else {
      throw new Error("Error al conectar con Google. Por favor, intenta de nuevo.");
    }
  }
};

export const logout = () => auth && signOut(auth);
