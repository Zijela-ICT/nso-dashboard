import request from "@/utils/api";
import { QUERYKEYS } from "@/utils/query-keys";
import { useQuery } from "react-query";

export interface iAuditLog {
  id: number;
  createdAt: string;
  userId: number;
  action: string;
  resource: string;
  resourceType: string | null;
  resourceId: string | null;
  changes: string | null;
  metadata: {
    ipAddress: string;
    userAgent: string;
  };
}

type AppAuditResp = {
  success: boolean;
  message: string;
  data: {
    data: iAuditLog[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

export const fetchAuditLogs = async (
  page: number = 1,
  perPage: number = 10
): Promise<AppAuditResp> => {
  return request("GET", `/audit-logs?page=${page}&limit=${perPage}`);
};

export const useAuditLogs = (page: number = 1, perPage: number = 10) => {
  const queryKey = [QUERYKEYS.AUDITLOGS, page, perPage];
  const query = useQuery(queryKey, () => fetchAuditLogs(page, perPage), {
    retry: 1,
    keepPreviousData: true,
  });

  return {
    ...query,
    auditLogs: query?.data?.data?.data,
  };
};
