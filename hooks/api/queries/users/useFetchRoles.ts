import request from "@/utils/api";
import { QUERYKEYS } from "@/utils/query-keys";
import { useQuery } from "react-query";

type RoleDataResponse = {
  id: number;
  name: string;
  users: number;
};

type RoleResp = {
  success: boolean;
  message: string;
  data: RoleDataResponse[];
};

export const FetchRoles = async (): Promise<RoleResp> => {
  return request("GET", `/admin/roles`);
};

export const useFetchRoles = () => {
  const queryKey = [QUERYKEYS.FETCHROLES];
  return useQuery(queryKey, () => FetchRoles(), {
    retry: 1
  });
};
