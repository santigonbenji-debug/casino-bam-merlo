import { useState, useEffect } from 'react';
import { obtenerHistorialMes } from '../../services/anotacionesService';
import { exportarMesExcel } from '../../services/exportService';
import { obtenerMesActual, obtenerNombreMes } from '../../utils/dateUtils';
import Button from '../common/Button';
import Loader from '../common/Loader';
import toast from 'react-hot-toast';

export default function PanelHistorial() {
  const [mesSeleccionado, setMesSeleccionado] = useState(obtenerMesActual());
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [totales, setTotales] = useState({
    totalAlmuerzos: 0,
    totalCenas: 0,
    totalRaciones: 0
  });

  useEffect(() => {
    cargarHistorial();
  }, [mesSeleccionado]);

  const cargarHistorial = async () => {
    try {
      setCargando(true);
      const data = await obtenerHistorialMes(mesSeleccionado);
      setHistorial(data);
      
      // Calcular totales
      const totalAlmuerzos = data.reduce((sum, dia) => sum + dia.almuerzos, 0);
      const totalCenas = data.reduce((sum, dia) => sum + dia.cenas, 0);
      setTotales({
        totalAlmuerzos,
        totalCenas,
        totalRaciones: totalAlmuerzos + totalCenas
      });
    } catch (error) {
      console.error('Error al cargar historial:', error);
      toast.error('Error al cargar el historial');
    } finally {
      setCargando(false);
    }
  };

  const handleExportarMes = () => {
    try {
      exportarMesExcel(mesSeleccionado, historial);
      toast.success('Historial exportado correctamente');
    } catch (error) {
      console.error('Error al exportar:', error);
      toast.error('Error al exportar el historial');
    }
  };

  // Generar opciones de meses (últimos 12 meses)
  const generarOpcionesMeses = () => {
    const opciones = [];
    const hoy = new Date();
    
    for (let i = 0; i < 12; i++) {
      const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
      const year = fecha.getFullYear();
      const month = String(fecha.getMonth() + 1).padStart(2, '0');
      const mesString = `${year}-${month}`;
      opciones.push({
        value: mesString,
        label: obtenerNombreMes(mesString)
      });
    }
    
    return opciones;
  };

  const opcionesMeses = generarOpcionesMeses();

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Historial y Estadísticas
      </h2>

      {/* Selector de mes */}
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Seleccionar mes
        </label>
        <select
          value={mesSeleccionado}
          onChange={(e) => setMesSeleccionado(e.target.value)}
          className="w-full md:w-auto px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all bg-white"
        >
          {opcionesMeses.map(opcion => (
            <option key={opcion.value} value={opcion.value}>
              {opcion.label}
            </option>
          ))}
        </select>
      </div>

      {cargando ? (
        <Loader message="Cargando historial..." />
      ) : (
        <>
          {/* Estadísticas del mes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-lg text-center">
              <h3 className="text-4xl font-bold">{totales.totalAlmuerzos}</h3>
              <p className="text-sm opacity-90 mt-2">Almuerzos totales</p>
            </div>
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-lg text-center">
              <h3 className="text-4xl font-bold">{totales.totalCenas}</h3>
              <p className="text-sm opacity-90 mt-2">Cenas totales</p>
            </div>
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-lg text-center">
              <h3 className="text-4xl font-bold">{totales.totalRaciones}</h3>
              <p className="text-sm opacity-90 mt-2">Raciones totales</p>
            </div>
          </div>

          {/* Botón exportar */}
          <div className="mb-6">
            <Button onClick={handleExportarMes} variant="primary">
              📥 Exportar Mes a Excel
            </Button>
          </div>

          {/* Tabla de resumen por día */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <h3 className="text-lg font-bold text-gray-800 p-4 bg-gray-50 border-b">
              Resumen por día
            </h3>
            
            {historial.length === 0 ? (
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
                    </tr>
                  </thead>
                  <tbody>
                    {historial.map((dia) => (
                      <tr key={dia.fecha} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-medium">{dia.fecha}</td>
                        <td className="px-4 py-3 text-center">{dia.almuerzos}</td>
                        <td className="px-4 py-3 text-center">{dia.cenas}</td>
                        <td className="px-4 py-3 text-center font-bold text-indigo-600">
                          {dia.total}
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