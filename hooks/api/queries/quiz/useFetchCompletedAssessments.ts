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

export interface SubmissionUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  cadre: string;
}

export interface Submission {
  id: number;
  startDate: string;
  submissionDate: string;
  totalScore: number | null;
  isCompleted: boolean;
  user: SubmissionUser;
}

export interface AssessmentDetails {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
}

export interface AssessmentID {
  status: string;
  message: string;
  data: {
    assessment: AssessmentDetails;
    submissions: {
      data: Submission[];
      totalCount: number;
      currentPage: number;
      totalPages: number;
      pageSize: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
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

const fetchAssessmentsID = async (
  page: number = 1,
  limit: number = 10,
  assessmentId: number
): Promise<AssessmentID> => {
  return await request(
    "GET",
    `/quizzes/admin/assessments/${assessmentId}/submissions?page=${page}&limit=${limit}`
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

export const useFetchAssessmentsID = (
  page: number = 1,
  limit: number = 10,
  assessmentId: number
) => {
  return useQuery<AssessmentID, Error>(
    [QUERYKEYS.FETCHASSESSMENTS, "completed", page, limit, assessmentId],
    () => fetchAssessmentsID(page, limit, assessmentId),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      enabled: !!assessmentId,
    }
  );
};
