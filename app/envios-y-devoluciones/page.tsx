export const metadata = { title: 'Envíos y devoluciones — Mi Tienda' };

export default function EnviosDevoluciones() {
  return (
    <div className="mx-auto max-w-2xl space-y-4 p-8 text-sm leading-relaxed text-gray-700">
      <h1 className="text-2xl font-semibold text-black">Envíos y devoluciones</h1>
      <h2 className="text-lg font-semibold text-black">Envíos</h2>
      <p>
        Enviamos a todo México. Tu pedido sale de nuestro proveedor y llega en un tiempo estimado
        de 7 a 20 días hábiles. Cuando tengamos tu número de rastreo te lo enviaremos por correo.
      </p>
      <h2 className="text-lg font-semibold text-black">Si tu pedido llega dañado o no es lo que pediste</h2>
      <p>
        Escríbenos dentro de los 7 días naturales siguientes a la entrega a{' '}
        <a className="underline" href="mailto:tonyclasic198@gmail.com">tonyclasic198@gmail.com</a>{' '}
        con tu número de pedido y fotos del producto. Te enviamos un reemplazo o te devolvemos tu
        dinero completo.
      </p>
      <h2 className="text-lg font-semibold text-black">Si tu pedido no llega</h2>
      <p>
        Si pasan 30 días hábiles desde tu compra y no has recibido tu pedido, escríbenos y te
        reembolsamos el total.
      </p>
      <h2 className="text-lg font-semibold text-black">Cancelaciones</h2>
      <p>
        Puedes cancelar tu pedido sin costo dentro de las 24 horas siguientes a tu compra,
        siempre que todavía no haya sido enviado.
      </p>
    </div>
  );
}
