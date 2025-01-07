import { useEffect } from "react";
import { useRouter } from "next/router";
import { PermissionCheck, usePermissions } from "./usePermissions";

interface UseRequirePermissionOptions {
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export const useRequirePermission = (
  requiredPermission: PermissionCheck,
  options: UseRequirePermissionOptions = {}
) => {
  const router = useRouter();
  const { hasPermission, isLoading } = usePermissions();
  const redirectPath = options.redirectTo || "/unauthorized";

  useEffect(() => {
    if (!isLoading && !hasPermission(requiredPermission)) {
      router.push(redirectPath);
    }
  }, [hasPermission, isLoading, requiredPermission, redirectPath, router]);

  return {
    isAuthorized: hasPermission(requiredPermission),
    isLoading
  };
};
