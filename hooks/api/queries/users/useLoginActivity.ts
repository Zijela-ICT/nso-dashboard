import request from "@/utils/api";
import { QUERYKEYS } from "@/utils/query-keys";
import { useQuery } from "react-query";

export type LoginActivityData = {
  totalLogins: number;
  uniqueUsers: number;
  successfulLogins: number;
  failedLogins: number;
  loginsByCadre: {
    CHEW: number;
    JCHEW: number;
    CHO: number;
  };
  dailyStats: Array<{
    date: string;
    totalLogins: number;
    uniqueUsers: number;
    loginsByCadre: {
      CHEW?: number;
      JCHEW?: number;
      CHO?: number;
    };
  }>;
  dateRange: {
    startDate: string;
    endDate: string;
  };
};

export const fetchLoginActivity = async (
  startDate: string,
  endDate: string
): Promise<LoginActivityData> => {
  return request(
    "GET",
    `/stats/login-activity?startDate=${startDate}&endDate=${endDate}`
  );
};

export const useLoginActivity = (startDate: string, endDate: string) => {
  return useQuery<LoginActivityData>(
    [QUERYKEYS.LOGIN_ACTIVITY, startDate, endDate],
    () => fetchLoginActivity(startDate, endDate),
    {
      enabled: !!startDate && !!endDate,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};
