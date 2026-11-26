export type ProductCategory = 'mascotas' | 'skincare' | 'arte-impreso' | 'digitales';

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  mascotas: 'Mascotas',
  skincare: 'Skincare',
  'arte-impreso': 'Arte Impreso',
  digitales: 'Productos Digitales',
};

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceInCents: number; // siempre en centavos, nunca floats de dinero
  imageUrl: string;
  stock: number;
  category: ProductCategory;
  // Si existe, el producto se compra en otra plataforma (p. ej. Hotmart)
  externalUrl: string | null;
  // El cliente envía una foto después de pagar (retratos, piezas a la medida)
  personalized: boolean;
}
