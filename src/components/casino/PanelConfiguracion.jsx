import { useState, useEffect } from 'react';
import { obtenerConfiguracion, actualizarConfiguracion } from '../../services/configuracionService';
import { agregarAnotacion } from '../../services/anotacionesService';
import Input from '../common/Input';
import Select from '../common/Select';
import Checkbox from '../common/Checkbox';
import Button from '../common/Button';
import toast from 'react-hot-toast';
import { GRADOS_SUBOFICIALES } from '../../utils/grados';
import { obtenerFechaParaAnotacion } from '../../utils/dateUtils';

export default function PanelConfiguracion() {
  const [config, setConfig] = useState({
    menuAlmuerzo: '',
    menuCena: '',
    costoPlato: 2500
  });
  
  const [personaManual, setPersonaManual] = useState({
  nombre: '',
  numeroId: '',
  categoria: 'residente',
  grado: 'cabo', // ← AGREGAR ESTE CAMPO
  almuerzo: false,
  cena: false,
  observaciones: ''
});

  const [guardando, setGuardando] = useState(false);
  const [agregando, setAgregando] = useState(false);

  useEffect(() => {
    cargarConfiguracion();
  }, []);

  const cargarConfiguracion = async () => {
    try {
      const data = await obtenerConfiguracion();
      setConfig(data);
    } catch (error) {
      console.error('Error al cargar configuración:', error);
      toast.error('Error al cargar la configuración');
    }
  };

  const handleGuardarConfig = async (e) => {
    e.preventDefault();
    setGuardando(true);

    try {
      await actualizarConfiguracion(config);
      toast.success('Configuración guardada correctamente');
    } catch (error) {
      console.error('Error al guardar:', error);
      toast.error('Error al guardar la configuración');
    } finally {
      setGuardando(false);
    }
  };

 const handleAgregarManual = async (e) => {
  e.preventDefault();

  if (!personaManual.nombre) {
    toast.error('El nombre es obligatorio');
    return;
  }

  if (!personaManual.almuerzo && !personaManual.cena) {
    toast.error('Debes seleccionar al menos almuerzo o cena');
    return;
  }

  setAgregando(true);

  try {
    // PRIMERO: Determinar tipo de comida
    let tipoComida = null;
    if (personaManual.almuerzo && personaManual.cena) {
      tipoComida = 'ambos';
    } else if (personaManual.almuerzo) {
      tipoComida = 'almuerzo';
    } else if (personaManual.cena) {
      tipoComida = 'cena';
    }

    // SEGUNDO: Agregar la anotación
   const fechaAnotacion = obtenerFechaParaAnotacion();
await agregarAnotacion(personaManual, tipoComida, fechaAnotacion);
    toast.success('Persona agregada correctamente');
    
    // TERCERO: Limpiar formulario
    setPersonaManual({
  nombre: '',
  numeroId: '',
  categoria: 'residente',
  grado: 'cabo', // ← AGREGAR ESTE CAMPO
  almuerzo: false,
  cena: false,
  observaciones: ''
});

    // CUARTO: Recargar la página después de 1 segundo
    setTimeout(() => {
      window.location.reload();
    }, 1000);

  } catch (error) {
    console.error('Error al agregar:', error);
    toast.error('Error al agregar la persona');
  } finally {
    setAgregando(false);
  }
};

  const opcionesCategorias = [
    { value: 'residente', label: 'Residente' },
    { value: 'coae', label: 'COAE' },
    { value: 'pago', label: 'Abona en el momento' }
  ];

  return (
    <div className="space-y-8">
      {/* Configuración del Día */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Configuración del Día
        </h2>
        
        <form onSubmit={handleGuardarConfig}>
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Menú del Almuerzo
            </label>
            <textarea
              value={config.menuAlmuerzo}
              onChange={(e) => setConfig({ ...config, menuAlmuerzo: e.target.value })}
              rows="2"
              placeholder="Ej: Milanesas con puré | Ensalada mixta | Fruta"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all resize-none"
            />
          </div>

          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Menú de la Cena
            </label>
            <textarea
              value={config.menuCena}
              onChange={(e) => setConfig({ ...config, menuCena: e.target.value })}
              rows="2"
              placeholder="Ej: Guiso de lentejas | Pan | Postre"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all resize-none"
            />
          </div>

          <Input
            label="Costo del Racionamiento (por plato)"
            type="number"
            value={config.costoPlato}
            onChange={(e) => setConfig({ ...config, costoPlato: parseInt(e.target.value) })}
            placeholder="2500"
          />

          <Button type="submit" variant="primary" disabled={guardando}>
            {guardando ? 'Guardando...' : '💾 Guardar Configuración'}
          </Button>
        </form>
      </div>

      <hr className="border-t-2 border-gray-200" />

      {/* Anotación Manual */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Anotación Manual
        </h2>
        <p className="text-gray-600 mb-4">
          Para personas que llamen por teléfono
        </p>

        <form onSubmit={handleAgregarManual}>
          <Input
            label="Nombre completo"
            type="text"
            value={personaManual.nombre}
            onChange={(e) => setPersonaManual({ ...personaManual, nombre: e.target.value })}
            placeholder="Nombre de la persona"
            required={true}
          />

          <Input
            label="Número de identificación"
            type="text"
            value={personaManual.numeroId}
            onChange={(e) => setPersonaManual({ ...personaManual, numeroId: e.target.value })}
            placeholder="Opcional"
          />

          <Select
            label="Categoría"
            value={personaManual.categoria}
            onChange={(e) => setPersonaManual({ ...personaManual, categoria: e.target.value })}
            options={opcionesCategorias}
          />
<Select
  label="Grado"
  value={personaManual.grado}
  onChange={(e) => setPersonaManual({ ...personaManual, grado: e.target.value })}
  options={GRADOS_SUBOFICIALES}
  required={true}
/>
          <div className="mb-5">
            <label className="block mb-3 text-sm font-medium text-gray-700">
              Seleccionar comida
            </label>
            <div className="flex gap-6">
              <Checkbox
                label="Almuerzo"
                checked={personaManual.almuerzo}
                onChange={(e) => setPersonaManual({ ...personaManual, almuerzo: e.target.checked })}
              />
              <Checkbox
                label="Cena"
                checked={personaManual.cena}
                onChange={(e) => setPersonaManual({ ...personaManual, cena: e.target.checked })}
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Observaciones
            </label>
            <textarea
              value={personaManual.observaciones}
              onChange={(e) => setPersonaManual({ ...personaManual, observaciones: e.target.value })}
              rows="2"
              placeholder="Opcional"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all resize-none"
            />
          </div>

          <Button type="submit" variant="primary" disabled={agregando}>
            {agregando ? 'Agregando...' : '➕ Agregar Persona'}
          </Button>
        </form>
      </div>
    </div>
  );
}