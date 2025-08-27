import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../configs/axios';
import { useAppContext } from '../../context/AppContext';
import type { Product } from '../../types/index';

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  image_url: string;
}

interface UseEditProductReturn {
  product: Product | null;
  formData: ProductFormData;
  loading: boolean;
  saving: boolean;
  errors: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  clearErrors: () => void;
  isOwner: boolean;
}

export function useEditProduct(productId: string | undefined): UseEditProductReturn {
  const [product, setProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    image_url: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const navigate = useNavigate();
  const { user, setError: setGlobalError } = useAppContext();

  const isOwner = product ? product.user_id === user?.id : false;

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    if (!productId) return;

    try {
      setLoading(true);
      const response = await api.get(`/api/products/${productId}`);
      const productData = response.data;
      
      // Check if user owns this product
      if (productData.user_id !== user?.id) {
        setGlobalError('You are not authorized to edit this product');
        navigate('/');
        return;
      }
      
      setProduct(productData);
      setFormData({
        name: productData.name || '',
        description: productData.description || '',
        price: productData.price ? productData.price.toString() : '',
        image_url: productData.image_url || ''
      });
    } catch (error: any) {
      console.error('Failed to fetch product:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch product';
      setGlobalError(errorMessage);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productId) return;

    setSaving(true);
    setErrors({});

    try {
      const response = await api.patch(`/api/products/${productId}`, {
        ...formData,
        price: parseFloat(formData.price) || 0
      });
      setProduct(response.data);
      navigate(`/product/${productId}`);
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        const errorMessage = error.response?.data?.message || 'Failed to update product';
        setErrors({ general: errorMessage });
        setGlobalError(errorMessage);
      }
    } finally {
      setSaving(false);
    }
  };

  const clearErrors = () => {
    setErrors({});
  };

  return {
    product,
    formData,
    loading,
    saving,
    errors,
    handleChange,
    handleSubmit,
    clearErrors,
    isOwner
  };
}