import { getProductBySlug } from '@/lib/products';
import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/AddToCartButton';

export default async function ProductoPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);

  if (!product) notFound();

  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-semibold">{product.name}</h1>
      <p className="mt-2 text-gray-600">{product.description}</p>
      <p className="mt-4 text-xl font-bold">
        ${(product.priceInCents / 100).toFixed(2)} MXN
      </p>
      <div className="mt-6">
        <AddToCartButton product={product} />
      </div>
    </div>
  );
}
