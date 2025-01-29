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
  perPage: number = 10
): Promise<AssessmentResp> => {
  return request("GET", `/quizzes/assessments?page=${page}&limit=${perPage}`);
};

export const useFetchAssessments = (page: number = 1, perPage: number = 10) => {
  const queryKey = [QUERYKEYS.FETCHASSESSMENTS, page, perPage];
  return useQuery(queryKey, () => FetchAssessments(page, perPage), {
    retry: 1,
    keepPreviousData: true
  });
};
