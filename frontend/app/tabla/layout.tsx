import type { Metadata } from "next";
import "./tabla.css";

export const metadata: Metadata = {
  title: "Reservar habitación",
  description: "Sistema de reserva hotelera",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
