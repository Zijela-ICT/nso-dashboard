import { AxiosError, AxiosResponse } from "axios";
import { useMutation, useQueryClient } from "react-query";
import { QUERYKEYS } from "@/utils/query-keys";
import { unLockBook} from "@/utils/book.services";

type ResponseType = {
  success: boolean;
  data: string;
};

type InputType = {
  id: string;
};

type ErrorType = { error: string; success: boolean };

const useUnLockBook = () => {
  const queryClient = useQueryClient();
  return useMutation<
    AxiosResponse<ResponseType>,
    AxiosError<ErrorType>,
    InputType
  >((input: InputType) => unLockBook(input.id), {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.BOOKSTATUS],
      });
    },
  });
};

export { useUnLockBook };
