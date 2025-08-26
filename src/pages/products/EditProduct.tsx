import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../configs/axios';
import { useAppContext } from '../../context/AppContext';

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image_url: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const navigate = useNavigate();
  const { user } = useAppContext();

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/api/products/${id}`);
      const product = response.data;
      
      // Check if user owns this product
      if (product.user_id !== user?.id) {
        navigate('/');
        return;
      }
      
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        image_url: product.image_url || ''
      });
    } catch (error) {
      console.error('Failed to fetch product:', error);
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
    setSaving(true);
    setErrors({});

    try {
      await api.patch(`/api/products/${id}`, {
        ...formData,
        price: parseFloat(formData.price) || 0
      });
      navigate(`/product/${id}`);
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: error.response?.data?.message || 'Failed to update product' });
      }
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black" style={{ color: 'rgba(255, 255, 255, 0.87)' }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate(`/product/${id}`)}
              className="flex items-center text-gray-400 hover:text-white transition-colors duration-200 mr-4"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <h1 className="text-3xl font-bold">Edit Product</h1>
          </div>
        </div>

        <div className="bg-gray-900 bg-opacity-50 rounded-lg border border-gray-800 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="p-6">
            {errors.general && (
              <div className="mb-6 p-3 bg-red-900 bg-opacity-50 border border-red-700 rounded-lg text-red-300">
                {errors.general}
              </div>
            )}

            <div className="mb-6">
              <label htmlFor="name" className="block text-sm font-medium mb-2">Product Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                required
              />
              {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name[0]}</p>}
            </div>

            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium mb-2">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-vertical"
              />
              {errors.description && <p className="mt-1 text-sm text-red-400">{errors.description[0]}</p>}
            </div>

            <div className="mb-6">
              <label htmlFor="price" className="block text-sm font-medium mb-2">Price (€) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                required
              />
              {errors.price && <p className="mt-1 text-sm text-red-400">{errors.price[0]}</p>}
            </div>

            <div className="mb-8">
              <label htmlFor="image_url" className="block text-sm font-medium mb-2">Image URL</label>
              <input
                type="url"
                id="image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                className="w-full bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              {errors.image_url && <p className="mt-1 text-sm text-red-400">{errors.image_url[0]}</p>}
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
              >
                {saving ? 'Saving...' : 'Update Product'}
              </button>
              <button
                type="button"
                onClick={() => navigate(`/product/${id}`)}
                className="px-6 py-3 border border-gray-600 hover:border-gray-500 hover:bg-gray-700 hover:bg-opacity-50 text-gray-200 font-medium rounded-lg transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;