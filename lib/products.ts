import { supabase, supabaseAdmin } from './supabase';
import { Product, ProductCategory } from '@/types/product';

// Supabase devuelve columnas en snake_case; el tipo Product usa camelCase.
function mapRowToProduct(row: any): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    priceInCents: row.price_in_cents,
    imageUrl: row.image_url,
    stock: row.stock,
    category: row.category,
    externalUrl: row.external_url ?? null,
    personalized: row.personalized ?? false,
  };
}

// Datos del proveedor: solo se usan en el servidor (nunca se muestran al cliente).
export async function getSupplierInfo(productIds: string[]) {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('id, name, supplier, supplier_sku, supplier_url, personalized')
    .in('id', productIds);
  if (error) {
    console.error('Error leyendo datos de proveedor:', error);
    return [];
  }
  return data ?? [];
}

export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from('products').select('*');
  if (error) {
    console.error('Error de Supabase en getAllProducts:', error);
    throw new Error('No se pudieron cargar los productos');
  }
  return (data ?? []).map(mapRowToProduct);
}

export async function getProductsByCategory(
  category: ProductCategory
): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category);
  if (error) {
    console.error('Error de Supabase en getProductsByCategory:', error);
    throw new Error('No se pudieron cargar los productos de esta colección');
  }
  return (data ?? []).map(mapRowToProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();
  if (error) {
    console.error('Error de Supabase en getProductBySlug:', error);
    return null;
  }
  return mapRowToProduct(data);
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  if (error) {
    console.error('Error de Supabase en getProductById:', error);
    return null;
  }
  return mapRowToProduct(data);
}
