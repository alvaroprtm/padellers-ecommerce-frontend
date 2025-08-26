import { useState, useEffect } from 'react';
import api from '../configs/axios';
import type { Product } from '../types/Products';
import { useAppContext } from '../context/AppContext';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setError: setGlobalError, user } = useAppContext();

  const isSupplier = user?.role?.includes('supplier') || false;
  console.log('supplier? ', user?.role)
  const uri = isSupplier ? '/api/supplier/products' : '/api/products';

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