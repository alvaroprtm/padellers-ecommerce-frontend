import { useState } from 'react';
import type { Order } from '../../types/index';

interface OrderStatusDropdownProps {
  currentStatus: Order['status'];
  orderId: number;
  onStatusUpdate: (orderId: number, status: Order['status']) => void;
  loading?: boolean;
  disabled?: boolean;
}

const statusOptions: { value: Order['status']; label: string; color: string }[] = [
  { value: 'pending', label: 'Pending', color: 'text-yellow-400' },
  { value: 'paid', label: 'Paid', color: 'text-blue-400' },
  { value: 'shipped', label: 'Shipped', color: 'text-purple-400' },
  { value: 'completed', label: 'Completed', color: 'text-green-400' },
  { value: 'cancelled', label: 'Cancelled', color: 'text-red-400' },
];

export const OrderStatusDropdown = ({
  currentStatus,
  orderId,
  onStatusUpdate,
  loading = false,
  disabled = false
}: OrderStatusDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleStatusChange = (newStatus: Order['status']) => {
    if (newStatus !== currentStatus) {
      onStatusUpdate(orderId, newStatus);
    }
    setIsOpen(false);
  };

  const getCurrentStatusOption = () => {
    return statusOptions.find(option => option.value === currentStatus) || statusOptions[0];
  };

  const getAvailableStatuses = () => {
    switch (currentStatus) {
      case 'pending':
        return statusOptions.filter(option => ['paid', 'cancelled'].includes(option.value));
      case 'paid':
        return statusOptions.filter(option => ['shipped', 'cancelled'].includes(option.value));
      case 'shipped':
        return statusOptions.filter(option => ['completed'].includes(option.value));
      case 'completed':
        return []; 
      case 'cancelled':
        return []; 
      default:
        return statusOptions;
    }
  };

  const currentOption = getCurrentStatusOption();
  const availableStatuses = getAvailableStatuses();

  if (availableStatuses.length === 0 || disabled) {
    return (
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border bg-gray-700 border-gray-600 ${currentOption.color}`}>
        {currentOption.label}
        {currentStatus === 'completed' && (
          <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
        {currentStatus === 'cancelled' && (
          <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${
          loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700 cursor-pointer'
        } bg-gray-800 border-gray-600 ${currentOption.color}`}
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-1"></div>
            Updating...
          </>
        ) : (
          <>
            {currentOption.label}
            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </>
        )}
      </button>

      {isOpen && !loading && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-20 w-32 bg-gray-800 border border-gray-600 rounded-lg shadow-lg overflow-hidden">
            <div className="py-1">
              {availableStatuses.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleStatusChange(option.value)}
                  className={`w-full text-left px-4 py-2 text-xs hover:bg-gray-700 transition-colors duration-200 ${option.color}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};