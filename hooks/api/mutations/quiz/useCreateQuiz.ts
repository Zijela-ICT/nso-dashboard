import { AxiosError, AxiosResponse } from "axios";
import { useMutation, useQueryClient } from "react-query";
import { QUERYKEYS } from "@/utils/query-keys";

import request from "@/utils/api";

type ResponseType = {
  success: boolean;
  data: string;
};

type InputType = {
  name: string;
  description: string;
  questionIds: number[];
};

type ErrorType = { error: string; success: boolean };

const CreateQuiz = (input: InputType): Promise<AxiosResponse<ResponseType>> => {
  return request(
    "POST",
    `/quizzes`,
    {
      name: input.name,
      description: input.description,
      questionIds: input.questionIds
    },
    true
  );
};

const useCreateQuiz = () => {
  const queryClient = useQueryClient();
  return useMutation<
    AxiosResponse<ResponseType>,
    AxiosError<ErrorType>,
    InputType
  >((input: InputType) => CreateQuiz(input), {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.FETCHQUIZZES]
      });
    }
  });
};

export { useCreateQuiz };
