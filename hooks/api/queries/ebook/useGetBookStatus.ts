import { getStatus } from "@/utils/book.services";
import { QUERYKEYS } from "@/utils/query-keys";
import { useQuery } from "react-query";

export const useGetBookStatus = (id: string) => {
  const queryKey = [QUERYKEYS.BOOKSTATUS, id];
    const isValidId =id !== 'undefined' &&  id !== undefined && id !== null && id.trim() !== '';
    console.log('id', id)
    return useQuery(queryKey, () => getStatus(id), {
    keepPreviousData: true,
    enabled: isValidId,
  });
};
