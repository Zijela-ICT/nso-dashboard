import { useMutation, useQueryClient } from "react-query";
import { QUERYKEYS } from "@/utils/query-keys";
import { showToast } from "@/utils/toast";
import request from "@/utils/api";

export interface CloseSubmissionResponse {
  status: string;
  message: string;
  data: unknown;
}

type ErrorType = {
  message: string;
  status: boolean;
  statusCode: number;
};

const closeSubmission = async ({
  userId,
  assessmentId,
}: {
  userId: number;
  assessmentId: number;
}): Promise<CloseSubmissionResponse> => {
  return await request("POST", `/quizzes/admin/close-submission/${userId}/${assessmentId}`);
};

export const useCloseSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation<
    CloseSubmissionResponse,
    ErrorType,
    { userId: number; assessmentId: number }
  >(
    closeSubmission,
    {
      onSuccess: () => {
        showToast("Submission closed successfully", "success");
        queryClient.invalidateQueries([QUERYKEYS.FETCHASSESSMENTS]);
      },
      onError: (error) => {
        const errorMessage = error?.message || "Failed to close submission";
        showToast(errorMessage, "error");
      },
    }
  );
};