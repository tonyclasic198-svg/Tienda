// Envío de correos con Resend (https://resend.com).
// - El aviso de pedido nuevo te llega a ti (ADMIN_EMAIL).
// - La confirmación al cliente solo se envía si configuras RESEND_FROM con un
//   dominio verificado en Resend; con la dirección de prueba onboarding@resend.dev
//   Resend solo permite enviar a tu propio correo.

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'tonyclasic198@gmail.com';
const FROM_DEFAULT = 'Mi Tienda <onboarding@resend.dev>';

export function escapeHtml(text: string | null | undefined): string {
  return (text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function send(to: string, subject: string, html: string, from: string) {
  if (!process.env.RESEND_API_KEY) {
    console.error('Falta RESEND_API_KEY: no se envió el correo', subject);
    return;
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to, subject, html }),
    });
    if (!res.ok) {
      console.error('Resend rechazó el correo:', res.status, await res.text());
    }
  } catch (err) {
    console.error('Error enviando correo:', err);
  }
}

export interface OrderEmailItem {
  name: string;
  quantity: number;
  priceInCents: number;
  supplier?: string | null;
  supplierSku?: string | null;
  supplierUrl?: string | null;
}

export interface OrderEmailData {
  orderId: string;
  customerEmail: string | null;
  totalInCents: number;
  shippingName: string | null;
  shippingPhone: string | null;
  shippingAddressText: string;
  items: OrderEmailItem[];
}

const money = (cents: number) => `$${(cents / 100).toFixed(2)} MXN`;

export async function sendAdminOrderEmail(o: OrderEmailData) {
  const rows = o.items
    .map(
      (i) => `<li><strong>${escapeHtml(i.name)}</strong> × ${i.quantity} — ${money(i.priceInCents)}<br/>
      Proveedor: ${escapeHtml(i.supplier) || 'sin asignar'}
      ${i.supplierSku ? ` · SKU: ${escapeHtml(i.supplierSku)}` : ''}
      ${i.supplierUrl ? ` · <a href="${escapeHtml(i.supplierUrl)}">ver en proveedor</a>` : ''}</li>`
    )
    .join('');

  const html = `
    <h2>¡Nuevo pedido pagado!</h2>
    <p><strong>Pedido:</strong> ${escapeHtml(o.orderId)}</p>
    <p><strong>Total cobrado:</strong> ${money(o.totalInCents)}</p>
    <h3>Productos</h3><ul>${rows}</ul>
    <h3>Enviar a</h3>
    <p>${escapeHtml(o.shippingName)}<br/>${escapeHtml(o.shippingAddressText).replace(/\n/g, '<br/>')}<br/>
    Tel: ${escapeHtml(o.shippingPhone)}<br/>Correo: ${escapeHtml(o.customerEmail)}</p>
    <p>Siguiente paso: haz el pedido en el proveedor con estos datos y guarda el número de rastreo.</p>`;

  await send(ADMIN_EMAIL, `Nuevo pedido — ${money(o.totalInCents)}`, html, FROM_DEFAULT);
}

export async function sendCustomerOrderEmail(o: OrderEmailData) {
  const from = process.env.RESEND_FROM;
  if (!from || !o.customerEmail) return; // sin dominio verificado no se envía

  const rows = o.items
    .map((i) => `<li>${escapeHtml(i.name)} × ${i.quantity} — ${money(i.priceInCents)}</li>`)
    .join('');

  const html = `
    <h2>¡Gracias por tu compra${o.shippingName ? `, ${escapeHtml(o.shippingName)}` : ''}!</h2>
    <p>Recibimos tu pago y ya estamos preparando tu pedido.</p>
    <ul>${rows}</ul>
    <p><strong>Total:</strong> ${money(o.totalInCents)}</p>
    <p><strong>Se enviará a:</strong><br/>${escapeHtml(o.shippingAddressText).replace(/\n/g, '<br/>')}</p>
    <p>El tiempo estimado de entrega es de 7 a 20 días hábiles. Te avisaremos cuando tengamos tu número de rastreo.</p>
    <p>Si tienes alguna duda, responde a este correo.</p>`;

  await send(o.customerEmail, 'Confirmamos tu pedido', html, from);
}
