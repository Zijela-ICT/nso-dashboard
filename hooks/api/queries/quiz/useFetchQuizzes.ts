import request from "@/utils/api";
import { QUERYKEYS } from "@/utils/query-keys";
import { useQuery } from "react-query";

type QuizDataResponse = {
  id: number;
  name: string;
  description: string;
};

type QuizResp = {
  success: boolean;
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
    keepPreviousData: true
  });
};
