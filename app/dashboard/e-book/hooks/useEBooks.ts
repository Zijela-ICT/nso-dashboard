import { createEbooks, getEbooks } from "@/services/book.services";
import { useMutation, useQuery, useQueryClient } from "react-query";

const useEBooks = () => {
  const queryClient = useQueryClient();
  const key = "E_BOOKS";

  // Queries
  const query = useQuery<{ bookType: string }[]>({
    queryKey: [key],
    queryFn: async () => (await getEbooks()).data.data,
  });

  // Mutations
  const mutation = useMutation({
    mutationFn: createEbooks,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: [key] });
    },
  });

  return {
    ...query,
    mutation,
  };
};

export default useEBooks;
