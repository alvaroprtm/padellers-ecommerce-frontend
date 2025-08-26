import { useProducts } from '../hooks/useProducts';
import ProductCard from './ProductCard';
import type { Product } from '../types/index';

interface ProductListProps {
  onProductClick?: (product: Product) => void;
  className?: string;
}

const ProductList = ({ onProductClick, className }: ProductListProps) => {
  const { products, loading, error, refetchProducts } = useProducts();

  if (loading) {
    return (
      <div className={`flex justify-center items-center min-h-64 ${className || ''}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-8 ${className || ''}`}>
        <div className="text-red-600 mb-4">
          <p className="text-lg font-medium">Failed to load products</p>
          <p className="text-sm text-gray-600 mt-1">{error}</p>
        </div>
        <button
          onClick={refetchProducts}
          className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onProductClick={onProductClick}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;