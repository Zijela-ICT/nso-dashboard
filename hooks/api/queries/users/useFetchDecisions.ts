import request from "@/utils/api";
import { QUERYKEYS } from "@/utils/query-keys";
import { useQuery } from "react-query";

export type SystemDecisionResponse = {
  id: number;
  patientDetails: {
    age: number;
    name: string;
    id: string;
  };
  caseDescription: string;
  decisionDetails: {
    diagnosis: string[];
    recommendedProcedure: string[];
  };
  createdAt: string;
  updatedAt: string;
  practitioner: {
    id: number;
    firstName: string;
    lastName: string;
    cadre: string;
  };
};

type SystemDecisionResp = {
  success: boolean;
  message: string;
  data: {
    data: SystemDecisionResponse[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

export const FetchSystemUsers = async (
  page: number = 1,
  perPage: number = 10
): Promise<SystemDecisionResp> => {
  return request("GET", `/decisions/system?page=${page}&limit=${perPage}`);
};

export const useFetchDecisions = (page: number = 1, perPage: number = 10) => {
  const queryKey = [QUERYKEYS.DECISONS, page, perPage];
  const query = useQuery(queryKey, () => FetchSystemUsers(page, perPage), {
    retry: 1,
    keepPreviousData: true,
  });

  return {
    ...query,
    decisions: query?.data?.data?.data,
  };
};
