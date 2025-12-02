import { 
  collection, 
  getDocs, 
  doc,
  getDoc,
  query,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * 🔍 SERVICIO DE HISTORIAL COMPLETO
 * Gestiona consultas optimizadas para el archivo histórico
 */

/**
 * Obtiene todos los meses que tienen actividad registrada
 * @returns {Promise<Array>} Array de objetos { mes: 'YYYY-MM', label: 'Diciembre 2025' }
 */
export const obtenerMesesConActividad = async () => {
  try {
    const anotacionesRef = collection(db, 'anotaciones');
    const snapshot = await getDocs(anotacionesRef);
    
    const mesesSet = new Set();
    
    snapshot.forEach((doc) => {
      const fecha = doc.id; // El ID del documento ES la fecha (YYYY-MM-DD)
      const mes = fecha.substring(0, 7); // Extraer YYYY-MM
      mesesSet.add(mes);
    });

    // Convertir a array y ordenar descendente (más reciente primero)
    const mesesArray = Array.from(mesesSet).sort((a, b) => b.localeCompare(a));
    
    // Formatear con nombre legible
    const mesesFormateados = mesesArray.map(mes => ({
      mes,
      label: obtenerNombreMesCompleto(mes)
    }));

    return mesesFormateados;
  } catch (error) {
    console.error('❌ Error al obtener meses con actividad:', error);
    throw error;
  }
};

/**
 * Obtiene los días de un mes que tienen actividad registrada
 * @param {string} mes - Mes en formato 'YYYY-MM'
 * @returns {Promise<Array<string>>} Array de fechas 'YYYY-MM-DD' que tienen datos
 */
export const obtenerDiasActivosDelMes = async (mes) => {
  try {
    const anotacionesRef = collection(db, 'anotaciones');
    const snapshot = await getDocs(anotacionesRef);
    
    const diasActivos = [];
    
    snapshot.forEach((doc) => {
      const fecha = doc.id; // YYYY-MM-DD
      if (fecha.startsWith(mes)) {
        diasActivos.push(fecha);
      }
    });

    // Ordenar ascendente
    return diasActivos.sort();
  } catch (error) {
    console.error('❌ Error al obtener días activos:', error);
    throw error;
  }
};

/**
 * Obtiene la información COMPLETA de un día específico
 * @param {string} fecha - Fecha en formato 'YYYY-MM-DD'
 * @returns {Promise<Object>} { fecha, almuerzo[], cena[], estadisticas }
 */
export const obtenerDetalleCompletoDia = async (fecha) => {
  try {
    const docRef = doc(db, 'anotaciones', fecha);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null; // El día no tiene datos
    }

    const data = docSnap.data();
    
    return {
      fecha: data.fecha,
      almuerzo: data.almuerzo || [],
      cena: data.cena || [],
      estadisticas: data.estadisticas || {
        almuerzos: { residentes: 0, coae: 0, pago: 0, total: 0 },
        cenas: { residentes: 0, coae: 0, pago: 0, total: 0 }
      }
    };
  } catch (error) {
    console.error('❌ Error al obtener detalle del día:', error);
    throw error;
  }
};

/**
 * Obtiene resumen estadístico de un mes (para las tarjetas de totales)
 * @param {string} mes - Mes en formato 'YYYY-MM'
 * @returns {Promise<Object>} { totalAlmuerzos, totalCenas, totalRaciones, dias[] }
 */
export const obtenerResumenMes = async (mes) => {
  try {
    const anotacionesRef = collection(db, 'anotaciones');
    const snapshot = await getDocs(anotacionesRef);
    
    const dias = [];
    let totalAlmuerzos = 0;
    let totalCenas = 0;
    
    snapshot.forEach((doc) => {
      const fecha = doc.id;
      if (fecha.startsWith(mes)) {
        const data = doc.data();
        const almuerzos = data.estadisticas?.almuerzos?.total || 0;
        const cenas = data.estadisticas?.cenas?.total || 0;
        
        dias.push({
          fecha,
          almuerzos,
          cenas,
          total: almuerzos + cenas
        });
        
        totalAlmuerzos += almuerzos;
        totalCenas += cenas;
      }
    });

    // Ordenar días descendente (más reciente primero)
    dias.sort((a, b) => b.fecha.localeCompare(a.fecha));

    return {
      totalAlmuerzos,
      totalCenas,
      totalRaciones: totalAlmuerzos + totalCenas,
      dias
    };
  } catch (error) {
    console.error('❌ Error al obtener resumen del mes:', error);
    throw error;
  }
};

/**
 * Verifica si un día específico tiene actividad registrada
 * @param {string} fecha - Fecha en formato 'YYYY-MM-DD'
 * @returns {Promise<boolean>}
 */
export const diaTieneActividad = async (fecha) => {
  try {
    const docRef = doc(db, 'anotaciones', fecha);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  } catch (error) {
    console.error('❌ Error al verificar actividad del día:', error);
    return false;
  }
};

// ============================================================================
// UTILIDADES INTERNAS
// ============================================================================

/**
 * Convierte 'YYYY-MM' a 'Diciembre 2025'
 */
const obtenerNombreMesCompleto = (mesString) => {
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  const [year, month] = mesString.split('-');
  return `${meses[parseInt(month) - 1]} ${year}`;
};
