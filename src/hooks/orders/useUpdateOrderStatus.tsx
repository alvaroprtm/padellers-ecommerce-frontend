import { useState } from 'react';
import api from '../../configs/axios';
import type { Order } from '../../types/index';
import { useAppContext } from '../../context/AppContext';

export function useUpdateOrderStatus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setError: setGlobalError } = useAppContext();

  const updateOrderStatus = async (
    orderId: number,
    status: Order['status']
  ): Promise<Order | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.patch(`/api/orders/${orderId}`, { status });
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Failed to update order status';
      setError(errorMessage);
      setGlobalError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    updateOrderStatus,
    loading,
    error,
    clearError,
  };
}
