import { useState } from 'react';
import TablaAnotaciones from './TablaAnotaciones';
import Button from '../common/Button';
import { exportarDiaExcel } from '../../services/exportService';
import { encontrarDuplicados } from '../../utils/duplicateDetector';
import { obtenerFechaHoy } from '../../utils/dateUtils';
import toast from 'react-hot-toast';

export default function PanelListas({ anotaciones, onRecargar }) {
  const [tabActiva, setTabActiva] = useState('almuerzo');

  const handleExportar = () => {
    try {
      exportarDiaExcel(
        obtenerFechaHoy(),
        anotaciones.almuerzo,
        anotaciones.cena
      );
      toast.success('Excel exportado correctamente');
    } catch (error) {
      console.error('Error al exportar:', error);
      toast.error('Error al exportar a Excel');
    }
  };

  const duplicadosAlmuerzo = encontrarDuplicados(anotaciones.almuerzo);
  const duplicadosCena = encontrarDuplicados(anotaciones.cena);
  const hayDuplicados = duplicadosAlmuerzo.length > 0 || duplicadosCena.length > 0;

  const statsAlmuerzo = anotaciones.estadisticas?.almuerzos || { residentes: 0, coae: 0, pago: 0, total: 0 };
  const statsCena = anotaciones.estadisticas?.cenas || { residentes: 0, coae: 0, pago: 0, total: 0 };

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b-2 border-gray-200">
        <button
          onClick={() => setTabActiva('almuerzo')}
          className={`pb-3 px-6 font-semibold transition-colors ${
            tabActiva === 'almuerzo'
              ? 'text-indigo-600 border-b-3 border-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          🍽️ Almuerzo
        </button>
        <button
          onClick={() => setTabActiva('cena')}
          className={`pb-3 px-6 font-semibold transition-colors ${
            tabActiva === 'cena'
              ? 'text-indigo-600 border-b-3 border-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          🌙 Cena
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {tabActiva === 'almuerzo' ? (
          <>
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-lg text-center">
              <h3 className="text-3xl font-bold">{statsAlmuerzo.residentes}</h3>
              <p className="text-sm opacity-90">Residentes</p>
            </div>
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-lg text-center">
              <h3 className="text-3xl font-bold">{statsAlmuerzo.coae}</h3>
              <p className="text-sm opacity-90">COAE</p>
            </div>
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-lg text-center">
              <h3 className="text-3xl font-bold">{statsAlmuerzo.pago}</h3>
              <p className="text-sm opacity-90">Abonan</p>
            </div>
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-lg text-center">
              <h3 className="text-3xl font-bold">{statsAlmuerzo.total}</h3>
              <p className="text-sm opacity-90">TOTAL</p>
            </div>
          </>
        ) : (
          <>
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-lg text-center">
              <h3 className="text-3xl font-bold">{statsCena.residentes}</h3>
              <p className="text-sm opacity-90">Residentes</p>
            </div>
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-lg text-center">
              <h3 className="text-3xl font-bold">{statsCena.coae}</h3>
              <p className="text-sm opacity-90">COAE</p>
            </div>
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-lg text-center">
              <h3 className="text-3xl font-bold">{statsCena.pago}</h3>
              <p className="text-sm opacity-90">Abonan</p>
            </div>
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-lg text-center">
              <h3 className="text-3xl font-bold">{statsCena.total}</h3>
              <p className="text-sm opacity-90">TOTAL</p>
            </div>
          </>
        )}
      </div>

      {/* Botón Exportar */}
      <div className="mb-6">
        <Button onClick={handleExportar} variant="primary">
          📥 Exportar a Excel
        </Button>
      </div>

      {/* Tabla */}
      <TablaAnotaciones
        anotaciones={tabActiva === 'almuerzo' ? anotaciones.almuerzo : anotaciones.cena}
        tipoComida={tabActiva}
        onRecargar={onRecargar}
      />

      {/* Advertencia de duplicados */}
      {hayDuplicados && (
        <div className="mt-6 bg-yellow-50 border-l-4 border-orange-500 p-4 rounded">
          <p className="font-semibold text-orange-800">
            ⚠️ Atención: Hay personas anotadas más de una vez
          </p>
        </div>
      )}
    </div>
  );
}