import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useCreateOrder } from '../../hooks/orders/useCreateOrders';
import { useAppContext } from '../../context/AppContext';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const { user } = useAppContext();
  const navigate = useNavigate();
  const { createOrder, loading: orderLoading, error: orderError, clearError } = useCreateOrder();

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (items.length === 0) return;
    clearError();

    const order = await createOrder(items);
    
    if (order) {
      clearCart();
      navigate('/orders');
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black" style={{ color: 'rgba(255, 255, 255, 0.87)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="text-gray-400">
              <h2 className="text-2xl font-bold mb-2" style={{ color: 'rgba(255, 255, 255, 0.87)' }}>Your cart is empty</h2>
              <p className="text-gray-500 mb-6">Add some products to get started</p>
              <button
                onClick={() => navigate('/')}
                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black" style={{ color: 'rgba(255, 255, 255, 0.87)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold" style={{ color: 'rgba(255, 255, 255, 0.87)' }}>Shopping Cart</h1>
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            Continue Shopping
          </button>
        </div>

        {/* Error Message */}
        {orderError && (
          <div className="mb-6 bg-red-900 bg-opacity-50 border border-red-600 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-200">{orderError}</span>
              <button
                onClick={clearError}
                className="ml-auto text-red-400 hover:text-red-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 bg-opacity-50 rounded-lg border border-gray-800 overflow-hidden backdrop-blur-sm">
              <div className="px-6 py-4 border-b border-gray-800">
                <h2 className="text-xl font-semibold" style={{ color: 'rgba(255, 255, 255, 0.87)' }}>Cart Items ({items.length})</h2>
              </div>
              
              <div className="divide-y divide-gray-800">
                {items.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex items-center space-x-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-20 h-20 bg-gray-800 bg-opacity-50 rounded-lg overflow-hidden">
                        {item.product.image_url ? (
                          <img
                            src={item.product.image_url}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold" style={{ color: 'rgba(255, 255, 255, 0.87)' }}>{item.product.name}</h3>
                        {item.product.description && (
                          <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                            {item.product.description}
                          </p>
                        )}
                        <p className="text-amber-400 font-bold mt-2">€{item.product.price}</p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-gray-800 bg-opacity-50 hover:bg-gray-700 hover:bg-opacity-70 flex items-center justify-center transition-all duration-200"
                          disabled={orderLoading}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        
                        <span className="font-semibold text-lg min-w-8 text-center" style={{ color: 'rgba(255, 255, 255, 0.87)' }}>{item.quantity}</span>
                        
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-gray-800 bg-opacity-50 hover:bg-gray-700 hover:bg-opacity-70 flex items-center justify-center transition-all duration-200"
                          disabled={orderLoading}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right min-w-24">
                        <p className="text-lg font-bold" style={{ color: 'rgba(255, 255, 255, 0.87)' }}>
                          €{(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-400 hover:text-red-300 transition-colors duration-200"
                        disabled={orderLoading}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 bg-opacity-50 rounded-lg border border-gray-800 p-6 sticky top-8 backdrop-blur-sm">
              <h2 className="text-xl font-semibold mb-6" style={{ color: 'rgba(255, 255, 255, 0.87)' }}>Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal:</span>
                  <span className="font-semibold" style={{ color: 'rgba(255, 255, 255, 0.87)' }}>€{getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping:</span>
                  <span className="font-semibold" style={{ color: 'rgba(255, 255, 255, 0.87)' }}>Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tax:</span>
                  <span className="font-semibold" style={{ color: 'rgba(255, 255, 255, 0.87)' }}>€0.00</span>
                </div>
                <div className="border-t border-gray-800 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold" style={{ color: 'rgba(255, 255, 255, 0.87)' }}>Total:</span>
                    <span className="text-lg font-bold text-amber-400">€{getCartTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {!user && (
                <div className="mb-4 p-3 bg-yellow-900 bg-opacity-50 border border-yellow-600 rounded-lg">
                  <p className="text-yellow-200 text-sm">Please log in to place an order</p>
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={orderLoading || !user}
                className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none"
              >
                {orderLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Order...
                  </div>
                ) : !user ? (
                  'Login to Checkout'
                ) : (
                  'Place Order'
                )}
              </button>

              <button
                onClick={clearCart}
                disabled={orderLoading}
                className="w-full mt-3 border border-gray-600 hover:border-gray-500 hover:bg-gray-700 hover:bg-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-200 font-medium py-2 px-6 rounded-lg transition-all duration-200"
              >
                Clear Cart
              </button>

              {!user && (
                <button
                  onClick={() => navigate('/login')}
                  className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-all duration-200"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;