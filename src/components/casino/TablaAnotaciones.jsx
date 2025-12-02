import { formatearHora } from '../../utils/dateUtils';
import toast from 'react-hot-toast';
import { eliminarAnotacion } from '../../services/anotacionesService';
import { obtenerNombreGrado } from '../../utils/grados';
export default function TablaAnotaciones({ anotaciones, tipoComida, onRecargar }) {
  const handleEliminar = async (personaId) => {
    if (!window.confirm('¿Estás seguro de eliminar esta anotación?')) {
      return;
    }

    try {
      await eliminarAnotacion(personaId, tipoComida);
      toast.success('Anotación eliminada correctamente');
      onRecargar();
    } catch (error) {
      console.error('Error al eliminar:', error);
      toast.error('Error al eliminar la anotación');
    }
  };

  const getCategoriaColor = (categoria) => {
    switch (categoria) {
      case 'residente':
        return 'text-indigo-600';
      case 'coae':
        return 'text-green-600';
      case 'pago':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  const getCategoriaTexto = (categoria) => {
    switch (categoria) {
      case 'residente':
        return 'Residente';
      case 'coae':
        return 'COAE';
      case 'pago':
        return 'Pago';
      default:
        return categoria;
    }
  };

  if (!anotaciones || anotaciones.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No hay anotaciones todavía
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
  <tr className="bg-indigo-500 text-white">
    <th className="px-4 py-3 text-left font-semibold">Nombre</th>
    <th className="px-4 py-3 text-left font-semibold">Grado</th>
    <th className="px-4 py-3 text-left font-semibold">N° ID</th>
    <th className="px-4 py-3 text-left font-semibold">Categoría</th>
    <th className="px-4 py-3 text-left font-semibold">Observaciones</th>
    <th className="px-4 py-3 text-left font-semibold">Hora</th>
    <th className="px-4 py-3 text-center font-semibold">Acciones</th>
  </tr>
</thead>
        <tbody>
          {anotaciones.map((persona) => (
            <tr
              key={persona.id}
              className={`border-b hover:bg-gray-50 transition-colors ${
                persona.esDuplicado ? 'bg-yellow-50 border-l-4 border-orange-500' : ''
              }`}
            >
              <td className="px-4 py-3">
  {persona.nombre}
  {persona.esDuplicado && (
    <span className="ml-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
      DUPLICADO
    </span>
  )}
</td>
<td className="px-4 py-3 text-gray-600 font-medium">
  {persona.grado ? obtenerNombreGrado(persona.grado) : '-'}
</td>
<td className="px-4 py-3 text-gray-600">
  {persona.numeroId || '-'}
</td>
              <td className="px-4 py-3">
                <span className={`font-semibold ${getCategoriaColor(persona.categoria)}`}>
                  {getCategoriaTexto(persona.categoria)}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-600">
                {persona.observaciones || '-'}
              </td>
              <td className="px-4 py-3 text-gray-600">
                {formatearHora(persona.horaAnotacion)}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => handleEliminar(persona.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}