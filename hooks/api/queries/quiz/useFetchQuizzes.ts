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
  perPage: number = 50,
  search?: string
): Promise<QuizResp> => {
  return request(
    "GET",
    `/quizzes?page=${page}&limit=${perPage}${
      search && search.length > 3 ? `&search=${search}` : ""
    }`
  );
};

export const useFetchQuizzes = (
  page: number = 1,
  perPage: number = 50,
  search?: string
) => {
  const queryKey = [QUERYKEYS.FETCHQUIZZES, page, perPage, search];
  return useQuery(queryKey, () => FetchQuizzes(page, perPage, search), {
    retry: 1,
    keepPreviousData: true,
  });
};
