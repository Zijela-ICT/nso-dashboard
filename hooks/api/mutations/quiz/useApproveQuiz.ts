import { AxiosError, AxiosResponse } from "axios";
import { useMutation, useQueryClient } from "react-query";
import { QUERYKEYS } from "@/utils/query-keys";

import request from "@/utils/api";

type ResponseType = {
  success: boolean;
  data: string;
};

type InputType = {
  id: number;
  status: "APPROVED" | "UNAPPROVED";
};

type ErrorType = { error: string; success: boolean };

const ApproveQuiz = (
  input: InputType
): Promise<AxiosResponse<ResponseType>> => {
  return request(
    "PATCH",
    `/quizzes/${input.id}/approval`,
    { status: input.status },
    true
  );
};

const useApproveQuiz = () => {
  const queryClient = useQueryClient();
  return useMutation<
    AxiosResponse<ResponseType>,
    AxiosError<ErrorType>,
    InputType
  >((input: InputType) => ApproveQuiz(input), {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.FETCHQUIZZES],
      });
    },
  });
};

export { useApproveQuiz };
