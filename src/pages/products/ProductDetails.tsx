import { useParams, useNavigate } from 'react-router-dom';
import { useProduct } from '../../hooks/products/useProductDetails';
import { useCart } from '../../context/CartContext';
import { useAppContext } from '../../context/AppContext';
import { useState } from 'react';
import api from '../../configs/axios';
import { CanAccess } from '../../components/common/CanAccess';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { product, loading, error, refetchProduct } = useProduct(id);
  const { addToCart } = useCart();
  const { user } = useAppContext();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isOwner = user && product && user.id === product?.user_id;

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const handleDelete = async () => {
    if (!product || !window.confirm('Are you sure you want to delete this product?')) return;
    
    setDeleting(true);
    try {
      await api.delete(`/api/products/${product.id}`);
      navigate('/');
    } catch (error) {
      alert('Failed to delete product');
      setDeleting(false);
    }
  };

  const QuantitySelector = () => (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-white mb-3">Quantity</h3>
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors duration-200"
          aria-label="Decrease quantity"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        
        <span className="font-semibold text-xl text-white min-w-12 text-center">{quantity}</span>
        
        <button
          onClick={() => setQuantity(quantity + 1)}
          className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors duration-200"
          aria-label="Increase quantity"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>
    </div>
  );

  const AddToCartSection = () => (
    <>
      <QuantitySelector />
      <CanAccess permission="order.create">
        <button 
          onClick={handleAddToCart}
          className={`w-full font-medium py-3 px-6 rounded-lg transition-all duration-200 ${
            addedToCart 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-amber-600 hover:bg-amber-700'
          } text-white`}
        >
          {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
        </button>
        
        <button 
          onClick={() => navigate('/cart')}
          className="w-full border-2 border-gray-600 hover:border-gray-500 hover:bg-gray-700 text-gray-200 hover:text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 mt-4"
        >
          View Cart
        </button>
      </CanAccess>
    </>
  );

  const ProductManagementSection = () => (
    <div className="space-y-4">
      <CanAccess permission="product.edit">
        {isOwner && (
          <button 
            onClick={() => navigate(`/product/${product.id}/edit`)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200"
          >
            Edit Product
          </button>
        )}
      </CanAccess>
      
      <CanAccess permission="product.delete">
        {isOwner && (
          <button 
            onClick={handleDelete}
            disabled={deleting}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200"
          >
            {deleting ? 'Deleting...' : 'Delete Product'}
          </button>
        )}
      </CanAccess>
    </div>
  );

  const LoadingSpinner = () => (
    <div className="min-h-screen bg-gray-900 flex justify-center items-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500"></div>
    </div>
  );

  const ErrorDisplay = () => (
    <div className="min-h-screen flex justify-center items-center">
      <div className="text-center py-8">
        <div className="text-red-400 mb-4">
          <p className="text-lg font-medium text-white">Failed to load product</p>
          <p className="text-sm text-gray-400 mt-1">{error}</p>
        </div>
        <div className="space-x-4">
          <button
            onClick={refetchProduct}
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );

  const NotFoundDisplay = () => (
    <div className="min-h-screen bg-gray-900 flex justify-center items-center">
      <div className="text-center py-8">
        <div className="text-gray-500">
          <p className="text-lg font-medium text-gray-300">Product not found</p>
          <p className="text-sm text-gray-500 mt-1">The product you're looking for doesn't exist</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="mt-4 bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
        >
          Go Back Home
        </button>
      </div>
    </div>
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay />;
  if (!product) return <NotFoundDisplay />;

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-300 hover:text-white transition-colors duration-200"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Products
        </button>
      </div>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-800 rounded-lg shadow-2xl overflow-hidden border border-gray-700">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="aspect-square bg-gray-700 relative rounded-lg overflow-hidden">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://placehold.co/600x600/374151/9CA3AF?text=No+Image';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent"></div>
          </div>

          {/* Product Info */}
          <div className="p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-white mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center justify-between mb-6">
                <span className="text-4xl font-bold text-amber-400">
                  €{product.price}
                </span>
                
                {product.user && (
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Sold by</p>
                    <p className="font-medium text-white">{product.user.name}</p>
                  </div>
                )}
              </div>
            </div>

            {product.description && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-3">Description</h2>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>
            )}

            <div className="space-y-4">
              
                {isOwner ? (
                  <CanAccess 
                  permissions={['product.edit', 'product.delete']}
                  fallback={ <p>You but don't have management permissions.</p> }
                  >
                    <ProductManagementSection />
                  </CanAccess>
                ) : (
                  <AddToCartSection />
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;