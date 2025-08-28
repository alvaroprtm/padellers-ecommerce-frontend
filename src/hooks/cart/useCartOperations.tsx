import { useState, useCallback } from 'react';
import { useCart } from '../../context/CartContext';
import { useAppContext } from '../../context/AppContext';

export function useCartOperations() {
  const [processingItems, setProcessingItems] = useState<Set<string>>(
    new Set()
  );
  const [recentlyUpdated, setRecentlyUpdated] = useState<Set<string>>(
    new Set()
  );
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
  } = useCart();
  const { setError } = useAppContext();

  const setItemProcessing = useCallback(
    (itemId: string, isProcessing: boolean) => {
      setProcessingItems(prev => {
        const newSet = new Set(prev);
        if (isProcessing) {
          newSet.add(itemId);
        } else {
          newSet.delete(itemId);
        }
        return newSet;
      });
    },
    []
  );

  const showRecentUpdate = useCallback((itemId: string) => {
    setRecentlyUpdated(prev => new Set(prev).add(itemId));
    setTimeout(() => {
      setRecentlyUpdated(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }, 1500);
  }, []);

  const safeUpdateQuantity = useCallback(
    async (itemId: string, newQuantity: number) => {
      if (newQuantity < 1 || newQuantity > 99) {
        setError('Quantity must be between 1 and 99');
        return;
      }

      setItemProcessing(itemId, true);
      try {
        await new Promise(resolve => setTimeout(resolve, 200));
        updateQuantity(itemId, newQuantity);
        showRecentUpdate(itemId);
      } catch (error) {
        setError('Failed to update quantity');
      } finally {
        setItemProcessing(itemId, false);
      }
    },
    [updateQuantity, setItemProcessing, showRecentUpdate, setError]
  );

  const safeRemoveFromCart = useCallback(
    async (itemId: string) => {
      setItemProcessing(itemId, true);
      try {
        await new Promise(resolve => setTimeout(resolve, 300));
        removeFromCart(itemId);
      } catch (error) {
        setError('Failed to remove item');
      } finally {
        setItemProcessing(itemId, false);
      }
    },
    [removeFromCart, setItemProcessing, setError]
  );

  return {
    items,
    clearCart,
    getCartTotal,
    getCartCount,
    safeUpdateQuantity,
    safeRemoveFromCart,
    processingItems,
    recentlyUpdated,
  };
}
