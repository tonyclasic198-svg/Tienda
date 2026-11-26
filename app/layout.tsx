import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Mi Tienda',
  description: 'Tienda en línea construida con Next.js, Stripe y Supabase',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <header className="flex items-center justify-between border-b p-4">
          <Link href="/" className="font-semibold">Mi Tienda</Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/colecciones/mascotas">Mascotas</Link>
            <Link href="/colecciones/skincare">Skincare</Link>
            <Link href="/colecciones/arte-impreso">Arte Impreso</Link>
            <Link href="/carrito">Carrito</Link>
          </nav>
        </header>
        {children}
        <footer className="mt-16 border-t p-6 text-center text-xs text-gray-500">
          <nav className="flex justify-center gap-4">
            <Link href="/envios-y-devoluciones">Envíos y devoluciones</Link>
            <Link href="/aviso-de-privacidad">Aviso de privacidad</Link>
            <a href="mailto:tonyclasic198@gmail.com">Contacto</a>
          </nav>
          <p className="mt-2">Pagos seguros procesados por Stripe.</p>
        </footer>
      </body>
    </html>
  );
}
