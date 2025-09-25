import { useQuery } from "react-query";
import { QUERYKEYS } from "@/utils/query-keys";
import request from "@/utils/api";

export interface SubmissionDetailsResponse {
  status: string;
  message: string;
  data: {
    user: {
      id: number;
      firstName: string;
      lastName: string;
      email: string;
      cadre: string;
    };
    submission: {
      id: number;
      startDate: string;
      submissionDate: string;
      isLateSubmission: boolean;
      totalScore: string;
      isCompleted: boolean;
      duration: string;
    };
    assessment: {
      id: number;
      name: string;
      startDate: string;
      endDate: string;
    };
    quizzes: {
      quizId: number;
      quizName: string;
      quizScore: number;
      questions: Array<{
        questionId: number;
        question: string;
        options: {
          option1: string;
          option2: string;
          option3: string;
          option4: string;
        };
        selectedOption: string;
        correctOption: string;
        isCorrect: boolean;
      }>;
    }[];
  };
}

const fetchSubmissionDetails = async (
  submissionId: number
): Promise<SubmissionDetailsResponse> => {
  return await request(
    "GET",
    `/quizzes/admin/submissions/${submissionId}/details`
  );
};

export const useFetchSubmissionDetails = (submissionId: number) => {
  return useQuery<SubmissionDetailsResponse, Error>(
    [QUERYKEYS.FETCHSUBMISSIONDETAILS, submissionId],
    () => fetchSubmissionDetails(submissionId),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      enabled: !!submissionId,
    }
  );
};
