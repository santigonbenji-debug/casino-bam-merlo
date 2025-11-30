import { useState, useEffect } from 'react';
import { esAntesDe, esHorarioAnticipado } from '../utils/dateUtils';

/**
 * Hook para verificar si está abierto el horario de anotación
 * Después de las 22:00, se considera horario anticipado y todo está abierto
 */
export const useHorario = (horaLimiteAlmuerzo = '10:00', horaLimiteCena = '16:00') => {
  const [almuerzoCerrado, setAlmuerzoCerrado] = useState(false);
  const [cenaCerrada, setCenaCerrada] = useState(false);
  const [esAnticipado, setEsAnticipado] = useState(false);

  useEffect(() => {
    // Verificar horarios al cargar
    const verificarHorarios = () => {
      const horarioAnticipado = esHorarioAnticipado();
      setEsAnticipado(horarioAnticipado);

      // Si es horario anticipado (después de las 22:00), todo está abierto
      if (horarioAnticipado) {
        setAlmuerzoCerrado(false);
        setCenaCerrada(false);
      } else {
        // Horario normal: verificar límites
        setAlmuerzoCerrado(!esAntesDe(horaLimiteAlmuerzo));
        setCenaCerrada(!esAntesDe(horaLimiteCena));
      }
    };

    verificarHorarios();

    // Verificar cada minuto
    const intervalo = setInterval(verificarHorarios, 60000);

    return () => clearInterval(intervalo);
  }, [horaLimiteAlmuerzo, horaLimiteCena]);

  return { almuerzoCerrado, cenaCerrada, esAnticipado };
};