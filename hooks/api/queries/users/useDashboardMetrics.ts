import request from "@/utils/api";
import { QUERYKEYS } from "@/utils/query-keys";
import { useQuery } from "react-query";

type AssessmentData = {
  totalAssessments: number;
  openAssessments: number;
  closedAssessments: number;
  assessmentsByCadre: { JCHEW: number; CHEW: number; CHO: number };
};

type SubmissionsData = {
  totalSubmissions: number;
  completedSubmissions: number;
  lateSubmissions: number;
  submissionsByAssessment: Record<string, unknown>;
};

// type DecisionsData = {
//   totalDecisions: number;
//   decisionsByPractitioner: Record<string, number>;
// };

// type FacilitiesData = {
//   totalFacilities: number;
//   facilitiesByType: {
//     public: number;
//     private: number;
//   };
// };

type EBooksData = {
  totalEBooks: number;
  totalVersions: number;
  versionsByBookStatus: Record<
    string,
    {
      PUBLISHED?: number;
      DRAFT?: number;
    }
  >;
};

type DashboardData = {
  assessment: AssessmentData;
  submissions: SubmissionsData;
  // decisions: DecisionsData;
  // facilities: FacilitiesData;
  ebooks: EBooksData;
};

export const fetchMetrics = async (): Promise<DashboardData> => {
  const assesmentReques: Promise<AssessmentData> = request(
    "GET",
    `/stats/assessments`
  );
  const submissionReques: Promise<SubmissionsData> = request(
    "GET",
    `/stats/submissions`
  );
  // const decisionsReques: Promise<DecisionsData> = request(
  //   "GET",
  //   `/stats/decisions`
  // );
  // const facilitiesReques: Promise<FacilitiesData> = request(
  //   "GET",
  //   `/stats/facilities`
  // );
  const ebooksReques: Promise<EBooksData> = request("GET", `/stats/ebooks`);
  const response = await Promise.all([
    assesmentReques,
    submissionReques,
    // decisionsReques,
    // facilitiesReques,
    ebooksReques,
  ]);
  return {
    assessment: response[0],
    submissions: response[1],
    // decisions: response[2],
    // facilities: response[2],
    ebooks: response[2],
  };
};

export const useDashboardMetrics = (page: number = 1, perPage: number = 10) => {
  const queryKey = [QUERYKEYS.DASHBOARDMETRICS, page, perPage];
  const query = useQuery(queryKey, () => fetchMetrics(), {
    retry: 1,
    keepPreviousData: true,
  });

  return {
    ...query,
    // auditLogs: query?.data?.data?.data,
  };
};
