import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getProductById } from '@/lib/products';

interface CartItemInput {
  productId: string;
  quantity: number;
}

export async function POST(req: NextRequest) {
  try {
    const { items }: { items: CartItemInput[] } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 });
    }

    const lineItems = [];
    // Guardamos aquí lo que realmente se compró (id, cantidad, precio al momento
    // de la compra) para que el webhook pueda insertar order_items después.
    const purchasedItems: {
      productId: string;
      quantity: number;
      priceInCents: number;
    }[] = [];

    for (const item of items) {
      const product = await getProductById(item.productId);

      if (!product) {
        return NextResponse.json(
          { error: `Producto no encontrado: ${item.productId}` },
          { status: 400 }
        );
      }

      if (item.quantity <= 0) {
        return NextResponse.json(
          { error: `Cantidad inválida para ${product.name}` },
          { status: 400 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Sin stock suficiente de ${product.name}` },
          { status: 400 }
        );
      }

      lineItems.push({
        price_data: {
          currency: 'mxn',
          product_data: { name: product.name },
          unit_amount: product.priceInCents, // precio del servidor, no del cliente
        },
        quantity: item.quantity,
      });

      purchasedItems.push({
        productId: product.id,
        quantity: item.quantity,
        priceInCents: product.priceInCents,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
      // Stripe limita cada valor de metadata a 500 caracteres; para un carrito
      // muy grande convendría guardar esto en tu propia BD y solo pasar un id.
      metadata: {
        items: JSON.stringify(purchasedItems),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error al crear la sesión de Stripe:', error);
    return NextResponse.json(
      { error: 'No se pudo iniciar el pago. Intenta de nuevo.' },
      { status: 500 }
    );
  }
}
