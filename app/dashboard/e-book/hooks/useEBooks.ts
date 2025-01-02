import { createEbooks, getEbooks } from "@/utils/book.services";
import { useMutation, useQuery, useQueryClient } from "react-query";

export type IChprbnBook = {
  bookType: string;
  id: number;
  title: string;
  versions: {
    id: number;
    version: number;
  }[];
};

const useEBooks = () => {
  const queryClient = useQueryClient();
  const key = "E_BOOKS";

  // Queries
  const query = useQuery<IChprbnBook[]>({
    queryKey: [key],
    queryFn: async () => (await getEbooks()).data,
  });

  // Mutations
  const mutation = useMutation({
    mutationFn: createEbooks,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [key] });
    },
  });

  return {
    ...query,
    mutation,
  };
};

export default useEBooks;
