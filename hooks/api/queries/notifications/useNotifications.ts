import request from "@/utils/api";
import { QUERYKEYS } from "@/utils/query-keys";
import { useQuery } from "react-query";

export type iNotification = {
  id: number;
  subject: string;
  content: string;
  unread: boolean;
  createdAt: string;
};

type NotificationsResp = {
  success: boolean;
  message: string;
  data: {
    data: iNotification[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

export const FetchNotifications = async (
  page: number = 1,
  perPage: number = 10
): Promise<NotificationsResp> => {
  return request("GET", `/notifications?page=${page}&limit=${perPage}`);
};

export const MarkNotificationsAsRead = async (notificationIds: number[]) => {
  return request("PATCH", `/notifications`, { notificationIds });
};

export const useNotifications = (page: number = 1, perPage: number = 10) => {
  const queryKey = [QUERYKEYS.FETCHNOTIFICATIONS, page, perPage];
  return useQuery(queryKey, () => FetchNotifications(page, perPage), {
    retry: 1,
    keepPreviousData: true,
  });
};
