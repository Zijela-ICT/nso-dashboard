import { useMemo } from "react";
import { useFetchProfile } from "../api/queries/settings";

type PermissionString = string;
export type PermissionCheck = PermissionString | PermissionString[];
export const usePermissions = () => {
  const { data: profileData, isLoading: isProfileLoading } = useFetchProfile();

  const userPermissions = useMemo(() => {
    if (!profileData?.data?.roles) return new Set<string>();

    const permissionSet = new Set<string>();
    profileData.data.roles.forEach((role) => {
      role.permissions.forEach((permission) => {
        permissionSet.add(permission.permissionString);
      });
    });

    return permissionSet;
  }, [profileData]);

  const hasPermission = (permission: PermissionCheck): boolean => {
    if (!permission) return false;

    if (Array.isArray(permission)) {
      return permission.every((p) => userPermissions.has(p));
    }

    return userPermissions.has(permission);
  };

  return {
    hasPermission,
    permissions: userPermissions,
    isLoading: isProfileLoading
  };
};
