import request from "@/utils/api";
import { QUERYKEYS } from "@/utils/query-keys";
import { useQuery } from "react-query";

type AssessmentResp = {
  success: boolean;
  message: string;
  data: {
    data: [
      {
        id: number;
        name: string;
        startDate: string;
        endDate: string;
        duration: number;
        dayReminderSchedule: string[];
        cadre: string | null;
        isOpen: boolean;
        createdAt: string;
        updatedAt: string;
      }
    ];
    totalCount: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

export const FetchAssessments = async (
  page: number = 1,
  perPage: number = 10,
  search: string = ""
): Promise<AssessmentResp> => {
  return request(
    "GET",
    `/quizzes/assessments?page=${page}&limit=${perPage}${
      search.length > 3 ? `&search=${search}` : ""
    }`
  );
};

export const useFetchAssessments = (
  page: number = 1,
  perPage: number = 10,
  search: string = ""
) => {
  const queryKey = [QUERYKEYS.FETCHASSESSMENTS, page, perPage, search];
  return useQuery(queryKey, () => FetchAssessments(page, perPage, search), {
    retry: 1,
    keepPreviousData: true,
  });
};
