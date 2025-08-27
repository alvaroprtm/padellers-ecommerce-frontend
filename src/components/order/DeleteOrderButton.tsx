import { useState } from 'react';
import { useDeleteOrder } from '../../hooks/orders/useDeleteOrders';
import type { Order } from '../../types/index';

interface DeleteOrderButtonProps {
  order: Order;
  onOrderDeleted: () => void;
}

export const DeleteOrderButton = ({ order, onOrderDeleted }: DeleteOrderButtonProps) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const { deleteOrder, loading } = useDeleteOrder();

  if (order.status !== 'pending') {
    return null;
  }

  const handleDelete = async () => {
    const success = await deleteOrder(order.id);
    if (success) {
      onOrderDeleted();
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-400">Cancel this order?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? 'Cancelling...' : 'Yes'}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700"
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="px-3 py-1 bg-red-600/20 text-red-400 text-xs rounded border border-red-400/20 hover:bg-red-600/30 transition-colors"
    >
      Cancel Order
    </button>
  );
};