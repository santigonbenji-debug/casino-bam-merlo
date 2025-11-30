import { useState } from 'react';
import PersonaEntry from './PersonaEntry';
import Button from '../common/Button';
import { validarFormularioCompleto } from '../../utils/validations';
import { agregarAnotacion } from '../../services/anotacionesService';
import toast from 'react-hot-toast';
export default function FormularioAnotacion({ almuerzoCerrado, cenaCerrada, onSuccess }) {
  const [personas, setPersonas] = useState([
  {
    id: 1,
    nombre: '',
    numeroId: '',
    categoria: 'residente',
    grado: 'cabo', // ← AGREGAR ESTE CAMPO (valor por defecto)
    almuerzo: false,
    cena: false,
    observaciones: ''
  }
]);
  const [enviando, setEnviando] = useState(false);

 const agregarPersona = () => {
  setPersonas([
    ...personas,
    {
      id: Date.now(),
      nombre: '',
      numeroId: '',
      categoria: 'residente',
      grado: 'cabo', // ← AGREGAR ESTE CAMPO
      almuerzo: false,
      cena: false,
      observaciones: ''
    }
  ]);
};

  const eliminarPersona = (id) => {
    setPersonas(personas.filter(p => p.id !== id));
  };

  const actualizarPersona = (id, personaActualizada) => {
    setPersonas(personas.map(p => p.id === id ? personaActualizada : p));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar formulario
    const validacion = validarFormularioCompleto(personas);
    if (!validacion.valido) {
      toast.error(validacion.mensaje);
      return;
    }

    setEnviando(true);

    try {
      // Procesar cada persona
      for (const persona of personas) {
        // Determinar tipo de comida
        let tipoComida = null;
        if (persona.almuerzo && persona.cena) {
          tipoComida = 'ambos';
        } else if (persona.almuerzo) {
          tipoComida = 'almuerzo';
        } else if (persona.cena) {
          tipoComida = 'cena';
        }

        if (tipoComida) {
          await agregarAnotacion(persona, tipoComida);
        }
      }

      toast.success('¡Anotación exitosa!');
      
     setPersonas([
  {
    id: 1,
    nombre: '',
    numeroId: '',
    categoria: 'residente',
    grado: 'cabo', // ← AGREGAR ESTE CAMPO
    almuerzo: false,
    cena: false,
    observaciones: ''
  }
]);

      // Callback de éxito
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error al anotar:', error);
      toast.error('Error al guardar la anotación. Intenta de nuevo.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {personas.map((persona, index) => (
        <PersonaEntry
          key={persona.id}
          numero={index + 1}
          persona={persona}
          onChange={(personaActualizada) => actualizarPersona(persona.id, personaActualizada)}
          onRemove={() => eliminarPersona(persona.id)}
          puedeEliminar={personas.length > 1}
          almuerzoCerrado={almuerzoCerrado}
          cenaCerrada={cenaCerrada}
        />
      ))}

      <button
        type="button"
        onClick={agregarPersona}
        className="mb-4 bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
      >
        ➕ Agregar otra persona
      </button>

      <Button type="submit" variant="primary" disabled={enviando}>
        {enviando ? 'Enviando...' : '✅ Anotarme'}
      </Button>
    </form>
  );
}