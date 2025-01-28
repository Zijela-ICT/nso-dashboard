import { AxiosError, AxiosResponse } from "axios";
import { useMutation, useQueryClient } from "react-query";
import { QUERYKEYS } from "@/utils/query-keys";

import request from "@/utils/api";

type ResponseType = {
  success: boolean;
  data: string;
};

type InputType = {
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correctOption: string;
};

type ErrorType = { error: string; success: boolean };

const CreateQuestion = (
  input: InputType
): Promise<AxiosResponse<ResponseType>> => {
  return request(
    "POST",
    `/quizzes/questions`,
    {
      question: input.question,
      option1: input.option1,
      option2: input.option2,
      option3: input.option3,
      option4: input.option4,
      correctOption: input.correctOption
    },
    true
  );
};

const useCreateQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation<
    AxiosResponse<ResponseType>,
    AxiosError<ErrorType>,
    InputType
  >((input: InputType) => CreateQuestion(input), {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.FETCHQUIZQUESTIONS]
      });
    }
  });
};

export { useCreateQuestion };
