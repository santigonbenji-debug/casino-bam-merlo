import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import Header from '../components/layout/Header';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [pin, setPin] = useState('');
  const [cargando, setCargando] = useState(false);
  const { login } = useAuthContext();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!pin) {
      toast.error('Por favor ingresá el PIN del día');
      return;
    }

    if (pin.length !== 6) {
      toast.error('El PIN debe tener 6 dígitos');
      return;
    }

    setCargando(true);

    try {
      const resultado = await login(pin);
      
      if (resultado.success) {
        toast.success('¡Bienvenido!');
        navigate('/dashboard');
      } else {
        toast.error(resultado.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      toast.error('Error al iniciar sesión');
    } finally {
      setCargando(false);
    }
  };

  const handlePinChange = (e) => {
    // Solo permitir números
    const valor = e.target.value.replace(/\D/g, '');
    // Limitar a 6 dígitos
    if (valor.length <= 6) {
      setPin(valor);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-8 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <Header 
          title="Acceso Turno Casino"
          subtitle="Panel de administración"
        />

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Usuario
            </label>
            <input
              type="text"
              value="turnocasino"
              disabled
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-100 text-gray-600"
            />
          </div>

          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              PIN del Día
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={pin}
              onChange={handlePinChange}
              placeholder="000000"
              className="w-full px-4 py-3 border-2 border-indigo-200 rounded-lg focus:outline-none focus:border-indigo-500 text-center text-2xl font-mono tracking-widest"
              maxLength={6}
              autoComplete="off"
            />
            <p className="mt-2 text-xs text-gray-500 text-center">
              Ingresá el PIN de 6 dígitos del día
            </p>
          </div>

          <Button type="submit" variant="primary" disabled={cargando || pin.length !== 6}>
            {cargando ? 'Ingresando...' : '🔐 Ingresar'}
          </Button>

          <Button 
            type="button" 
            variant="secondary" 
            onClick={() => navigate('/')}
            className="mt-3"
          >
            ← Volver
          </Button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-800 text-center">
            💡 El PIN cambia automáticamente todos los días a las 7:00 AM
          </p>
        </div>
      </div>
    </div>
  );
}
