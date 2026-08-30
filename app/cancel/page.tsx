import Link from 'next/link';

export default function CancelPage() {
  return (
    <div className="mx-auto max-w-xl p-8 text-center">
      <h1 className="text-2xl font-semibold">Pago cancelado</h1>
      <p className="mt-2 text-gray-600">
        No se realizó ningún cargo. Puedes volver a intentarlo cuando quieras.
      </p>
      <Link href="/carrito" className="mt-4 inline-block underline">
        Volver al carrito
      </Link>
    </div>
  );
}
