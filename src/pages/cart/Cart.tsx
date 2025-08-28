import { useNavigate } from 'react-router-dom';
import { useCartOperations } from '../../hooks/cart/useCartOperations';
import { useCreateOrder } from '../../hooks/orders/useCreateOrders';
import { useAppContext } from '../../context/AppContext';
import { CartItemCard } from '../../components/cart/CartItemCard';
import { CartSummary } from '../../components/cart/CartSummary';

const Cart = () => {
  const {
    items,
    clearCart,
    getCartTotal,
    getCartCount,
    safeUpdateQuantity,
    safeRemoveFromCart,
    processingItems,
    recentlyUpdated,
  } = useCartOperations();
  
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

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="text-gray-400">
              <svg className="w-24 h-24 mx-auto mb-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13v6a1 1 0 001 1h9a1 1 0 001-1v-6M7 13H5a1 1 0 01-1-1V4a1 1 0 011-1h1" />
              </svg>
              <h2 className="text-2xl font-bold mb-2 text-white">Your cart is empty</h2>
              <p className="text-gray-500 mb-6">Discover our amazing products and start shopping!</p>
              <button
                onClick={() => navigate('/')}
                className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Start Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Shopping Cart</h1>
            <p className="text-gray-400">{getCartCount()} items in your cart</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Continue Shopping
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 bg-opacity-50 rounded-lg border border-gray-800 overflow-hidden backdrop-blur-sm">
              <div className="px-6 py-4 border-b border-gray-800">
                <h2 className="text-xl font-semibold text-white">Your Items</h2>
              </div>
              
              <div className="divide-y divide-gray-800">
                {items.map((item) => (
                  <CartItemCard
                    key={item.id}
                    item={item}
                    onUpdateQuantity={safeUpdateQuantity}
                    onRemove={safeRemoveFromCart}
                    isProcessing={processingItems.has(item.id)}
                    isRecentlyUpdated={recentlyUpdated.has(item.id)}
                    disabled={orderLoading}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <CartSummary
              subtotal={getCartTotal()}
              itemCount={getCartCount()}
              user={user}
              onCheckout={handleCheckout}
              onClearCart={clearCart}
              isLoading={orderLoading}
              error={orderError || undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;