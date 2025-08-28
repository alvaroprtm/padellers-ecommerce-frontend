import { useState, useEffect } from 'react';
import api from '../../configs/axios';
import type { Order } from '../../types/index';
import { useAppContext } from '../../context/AppContext';

export function useSupplierOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setError: setGlobalError } = useAppContext();

  const fetchSupplierOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/supplier/orders');
      setOrders(response.data);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Failed to fetch supplier orders';
      setError(errorMessage);
      setGlobalError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const refetchOrders = () => {
    fetchSupplierOrders();
  };

  useEffect(() => {
    fetchSupplierOrders();
  }, []);

  return {
    orders,
    loading,
    error,
    refetchOrders,
  };
}
