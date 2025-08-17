import { useQuery } from "react-query";
import { QUERYKEYS } from "@/utils/query-keys";
import request from "@/utils/api";

export interface CompletedAssessment {
  id: number;
  startDate: string;
  submissionDate: string;
  isLateSubmission: boolean;
  totalScore: string;
  isCompleted: boolean;
  assessment: {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
  };
}

export interface CompletedAssessmentsResponse {
  status: string;
  message: string;
  data: {
    data: CompletedAssessment[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

const fetchCompletedAssessments = async (
  page: number = 1,
  limit: number = 10
): Promise<CompletedAssessmentsResponse> => {
  return await request(
    "GET",
    `/quizzes/admin/assessments/completed?page=${page}&limit=${limit}`
  );
};

export const useFetchCompletedAssessments = (
  page: number = 1,
  limit: number = 10
) => {
  return useQuery<CompletedAssessmentsResponse, Error>(
    [QUERYKEYS.FETCHASSESSMENTS, "completed", page, limit],
    () => fetchCompletedAssessments(page, limit),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    }
  );
};
