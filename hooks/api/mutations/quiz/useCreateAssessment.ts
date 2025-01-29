import { AxiosError, AxiosResponse } from "axios";
import { useMutation, useQueryClient } from "react-query";
import { QUERYKEYS } from "@/utils/query-keys";
import request from "@/utils/api";

type ResponseType = {
  success: boolean;
  data: string;
};

// Base type with common properties
type BaseAssessmentInput = {
  name: string;
  quizIds: number[];
  startDate: string;
  endDate: string;
  duration: number;
  dayReminderSchedule: number[];
};

// Type for audience-based assessment
type AudienceAssessment = BaseAssessmentInput & {
  audience: number[];
  cadre?: never; // Explicitly prevent cadre from being used
};

// Type for cadre-based assessment
type CadreAssessment = BaseAssessmentInput & {
  cadre: "JCHEW" | "CHEW" | "CHO";
  audience?: never; // Explicitly prevent audience from being used
};

// Union type that allows either audience or cadre, but not both
type InputType = AudienceAssessment | CadreAssessment;

type ErrorType = {
  error: string;
  success: boolean;
};

// Type guard to check if assessment is audience-based
const isAudienceAssessment = (
  input: InputType
): input is AudienceAssessment => {
  return "audience" in input && Array.isArray(input.audience);
};

// Type guard to check if assessment is cadre-based
const isCadreAssessment = (input: InputType): input is CadreAssessment => {
  return "cadre" in input && typeof input.cadre === "string";
};

const CreateAssessment = (
  input: InputType
): Promise<AxiosResponse<ResponseType>> => {
  // Validate that the input follows our constraints
  if (isAudienceAssessment(input) && isCadreAssessment(input)) {
    throw new Error("Assessment cannot have both audience and cadre");
  }

  if (!isAudienceAssessment(input) && !isCadreAssessment(input)) {
    throw new Error("Assessment must have either audience or cadre");
  }

  return request(
    "POST",
    `/quizzes/assessments`,
    {
      name: input.name,
      quizIds: input.quizIds,
      ...(isAudienceAssessment(input)
        ? { audience: input.audience }
        : { cadre: input.cadre }),
      startDate: input.startDate,
      endDate: input.endDate,
      duration: input.duration,
      dayReminderSchedule: input.dayReminderSchedule
    },
    true
  );
};

const useCreateAssessment = () => {
  const queryClient = useQueryClient();
  return useMutation<
    AxiosResponse<ResponseType>,
    AxiosError<ErrorType>,
    InputType
  >((input: InputType) => CreateAssessment(input), {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.FETCHASSESSMENTS]
      });
    }
  });
};

export {
  useCreateAssessment,
  type InputType,
  type AudienceAssessment,
  type CadreAssessment
};
