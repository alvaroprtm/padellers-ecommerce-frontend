import { useSupplierProducts } from '../hooks/useSupplierProducts';
import { useState } from 'react';
import { useAppContext } from '../context/AppContext';

const SupplierDashboard = () => {
  const { user } = useAppContext();
  const { products, loading, error, addProduct, updateProduct, deleteProduct } = useSupplierProducts();
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddProduct = async (productData: any) => {
    try {
      await addProduct(productData);
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to add product:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Supplier Dashboard</h1>
              <p className="text-gray-400 mt-1">Welcome back, {user?.name}</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
            >
              Add New Product
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-gray-300">Total Products</h3>
            <p className="text-3xl font-bold text-amber-400">{products.length}</p>
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

        {/* Products Table */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold">Your Products</h2>
          </div>
          
          {error ? (
            <div className="p-6 text-center text-red-400">
              <p>{error}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="p-6 text-center text-gray-400">
              <p>No products yet. Add your first product to get started!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-700">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {product.image_url ? (
                              <img className="h-10 w-10 rounded-full object-cover" src={product.image_url} alt={product.name} />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center">
                                <span className="text-gray-300 text-sm">🏷️</span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">{product.name}</div>
                            <div className="text-sm text-gray-400 truncate max-w-xs">{product.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-amber-400">€{product.price}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {new Date(product.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button className="text-blue-400 hover:text-blue-300">Edit</button>
                        <button 
                          onClick={() => deleteProduct(product.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Product Modal would go here */}
    </div>
  );
};

export default SupplierDashboard;