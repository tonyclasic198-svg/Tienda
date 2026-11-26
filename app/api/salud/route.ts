import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Vercel llama a esta ruta una vez al día (ver vercel.json).
// La consulta mantiene activa la base de datos de Supabase para que el
// plan gratuito no la pause por inactividad.
export const dynamic = 'force-dynamic';

export async function GET() {
  const { count, error } = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true });

  if (error) {
    console.error('Chequeo de salud falló:', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  return NextResponse.json({ ok: true, productosActivos: count });
}
