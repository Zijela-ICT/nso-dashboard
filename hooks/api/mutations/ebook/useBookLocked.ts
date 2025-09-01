import { AxiosError, AxiosResponse } from "axios";
import { useMutation, useQueryClient } from "react-query";
import { QUERYKEYS } from "@/utils/query-keys";
import { lockBook } from "@/utils/book.services";

type ResponseType = {
  success: boolean;
  data: string;
};

type InputType = {
  id: string;
};

type ErrorType = { error: string; success: boolean };

const useLockBook = () => {
  const queryClient = useQueryClient();
  return useMutation<
    AxiosResponse<ResponseType>,
    AxiosError<ErrorType>,
    InputType
  >((input: InputType) => lockBook(input.id), {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.BOOKSTATUS],
      });
    },
  });
};

export { useLockBook };
