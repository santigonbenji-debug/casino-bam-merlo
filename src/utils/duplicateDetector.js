/**
 * Normaliza un nombre para comparación
 */
const normalizarNombre = (nombre) => {
  if (!nombre) return '';
  return nombre.toLowerCase().trim();
};

/**
 * Detecta si una persona está duplicada en una lista
 * @param {string} nombre - Nombre de la persona a verificar
 * @param {Array} lista - Lista de personas existentes
 * @returns {boolean}
 */
export const esDuplicado = (nombre, lista) => {
  if (!nombre || !lista || lista.length === 0) return false;
  
  const nombreNormalizado = normalizarNombre(nombre);
  
  return lista.some(persona => 
    normalizarNombre(persona.nombre) === nombreNormalizado
  );
};

/**
 * Marca duplicados en una lista de anotaciones
 * @param {Array} lista - Lista de anotaciones
 * @returns {Array} - Lista con campo esDuplicado marcado
 */
export const marcarDuplicados = (lista) => {
  if (!lista || lista.length === 0) return [];

  const nombresVistos = {};
  
  return lista.map(persona => {
    const nombreNormalizado = normalizarNombre(persona.nombre);
    
    if (nombresVistos[nombreNormalizado]) {
      return { ...persona, esDuplicado: true };
    }
    
    nombresVistos[nombreNormalizado] = true;
    return { ...persona, esDuplicado: false };
  });
};

/**
 * Encuentra todos los duplicados en una lista
 * @param {Array} lista - Lista de anotaciones
 * @returns {Array} - Array con los nombres duplicados
 */
export const encontrarDuplicados = (lista) => {
  if (!lista || lista.length === 0) return [];

  const conteo = {};
  const duplicados = [];

  lista.forEach(persona => {
    const nombreNormalizado = normalizarNombre(persona.nombre);
    conteo[nombreNormalizado] = (conteo[nombreNormalizado] || 0) + 1;
  });

  Object.keys(conteo).forEach(nombre => {
    if (conteo[nombre] > 1) {
      duplicados.push(nombre);
    }
  });

  return duplicados;
};