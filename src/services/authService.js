import { 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth } from './firebase';
import { validarPIN } from './pinService';

const TURNO_CASINO_EMAIL = 'turnocasino@bammerlo.internal';
// Contraseña fija del usuario de Firebase (nunca cambia)
// El PIN diario es una capa adicional de seguridad
const FIREBASE_PASSWORD = 'casino2025';
/**
 * Inicia sesión del turno casino con PIN diario
 */
export const iniciarSesionConPIN = async (pin) => {
  try {
    // Primero validar el PIN del día
    const resultadoPIN = await validarPIN(pin);
    
    if (!resultadoPIN.valido) {
      throw new Error(resultadoPIN.mensaje || 'PIN incorrecto');
    }

    // Si el PIN es válido, hacer login en Firebase
    const userCredential = await signInWithEmailAndPassword(
      auth,
      TURNO_CASINO_EMAIL,
      FIREBASE_PASSWORD
    );
    
    return userCredential.user;
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    
    if (error.message.includes('PIN')) {
      throw error; // Re-lanzar errores de PIN tal como vienen
    }
    
    if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
      throw new Error('Error de autenticación. Contacta al administrador.');
    }
    
    throw new Error('Error al iniciar sesión. Intenta de nuevo.');
  }
};

/**
 * Cierra sesión
 */
export const cerrarSesion = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    throw error;
  }
};

/**
 * Obtiene el usuario actual
 */
export const obtenerUsuarioActual = () => {
  return auth.currentUser;
};

/**
 * Observa cambios en el estado de autenticación
 */
export const observarAutenticacion = (callback) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Crea el usuario del turno casino (solo para setup inicial)
 * NOTA: Esto solo se debe ejecutar UNA VEZ para crear el usuario
 */
export const crearUsuarioTurnoCasino = async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      TURNO_CASINO_EMAIL,
      FIREBASE_PASSWORD
    );
    return userCredential.user;
  } catch (error) {
    console.error('Error al crear usuario:', error);
    throw error;
  }
};

// ============ COMPATIBILIDAD CON CÓDIGO ANTERIOR ============
// Mantener la función antigua por si acaso
export const iniciarSesion = iniciarSesionConPIN;
