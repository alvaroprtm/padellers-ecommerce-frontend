import { useState, useEffect } from 'react';
import api from '../../configs/axios';
import type { Order } from '../../types/index';
import { useAppContext } from '../../context/AppContext';

export function useUserOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setError: setGlobalError } = useAppContext();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/orders');
      setOrders(response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch orders';
      setError(errorMessage);
      setGlobalError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const refetchOrders = () => {
    fetchOrders();
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    loading,
    error,
    refetchOrders
  };
}