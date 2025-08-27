import { useState } from 'react';
import api from '../../configs/axios';
import type { Order, CartItem } from '../../types/index';
import { useAppContext } from '../../context/AppContext';

interface CreateOrderPayload {
  items: Array<{
    product_id: number;
    quantity: number;
  }>;
}

export function useCreateOrder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setError: setGlobalError } = useAppContext();

  const createOrder = async (items: CartItem[]): Promise<Order | null> => {
    try {
      setLoading(true);
      setError(null);

      const payload: CreateOrderPayload = {
        items: items.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity
        }))
      };

      const response = await api.post('/api/orders', payload);
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create order';
      setError(errorMessage);
      setGlobalError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    createOrder,
    loading,
    error,
    clearError
  };
}