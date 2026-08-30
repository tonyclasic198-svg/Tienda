'use client';

import { useState } from 'react';

interface CartItem {
  productId: string;
  name: string;
  priceInCents: number;
  quantity: number;
}

export default function CheckoutButton({ items }: { items: CartItem[] }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(({ productId, quantity }) => ({ productId, quantity })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error desconocido al procesar el pago');
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No se recibió la URL de pago de Stripe');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleCheckout}
        disabled={loading || items.length === 0}
        className="w-full rounded-lg bg-black py-3 text-white disabled:opacity-50"
      >
        {loading ? 'Procesando...' : 'Pagar ahora'}
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
