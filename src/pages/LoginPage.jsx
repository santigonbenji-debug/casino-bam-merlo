import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import Header from '../components/layout/Header';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const { login } = useAuthContext();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!password) {
      toast.error('Por favor ingresá la contraseña');
      return;
    }

    setCargando(true);

    try {
      const resultado = await login(password);
      
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

          <Input
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required={true}
          />

          <Button type="submit" variant="primary" disabled={cargando}>
            {cargando ? 'Ingresando...' : '🔓 Ingresar'}
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
      </div>
    </div>
  );
}