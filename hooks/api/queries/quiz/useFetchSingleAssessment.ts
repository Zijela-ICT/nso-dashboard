import request from "@/utils/api";
import { QUERYKEYS } from "@/utils/query-keys";
import { useQuery } from "react-query";

type SingleAssessmentResp = {
  status: string;
  message: string;
  data: {
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
    quizzes: [
      {
        id: number;
        name: string;
      }
    ];
    audience: [
      {
        id: 15;
      },
      {
        id: 14;
      }
    ];
  };
};

export const FetchSingleAssessment = async (
  id: string
): Promise<SingleAssessmentResp> => {
  return request("GET", `/quizzes/assessments/${id}`);
};
export const useFetchSingleAssessment = (id: string) => {
  const queryKey = [QUERYKEYS.FETCHSINGLEASSESSMENT, id];
  return useQuery(queryKey, () => FetchSingleAssessment(id), {
    enabled: !!id,
    retry: 1
  });
};
