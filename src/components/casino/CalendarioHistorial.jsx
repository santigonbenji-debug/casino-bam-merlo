import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarioHistorial.css';
import { dateAStringSeguro } from '../../utils/dateUtils';
/**
 * 📅 CALENDARIO INTERACTIVO PARA HISTORIAL
 * - Muestra días con actividad resaltados
 * - Solo permite clickear días que tienen datos
 * - Navegación por meses
 */
const CalendarioHistorial = ({ 
  diasActivos = [], 
  onDiaSeleccionado, 
  mesActual,
  diaSeleccionado 
}) => {
  const [fecha, setFecha] = useState(mesActual || new Date());

  /**
   * Handler cuando se hace click en un día
   */
  const handleDiaClick = (nuevaFecha) => {
    const fechaStr = formatearFechaYYYYMMDD(nuevaFecha);
    
    // Solo permitir click si el día tiene actividad
    if (diasActivos.includes(fechaStr)) {
      setFecha(nuevaFecha);
      onDiaSeleccionado(fechaStr);
    }
  };

  /**
   * Determina la clase CSS de cada día según su estado
   */
  const tileClassName = ({ date, view }) => {
    if (view !== 'month') return null;
    
    const fechaStr = formatearFechaYYYYMMDD(date);
    
    // Día seleccionado actualmente
    if (fechaStr === diaSeleccionado) {
      return 'dia-seleccionado';
    }
    
    // Día con actividad
    if (diasActivos.includes(fechaStr)) {
      return 'dia-con-actividad';
    }
    
    // Día sin actividad
    return 'dia-sin-actividad';
  };

  /**
   * Deshabilita días sin actividad (no son clickeables)
   */
  const tileDisabled = ({ date, view }) => {
    if (view !== 'month') return false;
    
    const fechaStr = formatearFechaYYYYMMDD(date);
    return !diasActivos.includes(fechaStr);
  };

  /**
   * Handler cuando cambia el mes navegado
   */
  const handleActiveStartDateChange = ({ activeStartDate }) => {
    // Notificar al padre que cambió el mes para cargar nuevos días activos
    if (onDiaSeleccionado) {
      const mesNuevo = formatearMesYYYYMM(activeStartDate);
      // Aquí podrías emitir un evento para recargar días del nuevo mes
    }
  };

  return (
    <div className="calendario-historial-wrapper">
      <Calendar
        value={fecha}
        onClickDay={handleDiaClick}
        tileClassName={tileClassName}
        tileDisabled={tileDisabled}
        locale="es-ES"
        className="calendario-personalizado"
        prev2Label={null} // Ocultar navegación por año
        next2Label={null}
        onActiveStartDateChange={handleActiveStartDateChange}
      />
      
      {/* Leyenda */}
      <div className="calendario-leyenda mt-4 flex gap-4 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-indigo-500 rounded"></div>
          <span>Días con actividad</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-300 rounded"></div>
          <span>Sin registros</span>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// UTILIDADES
// ============================================================================

/**
 * Formatea Date a 'YYYY-MM-DD'
 */
const formatearFechaYYYYMMDD = (date) => {
  return dateAStringSeguro(date); // ✅ Usa la función mejorada
};

/**
 * Formatea Date a 'YYYY-MM'
 */
const formatearMesYYYYMM = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

export default CalendarioHistorial;
