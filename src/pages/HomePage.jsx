import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header.jsx';
import MenuDelDia from '../components/usuario/MenuDelDia.jsx';
import FormularioAnotacion from '../components/usuario/FormularioAnotacion.jsx';
import HorarioCerrado from '../components/usuario/HorarioCerrado.jsx';
import Loader from '../components/common/Loader.jsx';
import { obtenerConfiguracion } from '../services/configuracionService';
import { useHorario } from '../hooks/useHorario';
import { obtenerFechaParaAnotacion, formatearFechaLegible, esHorarioAnticipado } from '../utils/dateUtils';
export default function HomePage() {
  const [config, setConfig] = useState(null);
  const [cargando, setCargando] = useState(true);
const { almuerzoCerrado, cenaCerrada, esAnticipado } = useHorario(    
    
    
    config?.horaLimiteAlmuerzo,
    config?.horaLimiteCena
  );

  const cargarConfiguracion = async () => {
    try {
      setCargando(true);
      const data = await obtenerConfiguracion();
      setConfig(data);
    } catch (error) {
      console.error('Error al cargar configuración:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarConfiguracion();
  }, []);

  if (cargando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
          <Header />
          <Loader message="Cargando..." />
        </div>
      </div>
    );
  }

  const ambosHorariosCerrados = almuerzoCerrado && cenaCerrada;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
        <Header />

        <MenuDelDia
          menuAlmuerzo={config?.menuAlmuerzo}
          menuCena={config?.menuCena}
          costo={config?.costoPlato}
        />


        {/* Mensaje de horario anticipado */}
{esAnticipado && (
  <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg mb-6">
    <div className="flex items-center gap-2 mb-2">
      <span className="text-2xl">🌙</span>
      <h3 className="text-lg font-bold text-green-800">
        Anotación Anticipada Activa
      </h3>
    </div>
    <p className="text-green-700 font-medium">
      Te estás anotando para el día: <span className="font-bold">
        {formatearFechaLegible(obtenerFechaParaAnotacion())}
      </span>
    </p>
    <p className="text-sm text-green-600 mt-2">
      Después de las 22:00 hs podés anotarte para el día siguiente
    </p>
  </div>
)}

        {ambosHorariosCerrados ? (
          <>
            <HorarioCerrado tipo="almuerzo" />
            <div className="text-center mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600 mb-2">Horarios de anotación:</p>
              <p className="text-indigo-600 font-bold">
                Almuerzo: hasta 10:00 AM | Cena: hasta 16:00 hs
              </p>
            </div>
          </>
        ) : (
          <>
            {almuerzoCerrado && <HorarioCerrado tipo="almuerzo" />}
            {cenaCerrada && <HorarioCerrado tipo="cena" />}
            
            <FormularioAnotacion
              almuerzoCerrado={almuerzoCerrado}
              cenaCerrada={cenaCerrada}
              onSuccess={() => {
                // Opcional: recargar algo si es necesario
              }}
            />
          </>
        )}

        <div className="text-center mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            ¿Sos del turno casino?{' '}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium">
              Ingresar aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}