import request from "@/utils/api";
import { QUERYKEYS } from "@/utils/query-keys";
import { useQuery } from "react-query";
import { PermissionsDataResponse } from "./useFetchPermissions";

export type RoleDataResponse = {
  description?: string;
  id: number;
  name: string;
};

type RoleResp = {
  success: boolean;
  message: string;
  data: {
    id: number;
    name: string;
    permissions: PermissionsDataResponse[];
    users: {
      id: number;
      firstName: string;
      lastName: string;
      email: string;
    }[];
  };
};

export const FetchRole = async (id: number): Promise<RoleResp> => {
  return request("GET", `/admin/roles/${id}`);
};
export const useFetchRole = (id: number) => {
  const queryKey = [QUERYKEYS.FETCHROLE, id];
  return useQuery(queryKey, () => FetchRole(id), {
    enabled: !!id,
    retry: 1
  });
};
