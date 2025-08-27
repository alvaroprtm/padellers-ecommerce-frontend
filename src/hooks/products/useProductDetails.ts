import { useState, useEffect } from 'react';
import api from '../../configs/axios';
import type { Product } from '../../types/index';
import { useAppContext } from '../../context/AppContext';

export function useProduct(productId: string | undefined) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setError: setGlobalError } = useAppContext();

  const fetchProduct = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/api/products/${id}`);
      setProduct(response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch product details';
      setError(errorMessage);
      setGlobalError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const refetchProduct = () => {
    if (productId) {
      fetchProduct(productId);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    } else {
      setError('Product ID is required');
      setLoading(false);
    }
  }, [productId]);

  return {
    product,
    loading,
    error,
    refetchProduct
  };
}