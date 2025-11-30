import { 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth } from './firebase';

const TURNO_CASINO_EMAIL = 'turnocasino@bammerlo.internal';

/**
 * Inicia sesión del turno casino
 */
export const iniciarSesion = async (password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      TURNO_CASINO_EMAIL,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
      throw new Error('Usuario o contraseña incorrectos');
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
export const crearUsuarioTurnoCasino = async (password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      TURNO_CASINO_EMAIL,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error('Error al crear usuario:', error);
    throw error;
  }
};