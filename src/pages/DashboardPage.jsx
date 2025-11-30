import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { useAnotaciones } from '../hooks/useAnotaciones';
import Header from '../components/layout/Header';
import PanelConfiguracion from '../components/casino/PanelConfiguracion';
import PanelListas from '../components/casino/PanelListas';
import PanelHistorial from '../components/casino/PanelHistorial';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const [tabActiva, setTabActiva] = useState('config');
  const { logout } = useAuthContext();
  const navigate = useNavigate();
  const { anotaciones, cargando, recargar } = useAnotaciones();

  const handleLogout = async () => {
    const resultado = await logout();
    if (resultado.success) {
      toast.success('Sesión cerrada');
      navigate('/');
    } else {
      toast.error('Error al cerrar sesión');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
        <Header 
          title="Panel Turno Casino"
          subtitle="Casino de Suboficiales BAM MERLO"
        />

        {/* Tabs de navegación */}
        <div className="flex gap-4 mb-8 border-b-2 border-gray-200 overflow-x-auto">
          <button
            onClick={() => setTabActiva('config')}
            className={`pb-3 px-6 font-semibold whitespace-nowrap transition-colors ${
              tabActiva === 'config'
                ? 'text-indigo-600 border-b-4 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            ⚙️ Configuración
          </button>
          <button
            onClick={() => setTabActiva('listas')}
            className={`pb-3 px-6 font-semibold whitespace-nowrap transition-colors ${
              tabActiva === 'listas'
                ? 'text-indigo-600 border-b-4 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            📋 Listas del Día
          </button>
          <button
            onClick={() => setTabActiva('historial')}
            className={`pb-3 px-6 font-semibold whitespace-nowrap transition-colors ${
              tabActiva === 'historial'
                ? 'text-indigo-600 border-b-4 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            📊 Historial
          </button>
        </div>

        {/* Contenido de tabs */}
        <div className="mb-6">
          {tabActiva === 'config' && <PanelConfiguracion />}
          
          {tabActiva === 'listas' && (
            cargando ? (
              <Loader message="Cargando listas..." />
            ) : (
              <PanelListas anotaciones={anotaciones} onRecargar={recargar} />
            )
          )}
          
          {tabActiva === 'historial' && <PanelHistorial />}
        </div>

        {/* Botón cerrar sesión */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <Button variant="secondary" onClick={handleLogout}>
            ← Cerrar Sesión
          </Button>
        </div>
      </div>
    </div>
  );
}