import Link from "next/link";
import "./inicio.css";

export default function Inicio() {
  return (
    <div className="inicio-background">

      <div className="social-icons">
        
        <a
          href="https://www.instagram.com/utnsantafe/"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon"
          aria-label="Instagram"
        >
          <i className="fab fa-instagram"></i>
        </a>


        <a
          href="https://x.com/UTNSantaFe"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon"
          aria-label="Twitter"
        >
          <i className="fab fa-twitter"></i>
        </a>

        <a
          href="https://www.facebook.com/UTNSantaFe?locale=es_LA"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon"
          aria-label="Facebook"
        >
          <i className="fab fa-facebook-f"></i>
        </a>

      </div>


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
