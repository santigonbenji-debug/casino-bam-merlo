import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Configuración DIRECTA (hardcodeada)
const firebaseConfig = {
  apiKey: "AIzaSyAf4qSy19iptmp7gJhiRMAsnxEcVzsbErE",
  authDomain: "casino-bam-merlo.firebaseapp.com",
  projectId: "casino-bam-merlo",
  storageBucket: "casino-bam-merlo.firebasestorage.app",
  messagingSenderId: "972918310446",
  appId: "1:972918310446:web:30b0400717b8fd3e1bc1bf"
};

console.log('🔥 Inicializando Firebase con config:', firebaseConfig);

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

console.log('✅ Firebase inicializado correctamente');

export default app;