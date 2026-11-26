export const metadata = { title: 'Aviso de privacidad — Mi Tienda' };

export default function AvisoPrivacidad() {
  return (
    <div className="mx-auto max-w-2xl space-y-4 p-8 text-sm leading-relaxed text-gray-700">
      <h1 className="text-2xl font-semibold text-black">Aviso de privacidad</h1>
      <p>
        José Antonio López Medina, con domicilio en Guadalupe, Zacatecas, México, es responsable
        del tratamiento de los datos personales que nos proporcionas al comprar en esta tienda,
        conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.
      </p>
      <h2 className="text-lg font-semibold text-black">Datos que recabamos</h2>
      <p>
        Nombre, correo electrónico, teléfono y dirección de envío. Los datos de tu tarjeta los
        procesa directamente Stripe; nosotros no los vemos ni los guardamos.
      </p>
      <h2 className="text-lg font-semibold text-black">Para qué los usamos</h2>
      <p>
        Para procesar y enviar tu pedido, darte seguimiento, atender aclaraciones, devoluciones y
        cumplir obligaciones fiscales. Compartimos tu nombre, dirección y teléfono únicamente con
        el proveedor y la paquetería que entregan tu pedido.
      </p>
      <h2 className="text-lg font-semibold text-black">Tus derechos</h2>
      <p>
        Puedes pedir acceder, rectificar, cancelar u oponerte al uso de tus datos (derechos ARCO)
        escribiendo a <a className="underline" href="mailto:tonyclasic198@gmail.com">tonyclasic198@gmail.com</a>.
        Te responderemos en un plazo máximo de 20 días hábiles.
      </p>
      <h2 className="text-lg font-semibold text-black">Cambios a este aviso</h2>
      <p>Cualquier cambio se publicará en esta misma página.</p>
    </div>
  );
}
