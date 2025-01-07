import { PermissionCheck, usePermissions } from '@/hooks/custom/usePermissions';
import React from 'react';

interface WithPermissionProps {
  fallback?: React.ReactNode;
  LoadingComponent?: React.ComponentType;
}

export function withPermission<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredPermission: PermissionCheck,
  options: WithPermissionProps = {}
) {
  return function PermissionWrapper(props: P) {
    const { hasPermission, isLoading } = usePermissions();
    const { LoadingComponent } = options;
    
    if (isLoading) {
      return LoadingComponent ? <LoadingComponent /> : null;
    }

    if (!hasPermission(requiredPermission)) {
      return options.fallback || null;
    }

    return <WrappedComponent {...props} />;
  };
}