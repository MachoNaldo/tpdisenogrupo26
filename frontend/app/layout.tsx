import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Hotel Premier",
  description: "Sistema de gestión hotelera",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}