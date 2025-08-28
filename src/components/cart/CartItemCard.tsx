import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CartItem } from '../../types/index';

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
  isProcessing: boolean;
  isRecentlyUpdated: boolean;
  disabled?: boolean;
}

export const CartItemCard = ({
  item,
  onUpdateQuantity,
  onRemove,
  isProcessing,
  isRecentlyUpdated,
  disabled = false,
}: CartItemCardProps) => {
  const [quantity, setQuantity] = useState(item.quantity.toString());
  const navigate = useNavigate();

  const subtotal = parseFloat(item.product.price) * item.quantity;

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuantity(value);

    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue > 0) {
      onUpdateQuantity(item.id, numValue);
    }
  };

  const incrementQuantity = () => {
    const newQty = item.quantity + 1;
    if (newQty <= 99) {
      setQuantity(newQty.toString());
      onUpdateQuantity(item.id, newQty);
    }
  };

  const decrementQuantity = () => {
    const newQty = item.quantity - 1;
    if (newQty >= 1) {
      setQuantity(newQty.toString());
      onUpdateQuantity(item.id, newQty);
    }
  };

  return (
    <div
      className={`p-6 transition-all duration-300 ${
        isRecentlyUpdated ? 'bg-green-900/20 border-l-4 border-green-400' : ''
      } ${isProcessing ? 'opacity-60' : ''}`}
    >
      <div className="flex items-center space-x-4">
        {/* Product Image */}
        <div
          className="flex-shrink-0 w-20 h-20 bg-gray-800 bg-opacity-50 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-amber-400/50 transition-all duration-200"
          onClick={() => navigate(`/product/${item.product.id}`)}
        >
          {item.product.image_url ? (
            <img
              src={item.product.image_url}
              alt={item.product.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1">
          <h3
            className="text-lg font-semibold text-white cursor-pointer hover:text-amber-400 transition-colors duration-200"
            onClick={() => navigate(`/product/${item.product.id}`)}
          >
            {item.product.name}
          </h3>
          {item.product.description && (
            <p className="text-gray-400 text-sm mt-1 line-clamp-2">
              {item.product.description}
            </p>
          )}
          <div className="flex items-center gap-4 mt-2">
            <p className="text-amber-400 font-bold">€{item.product.price}</p>
            {item.product.user && (
              <p className="text-xs text-gray-500">
                by {item.product.user.name}
              </p>
            )}
          </div>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={decrementQuantity}
            disabled={disabled || isProcessing || item.quantity <= 1}
            className="w-8 h-8 rounded-full bg-gray-800 bg-opacity-50 hover:bg-gray-700 hover:bg-opacity-70 flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Decrease quantity"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 12H4"
              />
            </svg>
          </button>

          <input
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            disabled={disabled || isProcessing}
            min="1"
            max="99"
            className="w-16 text-center bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
            aria-label="Quantity"
          />

          <button
            onClick={incrementQuantity}
            disabled={disabled || isProcessing || item.quantity >= 99}
            className="w-8 h-8 rounded-full bg-gray-800 bg-opacity-50 hover:bg-gray-700 hover:bg-opacity-70 flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Increase quantity"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
        </div>

        {/* Subtotal */}
        <div className="text-right min-w-24">
          <p className="text-lg font-bold text-white">€{subtotal.toFixed(2)}</p>
          {isProcessing && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-500 mx-auto mt-1"></div>
          )}
        </div>

        {/* Remove Button */}
        <button
          onClick={() => onRemove(item.id)}
          disabled={disabled || isProcessing}
          className="text-red-400 hover:text-red-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed p-2 hover:bg-red-900/20 rounded"
          aria-label="Remove item from cart"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
