import { useAppContext } from '../context/AppContext';

const ROLE_PERMISSIONS = {
  supplier: [
    'product.view', 'product.create', 'product.edit', 'product.delete',
    'product.order.view'
  ],
  user: [
    'product.view',
    'order.create', 'order.view', 'order.delete'
  ]
} as const;

type Permission = typeof ROLE_PERMISSIONS[keyof typeof ROLE_PERMISSIONS][number];

export const usePermissions = () => {
  const { user } = useAppContext();
  
  const hasPermission = (permission: Permission): boolean => {
    if (!user?.role) return false;
    return ROLE_PERMISSIONS[user.role as keyof typeof ROLE_PERMISSIONS]?.includes(permission) || false;
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  };

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissions.every(permission => hasPermission(permission));
  };

  // Helper methods for common checks
  const canCreateProducts = () => hasPermission('product.create');
  const canEditProducts = () => hasPermission('product.edit');
  const canDeleteProducts = () => hasPermission('product.delete');
  const canViewOrders = () => hasPermission('order.view');
  const canCreateOrders = () => hasPermission('order.create');

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canCreateProducts,
    canEditProducts,
    canDeleteProducts,
    canViewOrders,
    canCreateOrders,
  };
};