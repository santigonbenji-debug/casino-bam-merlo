/**
 * Valida que un nombre no esté vacío
 */
export const validarNombre = (nombre) => {
  if (!nombre || nombre.trim() === '') {
    return { valido: false, mensaje: 'El nombre es obligatorio' };
  }
  if (nombre.trim().length < 3) {
    return { valido: false, mensaje: 'El nombre debe tener al menos 3 caracteres' };
  }
  return { valido: true };
};

/**
 * Valida que al menos se haya seleccionado almuerzo o cena
 */
export const validarComidaSeleccionada = (almuerzo, cena) => {
  if (!almuerzo && !cena) {
    return { valido: false, mensaje: 'Debes seleccionar al menos Almuerzo o Cena' };
  }
  return { valido: true };
};

/**
 * Valida un formulario de persona completo
 */
export const validarPersona = (persona) => {
  if (!validarNombre(persona.nombre).valido) {
    return validarNombre(persona.nombre);
  }

  if (!persona.grado) {
    return { valido: false, mensaje: 'Debe seleccionar un grado' };
  }
  
  if (!validarComidaSeleccionada(persona.almuerzo, persona.cena).valido) {
    return validarComidaSeleccionada(persona.almuerzo, persona.cena);
  }
  
  return { valido: true, mensaje: '' };
};
/**
 * Valida que haya al menos una persona con datos completos
 */
export const validarFormularioCompleto = (personas) => {
  if (!personas || personas.length === 0) {
    return { valido: false, mensaje: 'Debes agregar al menos una persona' };
  }

  for (let i = 0; i < personas.length; i++) {
    const validacion = validarPersona(personas[i]);
    if (!validacion.valido) {
      return {
        valido: false,
        mensaje: `Persona ${i + 1}: ${validacion.mensaje}`
      };
    }
  }

  return { valido: true };
};