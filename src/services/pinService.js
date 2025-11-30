import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

const PIN_COLLECTION = 'sistema';
const PIN_DOC_ID = 'pin_diario';

/**
 * Genera un PIN aleatorio de 6 dígitos
 */
const generarPIN = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Verifica si el PIN actual expiró (pasaron las 7:00 AM del día actual)
 */
const pinExpirado = (fechaGeneracion) => {
  if (!fechaGeneracion) return true;

  const ahora = new Date();
  const fechaGen = fechaGeneracion.toDate();
  
  // Crear fecha de hoy a las 07:00 AM
  const hoy7AM = new Date(ahora);
  hoy7AM.setHours(7, 0, 0, 0);
  
  // Si ya pasaron las 7 AM de hoy y el PIN se generó antes de las 7 AM de hoy
  if (ahora >= hoy7AM && fechaGen < hoy7AM) {
    return true;
  }
  
  return false;
};

/**
 * Obtiene el PIN del día actual, lo genera si es necesario
 */
export const obtenerPINDelDia = async () => {
  try {
    const pinRef = doc(db, PIN_COLLECTION, PIN_DOC_ID);
    const pinSnap = await getDoc(pinRef);

    // Si no existe o expiró, generar nuevo PIN
    if (!pinSnap.exists() || pinExpirado(pinSnap.data()?.fechaGeneracion)) {
      const nuevoPIN = generarPIN();
      
      await setDoc(pinRef, {
        pin: nuevoPIN,
        fechaGeneracion: serverTimestamp(),
        generadoPor: 'sistema'
      });

      return nuevoPIN;
    }

    // Retornar el PIN actual
    return pinSnap.data().pin;
  } catch (error) {
    console.error('Error al obtener/generar PIN:', error);
    throw new Error('Error al obtener el PIN del día');
  }
};

/**
 * Valida si un PIN ingresado es correcto
 */
export const validarPIN = async (pinIngresado) => {
  try {
    const pinRef = doc(db, PIN_COLLECTION, PIN_DOC_ID);
    const pinSnap = await getDoc(pinRef);

    if (!pinSnap.exists()) {
      return { valido: false, mensaje: 'No hay PIN configurado' };
    }

    const { pin, fechaGeneracion } = pinSnap.data();

    // Verificar si expiró
    if (pinExpirado(fechaGeneracion)) {
      return { 
        valido: false, 
        mensaje: 'El PIN expiró. Generando nuevo PIN...' 
      };
    }

    // Validar el PIN
    if (pinIngresado === pin) {
      return { valido: true };
    }

    return { 
      valido: false, 
      mensaje: 'PIN incorrecto' 
    };
  } catch (error) {
    console.error('Error al validar PIN:', error);
    return { 
      valido: false, 
      mensaje: 'Error al validar el PIN' 
    };
  }
};

/**
 * Obtiene información completa del PIN actual (para mostrar en pantalla)
 */
export const obtenerInfoPIN = async () => {
  try {
    const pinRef = doc(db, PIN_COLLECTION, PIN_DOC_ID);
    const pinSnap = await getDoc(pinRef);

    if (!pinSnap.exists()) {
      // Generar uno nuevo si no existe
      const nuevoPIN = await obtenerPINDelDia();
      return {
        pin: nuevoPIN,
        esNuevo: true,
        fechaGeneracion: new Date()
      };
    }

    const { pin, fechaGeneracion } = pinSnap.data();

    // Si expiró, generar nuevo
    if (pinExpirado(fechaGeneracion)) {
      const nuevoPIN = await obtenerPINDelDia();
      return {
        pin: nuevoPIN,
        esNuevo: true,
        fechaGeneracion: new Date()
      };
    }

    return {
      pin,
      esNuevo: false,
      fechaGeneracion: fechaGeneracion.toDate()
    };
  } catch (error) {
    console.error('Error al obtener info del PIN:', error);
    throw error;
  }
};

/**
 * Genera un nuevo PIN manualmente (solo para emergencias)
 */
export const regenerarPIN = async () => {
  try {
    const nuevoPIN = generarPIN();
    const pinRef = doc(db, PIN_COLLECTION, PIN_DOC_ID);
    
    await setDoc(pinRef, {
      pin: nuevoPIN,
      fechaGeneracion: serverTimestamp(),
      generadoPor: 'manual'
    });

    return nuevoPIN;
  } catch (error) {
    console.error('Error al regenerar PIN:', error);
    throw error;
  }
};
