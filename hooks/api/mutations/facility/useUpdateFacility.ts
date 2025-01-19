/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError, AxiosResponse } from "axios";
import { useMutation, useQueryClient } from "react-query";
import { QUERYKEYS } from "@/utils/query-keys";

import request from "@/utils/api";

type ResponseType = {
  success: boolean;
  data: string;
};

type InputType = {
  id: string;
  name: string;
  type: string;
  careLevel: string;
  status: string;
  location: string;
  contact: string;
  longitude: number;
  latitude: number;
  address: string;
};
type ErrorType = { error: string; success: boolean };

const UpdateFacility = (
  input: InputType | any
): Promise<AxiosResponse<ResponseType>> => {
  return request(
    "PATCH",
    `/facilities/${input.id}`,
    {
      name: input.name,
      type: input.type,
      careLevel: input.careLevel,
      status: input.status,
      location: input.location,
      contact: input.contact,
      longitude: input.longitude,
      latitude: input.latitude,
      address: input.address
    },
    true
  );
};

const useUpdateFacility = () => {
  const queryClient = useQueryClient();
  return useMutation<
    AxiosResponse<ResponseType>,
    AxiosError<ErrorType>,
    InputType
  >((input: InputType) => UpdateFacility(input), {
    onSuccess: async () => {
      await queryClient.invalidateQueries(QUERYKEYS.FETCHFACILITIES);
      await queryClient.invalidateQueries(QUERYKEYS.FETCHSINGLEFACILITY);
    }
  });
};

export { useUpdateFacility };
