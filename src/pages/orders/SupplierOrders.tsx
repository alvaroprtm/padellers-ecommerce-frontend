import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../configs/axios';
import type { Order } from '../../types/index';
import { usePermissions } from '../../hooks/auth/usePermission';
import { useUpdateOrderStatus } from '../../hooks/orders/useUpdateOrderStatus';
import { StatusUpdateDropdown } from '../../components/StatusUpdateDropdown';
import { useAppContext } from '../../context/AppContext';

const SupplierOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const {user} = useAppContext();

  const navigate = useNavigate();
  const { hasRole } = usePermissions();
  const { updateOrderStatus, loading: updateLoading, error: updateError, clearError } = useUpdateOrderStatus();

  useEffect(() => {
    fetchSupplierOrders();
  }, []);

  // Clear update error after 5 seconds
  useEffect(() => {
    if (updateError) {
      const timer = setTimeout(clearError, 5000);
      return () => clearTimeout(timer);
    }
  }, [updateError, clearError]);

  const fetchSupplierOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/supplier/orders');
      setOrders(response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch orders';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: number, newStatus: Order['status']) => {
    console.log(user)
    const updatedOrder = await updateOrderStatus(orderId, newStatus);
    
    if (updatedOrder) {
      // Update the local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'paid': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'shipped': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'completed': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'cancelled': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateSupplierTotal = (order: Order) => {
    return order.order_items?.reduce((total, item) => {
      return total + (parseFloat(item.price) * item.quantity);
    }, 0) || 0;
  };

  if (!hasRole('supplier')) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center" style={{ color: 'rgba(255, 255, 255, 0.87)' }}>
        <div className="text-center">
          <p className="text-lg mb-4">Access denied. Supplier role required.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center" style={{ color: 'rgba(255, 255, 255, 0.87)' }}>
        <div className="text-center">
          <div className="text-red-400 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg font-medium">Failed to load orders</p>
            <p className="text-sm text-gray-400 mt-1">{error}</p>
          </div>
          <div className="space-x-4">
            <button
              onClick={fetchSupplierOrders}
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
            >
              Go Home
            </button>
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
          <div>
            <h1 className="text-3xl font-bold">Product Orders</h1>
            <p className="text-gray-400 mt-1">Manage orders containing your products</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            Back to Products
          </button>
        </div>

        {/* Update Error Alert */}
        {updateError && (
          <div className="mb-6 bg-red-900 bg-opacity-50 border border-red-600 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-200">{updateError}</span>
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

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400">
              <svg className="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h2 className="text-2xl font-bold mb-2" style={{ color: 'rgba(255, 255, 255, 0.87)' }}>No orders yet</h2>
              <p className="text-gray-500 mb-6">Orders containing your products will appear here</p>
              <button
                onClick={() => navigate('/product/create')}
                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
              >
                Add Your First Product
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-gray-900 bg-opacity-50 rounded-lg border border-gray-800 overflow-hidden backdrop-blur-sm">
                {/* Order Header */}
                <div className="px-6 py-4 border-b border-gray-800">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                      <p className="text-gray-400 text-sm">
                        Ordered by <span className="text-white">{order.user?.name}</span> on {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div className="text-right flex items-center space-x-4">
                      <div>
                        <p className="text-lg font-bold text-amber-400">
                          €{calculateSupplierTotal(order).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-400">Your earnings</p>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <StatusUpdateDropdown
                          currentStatus={order.status}
                          orderId={order.id}
                          onStatusUpdate={handleStatusUpdate}
                          loading={updateLoading}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Your Products in this Order */}
                <div className="divide-y divide-gray-800">
                  {order.order_items?.map((item) => (
                    <div key={item.id} className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 w-16 h-16 bg-gray-800 bg-opacity-50 rounded-lg overflow-hidden">
                          {item.product?.image_url ? (
                            <img
                              src={item.product.image_url}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="font-semibold" style={{ color: 'rgba(255, 255, 255, 0.87)' }}>
                            {item.product?.name || 'Product Unavailable'}
                          </h4>
                          <div className="flex items-center mt-1 space-x-4">
                            <span className="text-gray-400 text-sm">Qty: {item.quantity}</span>
                            <span className="text-gray-400 text-sm">Price: €{item.price}</span>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-bold text-amber-400">
                            €{(parseFloat(item.price) * item.quantity).toFixed(2)}
                          </p>
                          <button
                            onClick={() => navigate(`/product/${item.product_id}`)}
                            className="text-sm text-blue-400 hover:text-blue-300 mt-1"
                          >
                            View Product
                          </button>
                        </div>
                      </div>
                    </div>
                  )) || (
                    <div className="p-6 text-center text-gray-400">
                      <p>No items found for this order</p>
                    </div>
                  )}
                </div>

                {/* Customer Contact */}
                <div className="px-6 py-3 bg-gray-800 bg-opacity-30">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">
                      Customer: {order.user?.name} ({order.user?.email})
                    </span>
                    <span className="text-xs text-gray-500">
                      Total Order Value: €{order.price}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierOrders;