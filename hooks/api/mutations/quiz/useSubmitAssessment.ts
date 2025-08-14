import { useMutation, useQueryClient } from "react-query";
import { QUERYKEYS } from "@/utils/query-keys";
import { showToast } from "@/utils/toast";
import request from "@/utils/api";

export interface AssessmentSubmissionResponse {
  status: string;
  message: string;
  data: {
    id: number;
    score: number;
    startDate: string;
    submissionDate: string;
    isLateSubmission: boolean;
    isCompleted: boolean;
    remainingDuration: number;
    createdAt: string;
    updatedAt: string;
    assessment: {
      id: number;
      startDate: string;
      endDate: string;
      duration: number;
      isOpen: boolean;
      createdAt: string;
      updatedAt: string;
      quiz: {
        id: number;
        name: string;
        description: string;
        createdAt: string;
        updatedAt: string;
        questions: Array<{
          id: number;
          question: string;
          option1: string;
          option2: string;
          option3: string;
          option4: string;
          correctOption: string;
          createdAt: string;
          updatedAt: string;
        }>;
      };
    };
    user: {
      id: number;
    };
  };
}

type ErrorType = { 
  message: string; 
  status: boolean;
  statusCode: number;
};

const submitAssessment = async ({ 
  assessmentId, 
  isCompleted = false 
}: { 
  assessmentId: number; 
  isCompleted?: boolean; 
}): Promise<AssessmentSubmissionResponse> => {
  return await request("POST", `/quizzes/my_assessments/${assessmentId}?isCompleted=${isCompleted}`);
};

export const useSubmitAssessment = () => {
  const queryClient = useQueryClient();

  return useMutation<
    AssessmentSubmissionResponse, 
    ErrorType, 
    { assessmentId: number; isCompleted?: boolean }
  >(
    submitAssessment,
    {
      onSuccess: () => {
        showToast("Assessment submitted successfully", "success");
        queryClient.invalidateQueries([QUERYKEYS.FETCHASSESSMENTS]);
      },
      onError: (error) => {
        const errorMessage = error?.message || "Failed to submit assessment";
        showToast(errorMessage, "error");
      },
    }
  );
};
