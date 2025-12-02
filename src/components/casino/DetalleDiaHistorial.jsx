import Button from '../common/Button';
import { exportarDiaExcel } from '../../services/exportService';
import { formatearFechaLegible } from '../../utils/dateUtils';
import { obtenerNombreGrado } from '../../utils/grados';
import toast from 'react-hot-toast';

/**
 * 📋 DETALLE COMPLETO DE UN DÍA HISTÓRICO
 * Muestra las listas de almuerzo y cena de un día específico
 */
const DetalleDiaHistorial = ({ fecha, almuerzo = [], cena = [], estadisticas, onCerrar }) => {
  
  const handleExportar = () => {
    try {
      exportarDiaExcel(fecha, almuerzo, cena);
      toast.success(`Lista del día ${fecha} exportada correctamente`);
    } catch (error) {
      console.error('Error al exportar:', error);
      toast.error('Error al exportar la lista');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border-2 border-indigo-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold">
              📅 {formatearFechaLegible(fecha)}
            </h3>
            <p className="text-indigo-100 mt-1">Detalle completo del día</p>
          </div>
          <button
            onClick={onCerrar}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            title="Cerrar detalle"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Estadísticas resumidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-50">
        <div className="text-center">
          <div className="text-3xl font-bold text-indigo-600">
            {estadisticas?.almuerzos?.total || 0}
          </div>
          <div className="text-sm text-gray-600">Almuerzos</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600">
            {estadisticas?.cenas?.total || 0}
          </div>
          <div className="text-sm text-gray-600">Cenas</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600">
            {(estadisticas?.almuerzos?.total || 0) + (estadisticas?.cenas?.total || 0)}
          </div>
          <div className="text-sm text-gray-600">Total Raciones</div>
        </div>
        <div className="text-center">
          <Button onClick={handleExportar} variant="primary" className="w-full">
            📊 Exportar
          </Button>
        </div>
      </div>

      {/* Tablas de listas */}
      <div className="p-6 space-y-6">
        {/* ALMUERZO */}
        <div>
          <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span className="text-2xl">🍽️</span>
            Almuerzo ({almuerzo.length} personas)
          </h4>
          {almuerzo.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay registros de almuerzo
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-indigo-500 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Grado</th>
                    <th className="px-4 py-3 text-left font-semibold">Nombre</th>
                    <th className="px-4 py-3 text-left font-semibold">Nº ID</th>
                    <th className="px-4 py-3 text-left font-semibold">Categoría</th>
                    <th className="px-4 py-3 text-left font-semibold">Observaciones</th>
                  </tr>
                </thead>
                <tbody>
                  {almuerzo.map((persona, index) => (
                    <FilaPersona key={persona.id || index} persona={persona} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* CENA */}
        <div>
          <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span className="text-2xl">🌙</span>
            Cena ({cena.length} personas)
          </h4>
          {cena.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay registros de cena
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-purple-500 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Grado</th>
                    <th className="px-4 py-3 text-left font-semibold">Nombre</th>
                    <th className="px-4 py-3 text-left font-semibold">Nº ID</th>
                    <th className="px-4 py-3 text-left font-semibold">Categoría</th>
                    <th className="px-4 py-3 text-left font-semibold">Observaciones</th>
                  </tr>
                </thead>
                <tbody>
                  {cena.map((persona, index) => (
                    <FilaPersona key={persona.id || index} persona={persona} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Componente de fila individual de persona
 */
const FilaPersona = ({ persona }) => {
  const getCategoriaColor = (categoria) => {
    switch(categoria?.toLowerCase()) {
      case 'residente': return 'bg-green-100 text-green-800';
      case 'coae': return 'bg-blue-100 text-blue-800';
      case 'pago': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <tr className="border-b hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 font-medium text-gray-700">
        {persona.grado ? obtenerNombreGrado(persona.grado) : '-'}
      </td>
      <td className="px-4 py-3 font-medium text-gray-900">
        {persona.nombre}
      </td>
      <td className="px-4 py-3 text-gray-600">
        {persona.numeroId || '-'}
      </td>
      <td className="px-4 py-3">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoriaColor(persona.categoria)}`}>
          {persona.categoria?.toUpperCase() || 'N/A'}
        </span>
      </td>
      <td className="px-4 py-3 text-gray-600 text-sm">
        {persona.observaciones || '-'}
      </td>
    </tr>
  );
};

export default DetalleDiaHistorial;
