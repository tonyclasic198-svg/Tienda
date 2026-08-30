export type ProductCategory = 'mascotas' | 'skincare' | 'arte-impreso';

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  mascotas: 'Mascotas',
  skincare: 'Skincare',
  'arte-impreso': 'Arte Impreso',
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
}
