import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="container">
      <div className="redes-sociales">
        <a href="#" className="red-social" aria-label="Instagram">
          <i className="fab fa-instagram"></i>
        </a>
        <a href="#" className="red-social" aria-label="Twitter">
          <i className="fab fa-twitter"></i>
        </a>
        <a href="#" className="red-social" aria-label="Facebook">
          <i className="fab fa-facebook-f"></i>
        </a>
      </div>

      <div className="content">
        <div className="left-section">
          <h2 className="tagline">Tu Hogar<br />lejos de casa</h2>
          <Link href="/login">
            <button className="btn-ingresar">Ingresar</button>
          </Link>
        </div>

        <div className="right-section">
          <div className="logo-container">
            <Image
              src="/img/logo.png"
              alt="Logo Premier"
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}