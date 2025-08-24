import request from "@/utils/api";
import { QUERYKEYS } from "@/utils/query-keys";
import { useQuery } from "react-query";

export type FacilitiesDataResponse = {
  id: number;
  name: string;
  type: string;
  location: string;
  address: string;
  status: string | null;
  longitude: string;
  latitude: string;
  createdAt: string;
  updatedAt: string;
};

type FacilitesResp = {
  success: boolean;
  message: string;
  data: {
    data: FacilitiesDataResponse[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

export const FetchFacilities = async (
  page: number = 1,
  perPage: number = 10,
  search: string
): Promise<FacilitesResp> => {
  return request(
    "GET",
    `/facilities?page=${page}&limit=${perPage}${
      search && search.length > 3 ? `&search=${search}` : ""
    }`
  );
};

export const useFetchFacilities = (
  page: number = 1,
  perPage: number = 10,
  search: string
) => {
  const queryKey = [QUERYKEYS.FETCHFACILITIES, page, perPage, search];
  return useQuery(queryKey, () => FetchFacilities(page, perPage, search), {
    retry: 1,
    keepPreviousData: true,
  });
};
