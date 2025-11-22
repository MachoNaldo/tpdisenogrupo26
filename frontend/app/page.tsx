import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="container">
      <div className="redes-sociales">
        <a href="#" className="red-social">📘</a>
        <a href="#" className="red-social">📷</a>
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