import request from "@/utils/api";
import { QUERYKEYS } from "@/utils/query-keys";
import { useQuery } from "react-query";

export interface iAuditLog {
  id: 1276;
  createdAt: string;
  action: string;
  isSuccess: boolean;
  resource: string;
  resourceType: string | null;
  resourceId: string | null;
  changes: string | null;
  metadata: {
    ipAddress: string;
    userAgent: string;
    error: string | null;
  };
  user: {
    id: number;
    regNumber: string | null;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    mobile: string | null;
    cadre: string;
    regExpiration: string | null;
    isChprbnBlocked: boolean;
    isDeactivated: boolean;
    avatar: string | null;
    isEmailConfirmed: boolean;
    twoFASecret: string | null;
    isFirstLogin: boolean;
    twoFaMethod: string | null;
    isTwoFAEnabled: boolean;
    createdAt: string;
    updatedAt: string;
    fcmTokens: string | null;
    deletedAt: string | null;
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
