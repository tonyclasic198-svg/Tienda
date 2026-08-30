# Mi Tienda — Fase 1

Tienda en línea construida con Next.js (App Router) + Stripe + Supabase.

## Cómo correrlo en tu máquina

1. **Instalar dependencias**
   ```
   npm install
   ```

2. **Configurar variables de entorno**
   ```
   cp .env.local.example .env.local
   ```
   Rellena `.env.local` con:
   - Tus claves de Stripe (modo test): https://dashboard.stripe.com/test/apikeys
   - Tus claves de Supabase (Project Settings → API), proyecto: `jolzbrcbrqnazorrajnz`

3. **Escuchar webhooks de Stripe localmente** (en otra terminal)
   ```
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
   Copia el `whsec_...` que te da el CLI a `STRIPE_WEBHOOK_SECRET` en `.env.local`.

4. **Correr el servidor de desarrollo**
   ```
   npm run dev
   ```
   Abre http://localhost:3000

## Demostración del flujo (qué verás en cada pantalla)

1. **`/` — Home**: presenta las 3 colecciones (Mascotas, Skincare, Arte Impreso)
   con el copy ya redactado. Cada tarjeta lleva a su colección.

2. **`/colecciones/mascotas`, `/colecciones/skincare`, `/colecciones/arte-impreso`**
   — Cada colección carga solo sus productos desde Supabase (columna `category`).
   Ya tienes un producto real cargado en cada una:
   - Mascotas: "Arnés LED Recargable para Paseos Nocturnos" ($459.00 MXN)
   - Skincare: "Sérum Nocturno + Parches de Recuperación" ($389.00 MXN)
   - Arte Impreso: "Póster Cuarteto — Ilustración Original" ($299.00 MXN)

   También sigue disponible `/productos` con el catálogo completo (las 3
   colecciones juntas) y el producto de prueba original.

3. **`/productos/[slug]` — Detalle**: nombre, descripción, precio
   y botón "Agregar al carrito". Al hacer clic, el producto se guarda en
   el store de Zustand (persistido en localStorage del navegador).

4. **`/carrito` — Carrito**: lista los productos agregados con cantidad,
   precio unitario y total. Botón "Pagar ahora".

5. **Al hacer clic en "Pagar ahora"**:
   - El navegador llama a `POST /api/checkout`
   - El servidor valida cada producto contra Supabase (precio, stock) —
     nunca confía en lo que mandó el navegador
   - Crea una sesión de Stripe Checkout y redirige a la página de pago
     hospedada por Stripe

6. **En Stripe Checkout**, usa la tarjeta de prueba:
   ```
   Número: 4242 4242 4242 4242
   Fecha: cualquier fecha futura
   CVC: cualquier 3 dígitos
   ```

7. **Tras el pago**:
   - Stripe redirige a `/success`, que vacía el carrito
   - En paralelo, Stripe envía un evento `checkout.session.completed`
     al webhook `/api/webhooks/stripe`, que guarda el pedido en la
     tabla `orders` de Supabase
   - Puedes verificarlo en Supabase Studio → Table Editor → `orders`

8. **Si cancelas el pago**, Stripe te regresa a `/cancel`.

## Manejo de errores incluido

- Carrito vacío al intentar pagar → mensaje de error, no llama a Stripe
- Producto no encontrado o sin stock suficiente → error 400 con mensaje claro
- Firma de webhook inválida → rechazada con 400 (protege contra webhooks falsos)
- Fallo de red o de Stripe → mensaje de error visible en el botón de pago,
  sin dejar al usuario en blanco

## Siguiente paso sugerido

Deploy a Vercel + conectar el dominio comprado en Neubox.
