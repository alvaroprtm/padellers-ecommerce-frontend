import { useAppContext } from '../context/AppContext';
import type { Product } from '../types/index';
import ProductList from '../components/ProductList';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const { user } = useAppContext();
  const isSupplier = user?.role?.includes('supplier') || false;

  const navigate = useNavigate();

  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div>
      <header className="relative shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
              <h1 className="text-3xl text-white font-bold">Welcome {user?.name || ''}</h1>
            </div>
          </div>
        </div>
      </header>
      <main>
        {isSupplier &&            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-300">Total Products</h3>
                  <p className="text-3xl font-bold text-amber-400">0</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-300">Total Sales</h3>
                  <p className="text-3xl font-bold text-green-400">€1,234</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-300">Orders This Month</h3>
                  <p className="text-3xl font-bold text-blue-400">42</p>
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
