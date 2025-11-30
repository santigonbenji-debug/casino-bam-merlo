import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

const CONFIG_DOC_ID = 'actual';

/**
 * Obtiene la configuración actual del sistema
 */
export const obtenerConfiguracion = async () => {
  try {
    const docRef = doc(db, 'configuracion', CONFIG_DOC_ID);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // Si no existe, crear configuración por defecto
      const configDefault = {
        menuAlmuerzo: 'Milanesas con puré | Ensalada mixta | Fruta',
        menuCena: 'Guiso de lentejas | Pan | Postre',
        costoPlato: 2500,
        horaLimiteAlmuerzo: '10:00',
        horaLimiteCena: '16:00'
      };
      await setDoc(docRef, configDefault);
      return configDefault;
    }
  } catch (error) {
    console.error('Error al obtener configuración:', error);
    throw error;
  }
};

/**
 * Actualiza la configuración del sistema
 */
export const actualizarConfiguracion = async (nuevaConfig) => {
  try {
    const docRef = doc(db, 'configuracion', CONFIG_DOC_ID);
    await updateDoc(docRef, {
      ...nuevaConfig,
      ultimaActualizacion: new Date()
    });
    return true;
  } catch (error) {
    console.error('Error al actualizar configuración:', error);
    throw error;
  }
};