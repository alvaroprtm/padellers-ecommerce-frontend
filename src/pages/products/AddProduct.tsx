import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../configs/axios';
import { useAppContext } from '../../context/AppContext';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const navigate = useNavigate();
  const { user } = useAppContext();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev: any) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      const response = await api.post('/api/products', {
        ...formData,
        price: parseFloat(formData.price) || 0,
      });
      navigate(`/product/${response.data.id}`);
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({
          general: error.response?.data?.message || 'Failed to create product',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div
        className="min-h-screen bg-black flex justify-center items-center"
        style={{ color: 'rgba(255, 255, 255, 0.87)' }}
      >
        <div className="text-center">
          <p className="text-lg mb-4">Please log in to add products</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-400 hover:text-white transition-colors duration-200 mr-4"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>
        <h1 className="text-3xl font-bold my-5">Add New Product</h1>

        <div className="bg-gray-900 bg-opacity-50 rounded-lg border border-gray-800 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="p-6">
            {errors.general && (
              <div className="mb-6 p-3 bg-red-900 bg-opacity-50 border border-red-700 rounded-lg text-red-300">
                {errors.general}
              </div>
            )}

            <div className="mb-6">
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Product Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Enter product name"
                required
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-400">{errors.name[0]}</p>
              )}
            </div>

            <div className="mb-6">
              <label
                htmlFor="description"
                className="block text-sm font-medium mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-vertical"
                placeholder="Enter product description (optional)"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.description[0]}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="price" className="block text-sm font-medium mb-2">
                Price (€) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="0.00"
                required
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-400">{errors.price[0]}</p>
              )}
            </div>

            <div className="mb-8">
              <label
                htmlFor="image_url"
                className="block text-sm font-medium mb-2"
              >
                Image URL
              </label>
              <input
                type="url"
                id="image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                className="w-full bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg (optional)"
              />
              {errors.image_url && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.image_url[0]}
                </p>
              )}
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating...
                  </div>
                ) : (
                  'Create Product'
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-6 py-3 border border-gray-600 hover:border-gray-500 hover:bg-gray-700 hover:bg-opacity-50 text-gray-200 font-medium rounded-lg transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 text-center text-gray-400 text-sm">
          <p>* Required fields</p>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
