import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';
import Stripe from 'stripe';
async function sendOrderNotification(orderData: {
  customerEmail: string;
  totalInCents: number;
  items: { productId: string; quantity: number; priceInCents: number }[];
}) {
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Mi Tienda <onboarding@resend.dev>',
        to: 'tonyclasic198@gmail.com',
        subject: 'Nuevo pedido recibido',
        html: `
          <h2>¡Nuevo pedido!</h2>
          <p><strong>Cliente:</strong> ${orderData.customerEmail}</p>
          <p><strong>Total:</strong> $${(orderData.totalInCents / 100).toFixed(2)} MXN</p>
          <h3>Productos:</h3>
          <ul>
            ${orderData.items.map(item => `<li>Producto: ${item.productId} — Cantidad: ${item.quantity} — Precio: $${(item.priceInCents / 100).toFixed(2)}</li>`).join('')}
          </ul>
        `,
      }),
    });
  } catch (err) {
    console.error('Error enviando notificación de pedido:', err);
  }
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Falta la firma de Stripe' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Firma de webhook inválida:', err);
    return NextResponse.json(
      { error: 'Firma inválida — la petición no viene de Stripe' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        // Reconstruye qué se compró desde la metadata guardada al crear la sesión
        let purchasedItems: {
          productId: string;
          quantity: number;
          priceInCents: number;
        }[] = [];

        try {
          purchasedItems = JSON.parse(session.metadata?.items ?? '[]');
        } catch (parseErr) {
          console.error('No se pudo leer la metadata de items:', parseErr);
        }

        const { data: order, error: orderError } = await supabaseAdmin
          .from('orders')
          .insert({
            stripe_session_id: session.id,
            customer_email: session.customer_details?.email,
            status: 'paid',
            total_in_cents: session.amount_total ?? 0,
          })
          .select('id')
          .single();

        if (orderError || !order) {
          console.error('Error guardando el pedido:', orderError);
          break;
        }

        if (purchasedItems.length > 0) {
          const { error: itemsError } = await supabaseAdmin
            .from('order_items')
            .insert(
              purchasedItems.map((item) => ({
                order_id: order.id,
                product_id: item.productId,
                quantity: item.quantity,
                price_in_cents: item.priceInCents,
              }))
            );

          if (itemsError) {
            console.error('Error guardando order_items:', itemsError);
          }

          // Descuenta stock por cada producto vendido
          for (const item of purchasedItems) {
            const { error: stockError } = await supabaseAdmin.rpc(
              'decrement_stock',
              { p_product_id: item.productId, p_quantity: item.quantity }
            );
            if (stockError) {
              console.error(
                `Error descontando stock de ${item.productId}:`,
                stockError
              );
            }
          }
        }

              await sendOrderNotification({
        customerEmail: session.customer_details?.email ?? 'Sin correo',
        totalInCents: session.amount_total ?? 0,
        items: purchasedItems,
      });
        console.log('Pago confirmado:', session.id, purchasedItems.length, 'items');
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Sesión expirada sin pago:', session.id);
        break;
      }

      case 'payment_intent.payment_failed': {
        const intent = event.data.object as Stripe.PaymentIntent;
        console.error('Pago falló:', intent.id, intent.last_payment_error?.message);
        break;
      }

      default:
        console.log(`Evento no manejado: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Error procesando el webhook:', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
