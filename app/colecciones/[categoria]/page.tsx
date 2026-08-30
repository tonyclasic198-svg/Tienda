import { getProductsByCategory } from '@/lib/products';
import { CATEGORY_LABELS, ProductCategory } from '@/types/product';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/ProductCard';

const VALID_CATEGORIES = Object.keys(CATEGORY_LABELS) as ProductCategory[];

export function generateStaticParams() {
  return VALID_CATEGORIES.map((categoria) => ({ categoria }));
}

export default async function ColeccionPage({
  params,
}: {
  params: { categoria: string };
}) {
  // Valida que la categoría en la URL exista antes de consultar la base de datos
  if (!VALID_CATEGORIES.includes(params.categoria as ProductCategory)) {
    notFound();
  }

  const categoria = params.categoria as ProductCategory;

  let products;
  try {
    products = await getProductsByCategory(categoria);
  } catch (error) {
    console.error('Error cargando la colección:', error);
    return (
      <div className="p-8 text-center text-red-600">
        No se pudo cargar esta colección. Intenta de nuevo más tarde.
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">{CATEGORY_LABELS[categoria]}</h1>

      {products.length === 0 ? (
        <p className="mt-6 text-gray-600">
          Aún no hay productos en esta colección.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
