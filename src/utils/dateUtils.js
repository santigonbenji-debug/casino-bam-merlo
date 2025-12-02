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
 * Obtiene la fecha de mañana en formato YYYY-MM-DD
 */
export const obtenerFechaManana = () => {
  const manana = new Date();
  manana.setDate(manana.getDate() + 1);
  const year = manana.getFullYear();
  const month = String(manana.getMonth() + 1).padStart(2, '0');
  const day = String(manana.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Obtiene la fecha para anotaciones según la hora actual
 * Si son más de las 22:00, devuelve la fecha de mañana
 * Si no, devuelve la fecha de hoy
 */
export const obtenerFechaParaAnotacion = () => {
  const ahora = new Date();
  const horaActual = ahora.getHours();
  
  // Después de las 22:00 (10 PM), se anota para mañana
  if (horaActual >= 22) {
    return obtenerFechaManana();
  }
  
  return obtenerFechaHoy();
};

/**
 * Verifica si estamos en horario de anotación anticipada (después de las 22:00)
 */
export const esHorarioAnticipado = () => {
  const ahora = new Date();
  const horaActual = ahora.getHours();
  return horaActual >= 22;
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

/**
 * Formatea una fecha YYYY-MM-DD a formato legible
 */
export const formatearFechaLegible = (fechaString) => {
  const [year, month, day] = fechaString.split('-');
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return `${parseInt(day)} de ${meses[parseInt(month) - 1]} de ${year}`;
};

/**
 * Normaliza una fecha a medianoche en timezone local
 * Previene problemas de desfase de días por timezone
 */
export const normalizarFechaLocal = (fecha) => {
  const f = new Date(fecha);
  return new Date(f.getFullYear(), f.getMonth(), f.getDate(), 0, 0, 0, 0);
};

/**
 * Convierte Date a string 'YYYY-MM-DD' sin problemas de timezone
 */
export const dateAStringSeguro = (date) => {
  const f = normalizarFechaLocal(date);
  const year = f.getFullYear();
  const month = String(f.getMonth() + 1).padStart(2, '0');
  const day = String(f.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};