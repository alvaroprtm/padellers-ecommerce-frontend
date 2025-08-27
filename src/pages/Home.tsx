import { useAppContext } from '../context/AppContext';
import type { Product } from '../types/index';
import ProductList from '../components/ProductList';
import { useNavigate } from 'react-router-dom';
import { usePermissions } from '../hooks/auth/usePermission';
import { useProducts } from '../hooks/products/useProducts';

const Home: React.FC = () => {
  const { user } = useAppContext();
  const { hasRole } = usePermissions();
  const { products } = useProducts();

  const navigate = useNavigate();

  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div>
      <header className="relative shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl text-white font-bold">Welcome {user?.name || ''}</h1>
        </div>
      </header>
      <main>
        {hasRole('supplier') &&            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-300">Total Products</h3>
                  <p className="text-3xl font-bold text-amber-400">{products.length}</p>
                </div>
              </div>
            </div>
        }
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <ProductList onProductClick={handleProductClick} />
        </div>
      </main>
    </div>
  );
};

export default Home
