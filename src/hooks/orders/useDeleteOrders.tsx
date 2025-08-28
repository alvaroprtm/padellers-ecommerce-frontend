import { useState } from 'react';
import api from '../../configs/axios';
import { useAppContext } from '../../context/AppContext';

export function useDeleteOrder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setError: setGlobalError } = useAppContext();

  const deleteOrder = async (orderId: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      await api.delete(`/api/orders/${orderId}`);
      return true;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Failed to cancel order';
      setError(errorMessage);
      setGlobalError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    deleteOrder,
    loading,
    error,
    clearError,
  };
}
