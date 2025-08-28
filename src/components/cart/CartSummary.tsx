import { useNavigate } from 'react-router-dom';
import type { User } from '../../types/index';

interface CartSummaryProps {
  subtotal: number;
  itemCount: number;
  user: User | null;
  onCheckout: () => void;
  onClearCart: () => void;
  isLoading: boolean;
  error?: string;
}

export const CartSummary = ({
  subtotal,
  itemCount,
  user,
  onCheckout,
  onClearCart,
  isLoading,
  error,
}: CartSummaryProps) => {
  const navigate = useNavigate();

  const shipping = 0; // Free shipping
  const tax = subtotal * 0.21; // 21% VAT
  const total = subtotal + shipping + tax;

  return (
    <div className="bg-gray-900 bg-opacity-50 rounded-lg border border-gray-800 p-6 sticky top-8 backdrop-blur-sm">
      <h2 className="text-xl font-semibold mb-6 text-white">Order Summary</h2>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-400">Subtotal ({itemCount} items):</span>
          <span className="font-semibold text-white">
            €{subtotal.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Shipping:</span>
          <span className="font-semibold text-green-400">Free</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Tax (21%):</span>
          <span className="font-semibold text-white">€{tax.toFixed(2)}</span>
        </div>
        <div className="border-t border-gray-800 pt-4">
          <div className="flex justify-between">
            <span className="text-lg font-semibold text-white">Total:</span>
            <span className="text-lg font-bold text-amber-400">
              €{total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Estimated Delivery */}
      <div className="mb-6 p-3 bg-blue-900/20 border border-blue-400/20 rounded-lg">
        <div className="flex items-center">
          <svg
            className="w-4 h-4 text-blue-400 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-blue-200 text-sm">
            Estimated delivery: 2-3 business days
          </span>
        </div>
      </div>

      {!user && (
        <div className="mb-4 p-3 bg-yellow-900 bg-opacity-50 border border-yellow-600 rounded-lg">
          <p className="text-yellow-200 text-sm">
            Please log in to place an order
          </p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-900 bg-opacity-50 border border-red-600 rounded-lg">
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-3">
        <button
          onClick={onCheckout}
          disabled={isLoading || !user}
          className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Creating Order...
            </div>
          ) : !user ? (
            'Login to Checkout'
          ) : (
            'Place Order'
          )}
        </button>

        {!user && (
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-all duration-200"
          >
            Login
          </button>
        )}

        <button
          onClick={onClearCart}
          disabled={isLoading}
          className="w-full border border-gray-600 hover:border-gray-500 hover:bg-gray-700 hover:bg-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-200 font-medium py-2 px-6 rounded-lg transition-all duration-200"
        >
          Clear Cart
        </button>
      </div>

      {/* Trust Signals */}
      <div className="mt-6 pt-6 border-t border-gray-800">
        <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
          <div className="flex items-center">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            Secure Checkout
          </div>
          <div className="flex items-center">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            30-Day Returns
          </div>
        </div>
      </div>
    </div>
  );
};
