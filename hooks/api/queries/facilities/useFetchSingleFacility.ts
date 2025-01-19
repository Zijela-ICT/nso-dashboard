import request from "@/utils/api";
import { QUERYKEYS } from "@/utils/query-keys";
import { useQuery } from "react-query";

type FacilityResp = {
  success: boolean;
  message: string;
  data: {
    id: number;
    name: string;
    type: string;
    location: string;
    status: string | null;
    longitude: string;
    contact: string;
    latitude: string;
    createdAt: string;
    updatedAt: string;
    address: string;
    careLevel: string;
  };
};

export const FetchSingleFacility = async (
  id: string
): Promise<FacilityResp> => {
  return request("GET", `/facilities/${id}`);
};
export const useFetchSingleFacility = (id: string) => {
  const queryKey = [QUERYKEYS.FETCHSINGLEFACILITY, id];
  return useQuery(queryKey, () => FetchSingleFacility(id), {
    enabled: !!id,
    retry: 1
  });
};
