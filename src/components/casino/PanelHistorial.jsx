import { useState, useEffect } from 'react';
import { 
  obtenerMesesConActividad, 
  obtenerDiasActivosDelMes, 
  obtenerDetalleCompletoDia,
  obtenerResumenMes 
} from '../../services/historicoService';
import { exportarMesExcel } from '../../services/exportService';
import { obtenerMesActual } from '../../utils/dateUtils';
import CalendarioHistorial from './CalendarioHistorial';
import DetalleDiaHistorial from './DetalleDiaHistorial';
import Button from '../common/Button';
import Loader from '../common/Loader';
import toast from 'react-hot-toast';

/**
 * 📊 PANEL DE HISTORIAL COMPLETO
 * Sistema de archivo histórico con calendario interactivo
 */
export default function PanelHistorial() {
  // Estados principales
  const [mesSeleccionado, setMesSeleccionado] = useState(obtenerMesActual());
  const [mesesDisponibles, setMesesDisponibles] = useState([]);
  const [diasActivos, setDiasActivos] = useState([]);
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);
  const [detalleDia, setDetalleDia] = useState(null);
  const [resumenMes, setResumenMes] = useState({
    totalAlmuerzos: 0,
    totalCenas: 0,
    totalRaciones: 0,
    dias: []
  });

  // Estados de carga
  const [cargandoMeses, setCargandoMeses] = useState(true);
  const [cargandoDias, setCargandoDias] = useState(false);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);

  // ============================================================================
  // EFECTOS
  // ============================================================================

  /**
   * Cargar meses disponibles al montar el componente
   */
  useEffect(() => {
    cargarMesesDisponibles();
  }, []);

  /**
   * Cargar días activos cuando cambia el mes seleccionado
   */
  useEffect(() => {
    cargarDiasActivosYResumen();
  }, [mesSeleccionado]);

  // ============================================================================
  // FUNCIONES DE CARGA
  // ============================================================================

  /**
   * Carga los meses que tienen actividad registrada
   */
  const cargarMesesDisponibles = async () => {
    try {
      setCargandoMeses(true);
      const meses = await obtenerMesesConActividad();
      
      if (meses.length === 0) {
        toast.error('No hay historial registrado aún');
        setMesesDisponibles([{
          mes: obtenerMesActual(),
          label: 'Mes actual (sin datos)'
        }]);
      } else {
        setMesesDisponibles(meses);
        // Si el mes actual no está en la lista, seleccionar el más reciente
        if (!meses.find(m => m.mes === mesSeleccionado)) {
          setMesSeleccionado(meses[0].mes);
        }
      }
    } catch (error) {
      console.error('❌ Error al cargar meses:', error);
      toast.error('Error al cargar los meses disponibles');
    } finally {
      setCargandoMeses(false);
    }
  };

  /**
   * Carga días activos y resumen del mes seleccionado
   */
  const cargarDiasActivosYResumen = async () => {
    try {
      setCargandoDias(true);
      setDiaSeleccionado(null); // Limpiar día seleccionado
      setDetalleDia(null);

      // Cargar días activos y resumen en paralelo
      const [dias, resumen] = await Promise.all([
        obtenerDiasActivosDelMes(mesSeleccionado),
        obtenerResumenMes(mesSeleccionado)
      ]);

      setDiasActivos(dias);
      setResumenMes(resumen);
    } catch (error) {
      console.error('❌ Error al cargar días del mes:', error);
      toast.error('Error al cargar los datos del mes');
    } finally {
      setCargandoDias(false);
    }
  };

  /**
   * Carga el detalle completo de un día específico
   */
  const cargarDetalleDia = async (fecha) => {
    try {
      setCargandoDetalle(true);
      const detalle = await obtenerDetalleCompletoDia(fecha);
      
      if (detalle) {
        setDetalleDia(detalle);
        setDiaSeleccionado(fecha);
      } else {
        toast.error('No se encontraron datos para este día');
      }
    } catch (error) {
      console.error('❌ Error al cargar detalle del día:', error);
      toast.error('Error al cargar el detalle del día');
    } finally {
      setCargandoDetalle(false);
    }
  };

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleCambiarMes = (nuevoMes) => {
    setMesSeleccionado(nuevoMes);
  };

  const handleSeleccionarDia = (fecha) => {
    cargarDetalleDia(fecha);
  };

  const handleCerrarDetalle = () => {
    setDiaSeleccionado(null);
    setDetalleDia(null);
  };

  const handleExportarMes = () => {
    try {
      exportarMesExcel(mesSeleccionado, resumenMes.dias);
      toast.success('Historial del mes exportado correctamente');
    } catch (error) {
      console.error('Error al exportar:', error);
      toast.error('Error al exportar el historial');
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  if (cargandoMeses) {
    return <Loader message="Cargando historial..." />;
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          📊 Historial y Estadísticas
        </h2>
        <p className="text-gray-600">
          Consulta el archivo histórico completo y exporta datos por día o mes
        </p>
      </div>

      {/* SELECTOR DE MES */}
      <div className="bg-white p-6 rounded-lg shadow">
        <label className="block mb-3 text-sm font-semibold text-gray-700">
          📅 Seleccionar mes:
        </label>
        <select
          value={mesSeleccionado}
          onChange={(e) => handleCambiarMes(e.target.value)}
          className="w-full md:w-auto px-4 py-3 border-2 border-indigo-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all bg-white font-medium"
        >
          {mesesDisponibles.map(opcion => (
            <option key={opcion.mes} value={opcion.mes}>
              {opcion.label}
            </option>
          ))}
        </select>
      </div>

      {cargandoDias ? (
        <Loader message="Cargando datos del mes..." />
      ) : (
        <>
          {/* TARJETAS DE ESTADÍSTICAS DEL MES */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-lg text-center shadow-lg">
              <h3 className="text-5xl font-bold mb-2">{resumenMes.totalAlmuerzos}</h3>
              <p className="text-sm opacity-90">Almuerzos totales</p>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6 rounded-lg text-center shadow-lg">
              <h3 className="text-5xl font-bold mb-2">{resumenMes.totalCenas}</h3>
              <p className="text-sm opacity-90">Cenas totales</p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-6 rounded-lg text-center shadow-lg">
              <h3 className="text-5xl font-bold mb-2">{resumenMes.totalRaciones}</h3>
              <p className="text-sm opacity-90">Raciones totales</p>
            </div>
          </div>

          {/* CALENDARIO INTERACTIVO */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              📅 Calendario del mes
            </h3>
            <CalendarioHistorial
              diasActivos={diasActivos}
              onDiaSeleccionado={handleSeleccionarDia}
              mesActual={new Date(mesSeleccionado + '-15')} // Fecha en el medio del mes
              diaSeleccionado={diaSeleccionado}
            />
          </div>

          {/* DETALLE DEL DÍA SELECCIONADO */}
          {cargandoDetalle ? (
            <Loader message="Cargando detalle del día..." />
          ) : detalleDia ? (
            <DetalleDiaHistorial
              fecha={detalleDia.fecha}
              almuerzo={detalleDia.almuerzo}
              cena={detalleDia.cena}
              estadisticas={detalleDia.estadisticas}
              onCerrar={handleCerrarDetalle}
            />
          ) : (
            <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-8 text-center">
              <div className="text-6xl mb-4">👆</div>
              <h3 className="text-xl font-bold text-indigo-900 mb-2">
                Selecciona un día en el calendario
              </h3>
              <p className="text-indigo-700">
                Haz clic en cualquier día resaltado para ver su lista completa
              </p>
            </div>
          )}

          {/* TABLA RESUMEN POR DÍA */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">
                📋 Resumen por día
              </h3>
              <Button onClick={handleExportarMes} variant="primary">
                📥 Exportar Mes Completo
              </Button>
            </div>

            {resumenMes.dias.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No hay datos para este mes
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-indigo-500 text-white">
                      <th className="px-4 py-3 text-left font-semibold">Fecha</th>
                      <th className="px-4 py-3 text-center font-semibold">Almuerzos</th>
                      <th className="px-4 py-3 text-center font-semibold">Cenas</th>
                      <th className="px-4 py-3 text-center font-semibold">Total</th>
                      <th className="px-4 py-3 text-center font-semibold">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resumenMes.dias.map((dia) => (
                      <tr 
                        key={dia.fecha} 
                        className={`border-b transition-colors ${
                          diaSeleccionado === dia.fecha 
                            ? 'bg-indigo-50' 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <td className="px-4 py-3 font-medium">{dia.fecha}</td>
                        <td className="px-4 py-3 text-center">{dia.almuerzos}</td>
                        <td className="px-4 py-3 text-center">{dia.cenas}</td>
                        <td className="px-4 py-3 text-center font-bold text-indigo-600">
                          {dia.total}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleSeleccionarDia(dia.fecha)}
                            className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                          >
                            Ver detalle →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}