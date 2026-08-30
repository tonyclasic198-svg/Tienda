'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/store/cart';

export default function SuccessPage() {
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="mx-auto max-w-xl p-8 text-center">
      <h1 className="text-2xl font-semibold">¡Gracias por tu compra!</h1>
      <p className="mt-2 text-gray-600">
        Tu pago se procesó correctamente. Te enviaremos un correo con los detalles.
      </p>
    </div>
  );
}
