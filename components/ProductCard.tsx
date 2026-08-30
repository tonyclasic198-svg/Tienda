import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/product';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/productos/${product.slug}`}
      className="block rounded-lg border p-4 transition hover:shadow-md"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-md bg-gray-100">
        <Image
          src={product.imageUrl || '/images/placeholder.jpg'}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      <h3 className="mt-3 font-medium">{product.name}</h3>
      <p className="text-sm text-gray-600">
        ${(product.priceInCents / 100).toFixed(2)} MXN
      </p>
    </Link>
  );
}
