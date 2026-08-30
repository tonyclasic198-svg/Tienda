import Link from 'next/link';

const COLLECTIONS = [
  {
    slug: 'mascotas',
    emoji: '🐾',
    title: 'Mascotas',
    copy: 'Accesorios pensados para paseos, no solo para fotos. Arneses, collares y más — cómodos, resistentes, con la talla correcta.',
  },
  {
    slug: 'skincare',
    emoji: '✨',
    title: 'Skincare',
    copy: 'Rituales simples que sí se notan. Sérums y mascarillas para una rutina que se vuelve costumbre.',
  },
  {
    slug: 'arte-impreso',
    emoji: '🎨',
    title: 'Arte Impreso',
    copy: 'Pósters y piezas impresas bajo demanda para quienes coleccionan lo que aman — música, arte, cultura.',
  },
];

export default function HomePage() {
  return (
    <div>
      <div className="mx-auto max-w-2xl p-8 text-center">
        <h1 className="text-3xl font-bold">
          Cosas que se disfrutan, no solo se compran
        </h1>
        <p className="mt-2 text-gray-600">
          Tres colecciones curadas para tu mascota, tu piel y tus paredes.
          Calidad que se nota, entrega que no te hace esperar.
        </p>
      </div>

      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 p-8 sm:grid-cols-3">
        {COLLECTIONS.map((c) => (
          <Link
            key={c.slug}
            href={`/colecciones/${c.slug}`}
            className="block rounded-lg border p-6 text-center transition hover:shadow-md"
          >
            <div className="text-3xl">{c.emoji}</div>
            <h2 className="mt-2 font-semibold">{c.title}</h2>
            <p className="mt-2 text-sm text-gray-600">{c.copy}</p>
            <span className="mt-4 inline-block text-sm underline">
              Ver colección →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
