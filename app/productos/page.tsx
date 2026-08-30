import { getAllProducts } from '@/lib/products';
import ProductCard from '@/components/ProductCard';

export default async function ProductosPage() {
  const products = await getAllProducts();

  if (products.length === 0) {
    return <p className="p-8 text-center">Aún no hay productos disponibles.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 p-8 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
