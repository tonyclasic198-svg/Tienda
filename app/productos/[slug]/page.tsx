import Image from 'next/image';
import { getProductBySlug } from '@/lib/products';
import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/AddToCartButton';

// Vuelve a leer el catálogo de Supabase cada 60 segundos: los productos
// nuevos u ocultos se reflejan sin tener que volver a desplegar.
export const revalidate = 60;

export default async function ProductoPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);

  if (!product) notFound();

  const agotado = product.stock <= 0;

  return (
    <div className="mx-auto grid max-w-4xl gap-8 p-8 sm:grid-cols-2">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={product.imageUrl || '/images/placeholder.jpg'}
          alt={product.name}
          fill
          sizes="(min-width: 640px) 50vw, 100vw"
          className="object-cover"
          priority
        />
      </div>
      <div>
        <h1 className="text-2xl font-semibold">{product.name}</h1>
        <p className="mt-4 text-xl font-bold">
          ${(product.priceInCents / 100).toFixed(2)} MXN
        </p>
        <p className="mt-4 text-gray-600">{product.description}</p>
        <div className="mt-6">
          {agotado ? (
            <p className="font-medium text-red-600">Agotado por ahora</p>
          ) : (
            <AddToCartButton product={product} />
          )}
        </div>
        <p className="mt-6 text-sm text-gray-500">
          Envío a todo México. Tiempo estimado de entrega: 7 a 20 días hábiles.{' '}
          <a href="/envios-y-devoluciones" className="underline">
            Envíos y devoluciones
          </a>
        </p>
      </div>
    </div>
  );
}
