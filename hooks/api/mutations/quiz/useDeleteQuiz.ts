import { useMutation, useQueryClient } from "react-query";
import { QUERYKEYS } from "@/utils/query-keys";
import { showToast } from "@/utils/toast";
import request from "@/utils/api";

type ResponseType = {
  success: boolean;
  message: string;
};

type ErrorType = {
  message: string;
  status: boolean;
  statusCode: number;
};

const deleteQuiz = async (quizId: number): Promise<ResponseType> => {
  return await request("DELETE", `/quizzes/${quizId}`);
};

export const useDeleteQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, ErrorType, number>(deleteQuiz, {
    onSuccess: () => {
      showToast("Quiz deleted successfully", "success");
      queryClient.invalidateQueries([QUERYKEYS.FETCHQUIZZES]);
    },
    onError: (error) => {
      const errorMessage = error?.message || "Failed to delete quiz";
      showToast(errorMessage, "error");
    },
  });
};
