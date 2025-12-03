'use client';

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import "./login.css"; 

export default function Login() {
  const router = useRouter();

  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mostrarContra, setMostrarContra] = useState(false);
  const [error, setError] = useState("");
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [tieneError, setTieneError] = useState(false);

  const loguearse = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setTieneError(false);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: usuario,
          contra: contrasena,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/menu");
      } else {
        setError(data.error || "Usuario o contraseña incorrectos");
        setMostrarPopup(true);
        setTieneError(true);
      }
    } catch (error) {
      setError("Error de conexión con el servidor");
      setMostrarPopup(true);
      setTieneError(true);
    }
  };

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "usuario") setUsuario(e.target.value);
    if (e.target.name === "contrasena") setContrasena(e.target.value);

    setTieneError(false);
  };

  return (

    
    <div className="login-background">
      <div className="absolute inset-0 bg-[url('/img/Fondo6.png')] bg-left bg-contain bg-no-repeat opacity-40 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('/img/Fondo7.png')] bg-right bg-contain bg-no-repeat opacity-40 pointer-events-none"></div>

      {/* Flecha fuera del panel */}
      <Link href="/inicio">
        <button type="button" className="back-btn">←</button>
      </Link>


      
      {/* TARJETA DE LOGIN */}
      <div className="login-card">

        {/* LOGO + TITULO */}
        <div className="login-logo-container">
          <Image 
            src="/img/Logotipo3.png" alt="Logotipo" width={140} height={140} className="opacity-50"/>
          <h1 className="brand-title font-serif text-[#b18b45] opacity-50">PREMIER</h1>
        </div>

        {tieneError && (
          <div className="error-box">
            <div className="error-icon">
              <Image src="img/iconoError.svg" alt="icono" width={40} height={40} />
            </div>
            <p className="error-text">
              Error al verificar el usuario.<br />
              El usuario o la contraseña son inválidos.
            </p>
          </div>
        )}


        {/* FORMULARIO */}
        <form onSubmit={loguearse} className="form">

          <input type="text" name="usuario" placeholder="Usuario" value={usuario}
            onChange={manejarCambio} required autoComplete="username" className={tieneError ? "input-error" : ""}/>

          <div className="password-wrapper">
            <input type={mostrarContra ? "text" : "password"} name="contrasena" placeholder="Contraseña" value={contrasena}
             onChange={manejarCambio} required autoComplete="current-password" className={tieneError ? "input-error" : ""}/>

            <span className="eye-icon cursor-pointer" onClick={() => setMostrarContra(!mostrarContra)}>
               <Image src="/img/iconoOjo.svg" alt="icono" width={40} height={40} />
            </span>
          </div>

          <button type="submit" className="btn px-8 py-3 rounded-2xl text-xl 
          font-bold shadow bg-[#a67c52] hover:bg-[#c39a4f] font-serif">Verificar Usuario</button>
        </form>

      </div>

    </div>
  );
}
