import { useState, useEffect } from 'react';
import api from '../../configs/axios';
import type { Product } from '../../types/index';
import { useAppContext } from '../../context/AppContext';
import { usePermissions } from '../auth/usePermission';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { setError: setGlobalError } = useAppContext();
  const { hasRole } = usePermissions();

  const uri = hasRole('supplier') ? '/api/supplier/products' : '/api/products';

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(uri);
      setProducts(response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch products';
      setError(errorMessage);
      setGlobalError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const refetchProducts = () => {
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    refetchProducts
  };
}