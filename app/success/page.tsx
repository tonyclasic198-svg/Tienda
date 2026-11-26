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
      <p className="mt-4 text-sm text-gray-600">
        ¿Compraste un producto personalizado? Envíanos la foto por{' '}
        <a href="https://wa.me/524921343230" target="_blank" rel="noopener noreferrer" className="underline">
          WhatsApp (492 134 3230)
        </a>{' '}
        junto con el correo de tu compra.
      </p>
    </div>
  );
}
