import { useState, useEffect } from 'react';
import { obtenerInfoPIN, regenerarPIN } from '../../services/pinService';
import Button from '../common/Button';
import toast from 'react-hot-toast';

export default function PanelPINDelDia() {
  const [pin, setPin] = useState('');
  const [fechaGeneracion, setFechaGeneracion] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [copiado, setCopiado] = useState(false);

  const cargarPIN = async () => {
    try {
      setCargando(true);
      const info = await obtenerInfoPIN();
      setPin(info.pin);
      setFechaGeneracion(info.fechaGeneracion);
      
      if (info.esNuevo) {
        toast.success('Nuevo PIN generado automáticamente');
      }
    } catch (error) {
      toast.error('Error al cargar el PIN');
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPIN();
    
    // Recargar cada minuto para verificar si cambió
    const intervalo = setInterval(cargarPIN, 60000);
    
    return () => clearInterval(intervalo);
  }, []);

  const copiarPIN = () => {
    navigator.clipboard.writeText(pin);
    setCopiado(true);
    toast.success('PIN copiado al portapapeles');
    setTimeout(() => setCopiado(false), 2000);
  };

  const handleRegenerar = async () => {
    if (!confirm('¿Estás seguro de regenerar el PIN? Esto invalidará el PIN actual.')) {
      return;
    }

    try {
      setCargando(true);
      const nuevoPIN = await regenerarPIN();
      setPin(nuevoPIN);
      setFechaGeneracion(new Date());
      toast.success('PIN regenerado exitosamente');
    } catch (error) {
      toast.error('Error al regenerar el PIN');
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  const formatearHora = (fecha) => {
    if (!fecha) return '';
    return fecha.toLocaleTimeString('es-AR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    return fecha.toLocaleDateString('es-AR', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (cargando && !pin) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8">
        <div className="flex items-center justify-center h-32 sm:h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-2xl p-4 sm:p-8">
      {/* Header - Responsive */}
      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">
          🔐 PIN del Día
        </h2>
        <p className="text-indigo-100 text-base sm:text-lg">
          {formatearFecha(fechaGeneracion)}
        </p>
      </div>

      {/* PIN en grande - Responsive */}
      <div className="bg-white rounded-2xl p-6 sm:p-12 mb-4 sm:mb-6 shadow-xl">
        <div className="text-center">
          {/* PIN adaptado a móvil */}
          <div className="text-5xl sm:text-7xl font-bold text-indigo-600 tracking-widest font-mono break-all">
            {pin}
          </div>
          <p className="mt-3 sm:mt-4 text-gray-500 text-xs sm:text-sm">
            Generado a las {formatearHora(fechaGeneracion)}
          </p>
        </div>
      </div>

      {/* Información adicional - Responsive */}
      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 text-white">
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between text-sm sm:text-base">
            <span className="text-indigo-100">📅 Válido hasta:</span>
            <span className="font-semibold">Mañana 7:00 AM</span>
          </div>
          <div className="flex items-center justify-between text-sm sm:text-base">
            <span className="text-indigo-100">🔄 Próxima renovación:</span>
            <span className="font-semibold">Automática</span>
          </div>
        </div>
      </div>

      {/* Botones de acción - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <button
          onClick={copiarPIN}
          className="bg-white text-indigo-600 hover:bg-indigo-50 font-semibold py-3 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          {copiado ? '✓ Copiado' : '📋 Copiar PIN'}
        </button>
        
        <button
          onClick={handleRegenerar}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
          disabled={cargando}
        >
          🔄 Regenerar
        </button>
      </div>

      {/* Instrucciones - Responsive */}
      <div className="mt-4 sm:mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
        <h4 className="font-semibold text-yellow-900 mb-2 text-sm sm:text-base">📝 Instrucciones:</h4>
        <ol className="text-xs sm:text-sm text-yellow-800 space-y-1 list-decimal list-inside">
          <li>Anotá este PIN en papel</li>
          <li>Entregalo al turno entrante</li>
          <li>El PIN se renueva a las 7:00 AM</li>
          <li>Solo usá "Regenerar" en emergencias</li>
        </ol>
      </div>
    </div>
  );
}