import request from "@/utils/api";
import { QUERYKEYS } from "@/utils/query-keys";
import { useQuery } from "react-query";

export type QuestionsDataResponse = {
  id: number;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correctOption: string;
  createdAt: string;
  updatedAt: string;
};

type QuestionResp = {
  success: boolean;
  message: string;
  data: {
    data: QuestionsDataResponse[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

export const FetchQuestions = async (
  page: number = 1,
  perPage: number = 10
): Promise<QuestionResp> => {
  return request("GET", `/quizzes/questions?page=${page}&limit=${perPage}`);
};

export const useFetchQuestions = (page: number = 1, perPage: number = 10) => {
  const queryKey = [QUERYKEYS.FETCHQUIZQUESTIONS, page, perPage];
  return useQuery(queryKey, () => FetchQuestions(page, perPage), {
    retry: 1,
    keepPreviousData: true
  });
};
