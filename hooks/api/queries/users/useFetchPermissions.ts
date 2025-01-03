import request from "@/utils/api";
import { QUERYKEYS } from "@/utils/query-keys";
import { useQuery } from "react-query";

type PermissionsDataResponse = {
  id: number;
  permissionString: string;
};

type PermissionResp = {
  success: boolean;
  message: string;
  data: PermissionsDataResponse[];
};

export const FetchPermissions = async (): Promise<PermissionResp> => {
  return request("GET", `/admin/roles/permissions`);
};

export const useFetchPermissions = () => {
  const queryKey = [QUERYKEYS.FETCHPERMISSIONS];
  return useQuery(queryKey, () => FetchPermissions(), {
    retry: 1
  });
};
