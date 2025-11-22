'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarContra, setmostrarContra] = useState(false);
  const [error, setError] = useState('');
  const [mostrarPopup, setmostrarPopup] = useState(false);
  const [tieneError, settieneError] = useState(false); 

  const loguearse = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    settieneError(false); 
    

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


      if (response.ok) {
        router.push('/menu');
      } else {
        const result = await response.json();
        setError(result.error || 'Usuario o contraseña incorrectos');
        setmostrarPopup(true);
        settieneError(true);
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      setError('Error de conexión con el servidor');
      setmostrarPopup(true);
      settieneError(true);
    }
  };

  const cambiarColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'usuario') {
      setUsuario(value);
    } else if (name === 'contrasena') {
      setContrasena(value);
    }
    settieneError(false);
  };

  return (
    <>
      <header className="header">
        <nav className="nav" aria-label="Pagina inicial">
          <Link href="/">
            <button type="button" className="back-btn" aria-label="Regresar">
              &larr;
            </button>
          </Link>
        </nav>
      </header>
      
      <main className="main">
        <section className="login-card">
          <div className="login-logo-container">
            <Image 
              src="/img/Logotipo_2.png" 
              alt="Logotipo" 
              width={150}
              height={150}
              className="logo"
            />
            <h1 className="brand-title">PREMIER</h1>
          </div>
          
          <form onSubmit={loguearse} className="form">
            <label htmlFor="usuario" className="visually-hidden">Usuario</label>
            <input
              type="text"
              id="usuario"
              name="usuario"
              value={usuario}
              onChange={cambiarColor}
              placeholder="Usuario"
              required
              autoComplete="username"
              className={tieneError ? 'input-error' : ''}
            />
            
            <label htmlFor="contrasena" className="visually-hidden">Contraseña</label>
            <div className="password-wrapper">
              <input
                type={mostrarContra ? 'text' : 'password'}
                id="contrasena"
                name="contrasena"
                value={contrasena}
                onChange={cambiarColor}
                placeholder="Contraseña"
                required
                autoComplete="current-password"
                className={tieneError ? 'input-error' : ''}
              />
              <span 
                className="eye-icon"
                onClick={() => setmostrarContra(!mostrarContra)}
                style={{ cursor: 'pointer' }}
                role="button"
                tabIndex={0}
              >
                {mostrarContra ? '🤓' : '🤫'}
              </span>
            </div>
            
            <button type="submit" className="btn">
              Verificar Usuario
            </button>
          </form>
        </section>
      </main>
      
      <footer className="footer"></footer>

      {mostrarPopup && (
        <div className="popup" style={{ display: 'flex' }}>
          <div className="popup-content">
            <p id="popup-message">{error}</p>
            <button onClick={() => setmostrarPopup(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </>
  );
}