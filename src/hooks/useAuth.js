import { useState, useEffect } from 'react';
import { observarAutenticacion } from '../services/authService';

/**
 * Hook para manejar el estado de autenticación
 */
export const useAuth = () => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const unsubscribe = observarAutenticacion((user) => {
      setUsuario(user);
      setCargando(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    usuario,
    cargando,
    estaAutenticado: !!usuario
  };
};