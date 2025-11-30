import Input from '../common/Input';
import Select from '../common/Select';
import Checkbox from '../common/Checkbox';
import { GRADOS_SUBOFICIALES } from '../../utils/grados';


export default function PersonaEntry({ 
  numero, 
  persona, 
  onChange, 
  onRemove, 
  puedeEliminar,
  almuerzoCerrado,
  cenaCerrada
}) {
  const opcionesCategorias = [
    { value: 'residente', label: 'Residente' },
    { value: 'coae', label: 'COAE (Turno Operador)' },
    { value: 'pago', label: 'Abona en el momento' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onChange({
      ...persona,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-indigo-500 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-indigo-600">
          Persona {numero}
        </h3>
        {puedeEliminar && (
          <button
            type="button"
            onClick={onRemove}
            className="text-red-500 hover:text-red-700 font-medium text-sm px-3 py-1 rounded hover:bg-red-50 transition-colors"
          >
            ✖ Eliminar
          </button>
        )}
      </div>

      <Input
        label="Nombre completo"
        type="text"
        name="nombre"
        value={persona.nombre}
        onChange={handleChange}
        placeholder="Ej: Juan Pérez"
        required={true}
      />

      <Input
        label="Número de identificación"
        type="text"
        name="numeroId"
        value={persona.numeroId}
        onChange={handleChange}
        placeholder="Ej: 12345"
        required={false}
      />

      <Select
        label="Categoría"
        name="categoria"
        value={persona.categoria}
        onChange={handleChange}
        options={opcionesCategorias}
        required={true}
      />
<Select
  label="Grado"
  name="grado"
  value={persona.grado}
  onChange={handleChange}
  options={GRADOS_SUBOFICIALES}
  required={true}
/>
      <div className="mb-5">
        <label className="block mb-3 text-sm font-medium text-gray-700">
          ¿A qué te querés anotar? <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-6">
          <Checkbox
            label="Almuerzo"
            name="almuerzo"
            checked={persona.almuerzo && !almuerzoCerrado}
            onChange={handleChange}
          />
          {almuerzoCerrado && (
            <span className="text-red-500 text-sm">(Cerrado)</span>
          )}
          
          <Checkbox
            label="Cena"
            name="cena"
            checked={persona.cena && !cenaCerrada}
            onChange={handleChange}
          />
          {cenaCerrada && (
            <span className="text-red-500 text-sm">(Cerrado)</span>
          )}
        </div>
      </div>

      <div className="mb-0">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Observaciones
        </label>
        <textarea
          name="observaciones"
          value={persona.observaciones}
          onChange={handleChange}
          rows="2"
          placeholder="Ej: Menú vegano, guardar para las 14hs"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all resize-none"
        />
      </div>
    </div>
  );
}