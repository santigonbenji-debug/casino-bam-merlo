import { useState, useEffect } from 'react';
import { obtenerAnotacionesDia } from '../services/anotacionesService';
import { obtenerFechaHoy } from '../utils/dateUtils';

/**
 * Hook para manejar las anotaciones del día
 */
export const useAnotaciones = (fecha = obtenerFechaHoy()) => {
  const [anotaciones, setAnotaciones] = useState({
    almuerzo: [],
    cena: [],
    estadisticas: {
      almuerzos: { residentes: 0, coae: 0, pago: 0, total: 0 },
      cenas: { residentes: 0, coae: 0, pago: 0, total: 0 }
    }
  });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargarAnotaciones = async () => {
    try {
      setCargando(true);
      setError(null);
      const data = await obtenerAnotacionesDia(fecha);
      console.log('📥 Anotaciones cargadas:', JSON.stringify(data, null, 2));
console.log('📥 Almuerzo:', data.almuerzo);
console.log('📥 Cena:', data.cena);
console.log('📥 Estadísticas:', data.estadisticas);
      
      setAnotaciones(data);
    } catch (err) {
      console.error('Error al cargar anotaciones:', err);
      setError('Error al cargar las anotaciones');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarAnotaciones();
  }, [fecha]);

  return {
    anotaciones,
    cargando,
    error,
    recargar: cargarAnotaciones
  };
};