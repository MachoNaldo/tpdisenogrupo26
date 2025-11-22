'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    
    console.log('Formulario enviado:', { usuario, contrasena }); // Debug

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: usuario,
          contra: contrasena,
        }),
      });

      console.log('Respuesta:', response.status); // Debug

      if (response.ok) {
        router.push('/menu');
      } else {
        const result = await response.json();
        setError(result.error || 'Usuario o contraseña incorrectos');
        setShowPopup(true);
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      setError('Error de conexión con el servidor');
      setShowPopup(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'usuario') {
      setUsuario(value);
    } else if (name === 'contrasena') {
      setContrasena(value);
    }
    // Limpiar clase de error al escribir
    e.target.classList.remove('input-error');
  };

  return (
    <>
      <header className="header">
        <nav className="nav" aria-label="Navegación principal">
          <Link href="/">
            <button type="button" className="back-btn" aria-label="Regresar">
              &larr;
            </button>
          </Link>
        </nav>
      </header>
      
      <main className="main">
        <section className="login-card">
          <div className="logo-container">
            <Image 
              src="/img/Logotipo_2.png" 
              alt="Logotipo" 
              width={150}
              height={150}
              className="logo"
            />
          </div>
          
          <form onSubmit={handleSubmit} className="form">
            <label htmlFor="usuario" className="visually-hidden">Usuario</label>
            <input
              type="text"
              id="usuario"
              name="usuario"
              value={usuario}
              onChange={handleInputChange}
              placeholder="Usuario"
              required
              autoComplete="username"
            />
            
            <label htmlFor="contrasena" className="visually-hidden">Contraseña</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="contrasena"
                name="contrasena"
                value={contrasena}
                onChange={handleInputChange}
                placeholder="Contraseña"
                required
                autoComplete="current-password"
              />
              <span 
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: 'pointer' }}
                role="button"
                tabIndex={0}
              >
                {showPassword ? '🤓' : '🤫'}
              </span>
            </div>
            
            <button type="submit" className="btn">
              Verificar Usuario
            </button>
          </form>
        </section>
      </main>
      
      <footer className="footer"></footer>

      {/* POPUP DE ERROR */}
      {showPopup && (
        <div className="popup" style={{ display: 'flex' }}>
          <div className="popup-content">
            <p id="popup-message">{error}</p>
            <button onClick={() => setShowPopup(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </>
  );
}