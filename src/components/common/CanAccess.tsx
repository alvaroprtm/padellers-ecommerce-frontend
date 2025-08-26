import { ReactNode } from 'react';
import { usePermissions } from '../../hooks/usePermission';

interface CanAccessProps {
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  fallback?: ReactNode;
  children: ReactNode;
}

export const CanAccess = ({ 
  permission, 
  permissions = [], 
  requireAll = false, 
  fallback = null, 
  children 
}: CanAccessProps) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();

  let canAccess = false;

  if (permission) {
    canAccess = hasPermission(permission as any);
  } else if (permissions.length > 0) {
    canAccess = requireAll 
      ? hasAllPermissions(permissions as any)
      : hasAnyPermission(permissions as any);
  }

  return canAccess ? <>{children}</> : <>{fallback}</>;
};