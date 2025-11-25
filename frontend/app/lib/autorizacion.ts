'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const router = useRouter();
  const [autenticado, setAutenticado] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/revisar-sesion`, {
        credentials: 'include',
      });

      if (response.ok) {
        setAutenticado(true);
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Error:', error);
      router.push('/login');
    } finally {
      setCargando(false);
    }
  };

  return { autenticado, cargando };
}