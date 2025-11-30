import { useState, useEffect } from 'react';
import { esAntesDe } from '../utils/dateUtils';

/**
 * Hook para verificar si está abierto el horario de anotación
 */
export const useHorario = (horaLimiteAlmuerzo = '10:00', horaLimiteCena = '16:00') => {
  const [almuerzoCerrado, setAlmuerzoCerrado] = useState(false);
  const [cenaCerrada, setCenaCerrada] = useState(false);

  useEffect(() => {
    // Verificar horarios al cargar
    const verificarHorarios = () => {
      setAlmuerzoCerrado(!esAntesDe(horaLimiteAlmuerzo));
      setCenaCerrada(!esAntesDe(horaLimiteCena));
    };

    verificarHorarios();

    // Verificar cada minuto
    const intervalo = setInterval(verificarHorarios, 60000);

    return () => clearInterval(intervalo);
  }, [horaLimiteAlmuerzo, horaLimiteCena]);

  return { almuerzoCerrado, cenaCerrada };
};