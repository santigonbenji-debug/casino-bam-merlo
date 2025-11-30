/**
 * Obtiene la fecha actual en formato YYYY-MM-DD
 */
export const obtenerFechaHoy = () => {
  const hoy = new Date();
  const year = hoy.getFullYear();
  const month = String(hoy.getMonth() + 1).padStart(2, '0');
  const day = String(hoy.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Obtiene la hora actual en formato HH:MM
 */
export const obtenerHoraActual = () => {
  const ahora = new Date();
  const hours = String(ahora.getHours()).padStart(2, '0');
  const minutes = String(ahora.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

/**
 * Verifica si la hora actual es antes de una hora límite
 * @param {string} horaLimite - Hora en formato "HH:MM"
 * @returns {boolean}
 */
export const esAntesDe = (horaLimite) => {
  const ahora = obtenerHoraActual();
  return ahora < horaLimite;
};

/**
 * Formatea una fecha de Firestore timestamp a string legible
 */
export const formatearFecha = (timestamp) => {
  if (!timestamp) return '';
  const fecha = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return fecha.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

/**
 * Formatea una hora de Firestore timestamp a string HH:MM
 */
export const formatearHora = (timestamp) => {
  if (!timestamp) return '';
  const fecha = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return fecha.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

/**
 * Obtiene el mes actual en formato YYYY-MM
 */
export const obtenerMesActual = () => {
  const hoy = new Date();
  const year = hoy.getFullYear();
  const month = String(hoy.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

/**
 * Obtiene el nombre del mes en español
 */
export const obtenerNombreMes = (mesString) => {
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  const [year, month] = mesString.split('-');
  return `${meses[parseInt(month) - 1]} ${year}`;
};