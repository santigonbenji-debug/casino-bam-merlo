export const GRADOS_SUBOFICIALES = [
  { value: 'sm', label: 'Suboficial Mayor' },
  { value: 'sp', label: 'Suboficial Principal' },
  { value: 'sa', label: 'Suboficial Ayudante' },
  { value: 'saux', label: 'Suboficial Auxiliar' },
  { value: 'cp', label: 'Cabo Principal' },
  { value: 'c1', label: 'Cabo Primero' },
  { value: 'cabo', label: 'Cabo' }
];

export const obtenerNombreGrado = (valor) => {
  const grado = GRADOS_SUBOFICIALES.find(g => g.value === valor);
  return grado ? grado.label : valor;
};