import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';
import { getSupplierInfo } from '@/lib/products';
import { sendAdminOrderEmail, sendCustomerOrderEmail } from '@/lib/email';
import Stripe from 'stripe';

type PurchasedItem = { productId: string; quantity: number; priceInCents: number };

function formatAddress(address: Stripe.Address | null | undefined): string {
  if (!address) return 'Sin dirección';
  return [
    [address.line1, address.line2].filter(Boolean).join(', '),
    [address.postal_code, address.city].filter(Boolean).join(' '),
    [address.state, address.country].filter(Boolean).join(', '),
  ]
    .filter(Boolean)
    .join('\n');
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

        // Stripe puede reenviar el mismo evento: si el pedido ya existe, no se duplica.
        const { data: existing } = await supabaseAdmin
          .from('orders')
          .select('id')
          .eq('stripe_session_id', session.id)
          .maybeSingle();
        if (existing) {
          console.log('Pedido ya registrado, se ignora el reenvío:', session.id);
          break;
        }

        // Reconstruye qué se compró desde la metadata guardada al crear la sesión
        let purchasedItems: PurchasedItem[] = [];
        try {
          purchasedItems = JSON.parse(session.metadata?.items ?? '[]');
        } catch (parseErr) {
          console.error('No se pudo leer la metadata de items:', parseErr);
        }

        const shipping = session.shipping_details;
        const shippingName = shipping?.name ?? session.customer_details?.name ?? null;
        const shippingPhone = session.customer_details?.phone ?? null;
        const shippingAddress = shipping?.address ?? session.customer_details?.address ?? null;
        const customerEmail = session.customer_details?.email ?? null;

        const { data: order, error: orderError } = await supabaseAdmin
          .from('orders')
          .insert({
            stripe_session_id: session.id,
            customer_email: customerEmail,
            status: 'paid',
            total_in_cents: session.amount_total ?? 0,
            shipping_name: shippingName,
            shipping_phone: shippingPhone,
            shipping_address: shippingAddress,
          })
          .select('id')
          .single();

        if (orderError || !order) {
          console.error('Error guardando el pedido:', orderError);
          // 500 para que Stripe reintente más tarde
          return NextResponse.json({ error: 'No se guardó el pedido' }, { status: 500 });
        }

        if (purchasedItems.length > 0) {
          const { error: itemsError } = await supabaseAdmin.from('order_items').insert(
            purchasedItems.map((item) => ({
              order_id: order.id,
              product_id: item.productId,
              quantity: item.quantity,
              price_in_cents: item.priceInCents,
            }))
          );
          if (itemsError) console.error('Error guardando order_items:', itemsError);

          // Descuenta stock por cada producto vendido
          for (const item of purchasedItems) {
            const { error: stockError } = await supabaseAdmin.rpc('decrement_stock', {
              p_product_id: item.productId,
              p_quantity: item.quantity,
            });
            if (stockError) {
              console.error(`Error descontando stock de ${item.productId}:`, stockError);
            }
          }
        }

        // Nombres y datos de proveedor para el correo
        const suppliers = await getSupplierInfo(purchasedItems.map((i) => i.productId));
        const emailData = {
          orderId: order.id,
          customerEmail,
          totalInCents: session.amount_total ?? 0,
          shippingName,
          shippingPhone,
          shippingAddressText: formatAddress(shippingAddress),
          items: purchasedItems.map((item) => {
            const s = suppliers.find((p: any) => p.id === item.productId);
            return {
              name: s?.name ?? item.productId,
              quantity: item.quantity,
              priceInCents: item.priceInCents,
              supplier: s?.supplier,
              supplierSku: s?.supplier_sku,
              supplierUrl: s?.supplier_url,
              personalized: s?.personalized ?? false,
            };
          }),
        };

        await sendAdminOrderEmail(emailData);
        await sendCustomerOrderEmail(emailData);

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
