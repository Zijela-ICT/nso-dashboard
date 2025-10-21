import { AxiosError, AxiosResponse } from "axios";
import { useMutation, useQueryClient } from "react-query";
import { QUERYKEYS } from "@/utils/query-keys";
import { adminUnlockBook, unLockBook } from "@/utils/book.services";
import { toast } from "sonner";

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

const useUnLockBookByAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation<
    AxiosResponse<ResponseType>,
    AxiosError<ErrorType>,
    InputType
  >((input: InputType) => adminUnlockBook(input.id), {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.BOOKSTATUS],
      });
      toast.success("Book unlocked successfully by admin");
    },
  });
};

export { useUnLockBook, useUnLockBookByAdmin };
