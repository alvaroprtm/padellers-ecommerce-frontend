import { useState, useEffect } from 'react';
import api from '../configs/axios';
import type { Product } from '../types/Products';
import { useAppContext } from '../context/AppContext';

export function useSupplierProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setError: setGlobalError, isSupplier } = useAppContext();

  const fetchSupplierProducts = async () => {
    console.log(isSupplier)
    if (!isSupplier()) {
      setError('Access denied: Supplier role required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/supplier/products');
      setProducts(response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch supplier products';
      setError(errorMessage);
      setGlobalError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData: Partial<Product>) => {
    try {
      setError(null);
      const response = await api.post('/api/products', productData);
      setProducts(prev => [response.data, ...prev]);
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to add product';
      setError(errorMessage);
      setGlobalError(errorMessage);
      throw err;
    }
  };

  const updateProduct = async (productId: number, productData: Partial<Product>) => {
    try {
      setError(null);
      const response = await api.patch(`/api/products/${productId}`, productData);
      setProducts(prev => prev.map(p => p.id === productId ? response.data : p));
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update product';
      setError(errorMessage);
      setGlobalError(errorMessage);
      throw err;
    }
  };

  const deleteProduct = async (productId: number) => {
    try {
      setError(null);
      await api.delete(`/api/products/${productId}`);
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete product';
      setError(errorMessage);
      setGlobalError(errorMessage);
      throw err;
    }
  };

  const refetchProducts = () => {
    fetchSupplierProducts();
  };

  useEffect(() => {
    fetchSupplierProducts();
  }, []);

  return {
    products,
    loading,
    error,
    refetchProducts,
    addProduct,
    updateProduct,
    deleteProduct
  };
}