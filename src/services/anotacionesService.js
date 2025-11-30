import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from './firebase';
import { obtenerFechaHoy } from '../utils/dateUtils';
import { marcarDuplicados } from '../utils/duplicateDetector';

/**
 * Genera un ID único simple
 */
const generarId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const calcularEstadisticas = (lista) => {
  const stats = {
    residentes: 0,
    coae: 0,
    pago: 0,
    total: 0
  };

  lista.forEach(persona => {
    // Validar que categoria existe
    if (!persona || !persona.categoria) {
      console.warn('⚠️ Persona sin categoría:', persona);
      stats.total++;
      return;
    }
    
    // Normalizar categoría
    const categoria = persona.categoria.toLowerCase();
    
    if (categoria === 'residente') {
      stats.residentes++;
    } else if (categoria === 'coae') {
      stats.coae++;
    } else if (categoria === 'pago') {
      stats.pago++;
    } else {
      console.warn('⚠️ Categoría desconocida:', categoria);
    }
    
    stats.total++;
  });

  return stats;
};

/**
 * Obtiene las anotaciones de un día específico
 */
export const obtenerAnotacionesDia = async (fecha = obtenerFechaHoy()) => {
  try {
    const docRef = doc(db, 'anotaciones', fecha);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        almuerzo: marcarDuplicados(data.almuerzo || []),
        cena: marcarDuplicados(data.cena || []),
        estadisticas: data.estadisticas || {}
      };
    } else {
      return {
        almuerzo: [],
        cena: [],
        estadisticas: {
          almuerzos: { residentes: 0, coae: 0, pago: 0, total: 0 },
          cenas: { residentes: 0, coae: 0, pago: 0, total: 0 }
        }
      };
    }
  } catch (error) {
    console.error('Error al obtener anotaciones:', error);
    throw error;
  }
};

/**
 * Agrega una nueva anotación
 */
export const agregarAnotacion = async (persona, tipoComida, fecha = obtenerFechaHoy()) => {
  try {
    const docRef = doc(db, 'anotaciones', fecha);
    const docSnap = await getDoc(docRef);
    
// AGREGAR ESTE CONSOLE.LOG AQUÍ
    console.log('🔍 Persona recibida:', persona);
    console.log('🔍 Tipo comida:', tipoComida);

    const nuevaPersona = {
  id: generarId(),
  nombre: persona.nombre,
  numeroId: persona.numeroId || '',
  categoria: persona.categoria,
  grado: persona.grado || 'cabo', // ← AGREGAR ESTE CAMPO
  observaciones: persona.observaciones || '',
  horaAnotacion: new Date()
};

    let almuerzo = [];
    let cena = [];
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      almuerzo = data.almuerzo || [];
      cena = data.cena || [];
    }

    // Agregar según el tipo de comida
    if (tipoComida === 'almuerzo' || tipoComida === 'ambos') {
      almuerzo.push(nuevaPersona);
    }
    if (tipoComida === 'cena' || tipoComida === 'ambos') {
      cena.push(nuevaPersona);
    }

    // Calcular estadísticas
    const estadisticas = {
      almuerzos: calcularEstadisticas(almuerzo),
      cenas: calcularEstadisticas(cena)
    };
console.log('📊 Estadísticas calculadas:', estadisticas);
    await setDoc(docRef, {
      fecha,
      almuerzo,
      cena,
      estadisticas
    });

    return true;
 } catch (error) {
  console.error('Error COMPLETO al agregar anotación:', error);
  console.error('Código de error:', error.code);
  console.error('Mensaje:', error.message);
  throw error;
}
};

/**
 * Elimina una anotación
 */
export const eliminarAnotacion = async (personaId, tipoComida, fecha = obtenerFechaHoy()) => {
  try {
    const docRef = doc(db, 'anotaciones', fecha);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('No hay anotaciones para este día');
    }

    const data = docSnap.data();
    let almuerzo = data.almuerzo || [];
    let cena = data.cena || [];

    // Eliminar según el tipo de comida
    if (tipoComida === 'almuerzo') {
      almuerzo = almuerzo.filter(p => p.id !== personaId);
    } else if (tipoComida === 'cena') {
      cena = cena.filter(p => p.id !== personaId);
    }

    // Recalcular estadísticas
    const estadisticas = {
      almuerzos: calcularEstadisticas(almuerzo),
      cenas: calcularEstadisticas(cena)
    };

    await updateDoc(docRef, {
      almuerzo,
      cena,
      estadisticas
    });

    return true;
  } catch (error) {
    console.error('Error al eliminar anotación:', error);
    throw error;
  }
};

/**
 * Actualiza una anotación existente
 */
export const actualizarAnotacion = async (personaId, personaActualizada, tipoComida, fecha = obtenerFechaHoy()) => {
  try {
    const docRef = doc(db, 'anotaciones', fecha);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('No hay anotaciones para este día');
    }

    const data = docSnap.data();
    let almuerzo = data.almuerzo || [];
    let cena = data.cena || [];

    // Actualizar según el tipo de comida
    if (tipoComida === 'almuerzo') {
      almuerzo = almuerzo.map(p => 
        p.id === personaId ? { ...p, ...personaActualizada } : p
      );
    } else if (tipoComida === 'cena') {
      cena = cena.map(p => 
        p.id === personaId ? { ...p, ...personaActualizada } : p
      );
    }

    // Recalcular estadísticas
    const estadisticas = {
      almuerzos: calcularEstadisticas(almuerzo),
      cenas: calcularEstadisticas(cena)
    };

    await updateDoc(docRef, {
      almuerzo,
      cena,
      estadisticas
    });

    return true;
  } catch (error) {
    console.error('Error al actualizar anotación:', error);
    throw error;
  }
};

/**
 * Obtiene el historial de un mes
 */
export const obtenerHistorialMes = async (mes) => {
  try {
    const anotacionesRef = collection(db, 'anotaciones');
    const q = query(
      anotacionesRef,
      where('fecha', '>=', `${mes}-01`),
      where('fecha', '<=', `${mes}-31`)
    );
    
    const querySnapshot = await getDocs(q);
    const dias = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      dias.push({
        fecha: data.fecha,
        almuerzos: data.estadisticas?.almuerzos?.total || 0,
        cenas: data.estadisticas?.cenas?.total || 0,
        total: (data.estadisticas?.almuerzos?.total || 0) + (data.estadisticas?.cenas?.total || 0)
      });
    });

    // Ordenar por fecha
    dias.sort((a, b) => b.fecha.localeCompare(a.fecha));

    return dias;
  } catch (error) {
    console.error('Error al obtener historial:', error);
    throw error;
  }
};