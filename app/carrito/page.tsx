'use client';

import { useCartStore } from '@/store/cart';
import CheckoutButton from '@/components/CheckoutButton';
import Link from 'next/link';

export default function CarritoPage() {
  const { items, removeItem } = useCartStore();

  const total = items.reduce(
    (sum, item) => sum + item.priceInCents * item.quantity,
    0
  );

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl p-8 text-center">
        <p className="text-gray-600">Tu carrito está vacío.</p>
        <Link href="/productos" className="mt-4 inline-block underline">
          Ver productos
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-semibold">Tu carrito</h1>

      <div className="mt-6 divide-y">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center justify-between py-4">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-600">
                {item.quantity} × ${(item.priceInCents / 100).toFixed(2)} MXN
              </p>
            </div>
            <button
              onClick={() => removeItem(item.productId)}
              className="text-sm text-red-600 hover:underline"
            >
              Quitar
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between border-t pt-4">
        <span className="text-lg font-semibold">Total</span>
        <span className="text-lg font-semibold">
          ${(total / 100).toFixed(2)} MXN
        </span>
      </div>

      <div className="mt-6">
        <CheckoutButton items={items} />
      </div>
    </div>
  );
}
