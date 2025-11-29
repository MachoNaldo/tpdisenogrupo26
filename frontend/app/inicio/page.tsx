import Link from "next/link";
import "./inicio.css";

export default function Inicio() {
  return (
    <div className="inicio-background">

        
      {/* Redes sociales */}
      <div className="social-icons">
        <a href="#" className="social-icon" aria-label="Instagram">
          <i className="fab fa-instagram"></i>
        </a>
        <a href="#" className="social-icon" aria-label="Twitter">
          <i className="fab fa-twitter"></i>
        </a>
        <a href="#" className="social-icon" aria-label="Facebook">
          <i className="fab fa-facebook-f"></i>
        </a>
      </div>

      {/* Contenido */}
      <div className="container">

        <div className="left-section">
          <h1 className="tagline">"Tu hogar<br />lejos de casa"</h1>

          <Link href="/login">
            <button className="btn-ingresar">Ingresar</button>
          </Link>
        </div>

      </div>
    </div>
  );
}
