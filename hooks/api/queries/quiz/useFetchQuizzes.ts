import request from "@/utils/api";
import { QUERYKEYS } from "@/utils/query-keys";
import { useQuery } from "react-query";

type QuizQuestion = {
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

type QuizDataResponse = {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  questions: QuizQuestion[];
};

type QuizResp = {
  status: string;
  message: string;
  data: {
    data: QuizDataResponse[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

export const FetchQuizzes = async (
  page: number = 1,
  perPage: number = 50
): Promise<QuizResp> => {
  return request("GET", `/quizzes?page=${page}&limit=${perPage}`);
};

export const useFetchQuizzes = (page: number = 1, perPage: number = 50) => {
  const queryKey = [QUERYKEYS.FETCHQUIZZES, page, perPage];
  return useQuery(queryKey, () => FetchQuizzes(page, perPage), {
    retry: 1,
    keepPreviousData: true,
  });
};
