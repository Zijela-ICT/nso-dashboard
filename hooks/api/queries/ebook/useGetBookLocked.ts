import { getStatus } from "@/utils/book.services";
import { QUERYKEYS } from "@/utils/query-keys";
import { useQuery } from "react-query";

export const useGetBookStatus = (id: string) => {
  const queryKey = [QUERYKEYS.BOOKSTATUS, id];
  return useQuery(queryKey, () => getStatus(id), {
    retry: 1,
    keepPreviousData: true,
  });
};
