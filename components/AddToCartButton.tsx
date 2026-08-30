'use client';

import { useCartStore } from '@/store/cart';
import { Product } from '@/types/product';

export default function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <button
      onClick={() => addItem(product)}
      className="rounded-lg bg-black px-6 py-3 text-white"
    >
      Agregar al carrito
    </button>
  );
}
