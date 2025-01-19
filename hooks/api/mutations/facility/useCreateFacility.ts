import { AxiosError, AxiosResponse } from "axios";
import { useMutation, useQueryClient } from "react-query";
import { QUERYKEYS } from "@/utils/query-keys";

import request from "@/utils/api";

type ResponseType = {
  success: boolean;
  data: string;
};

type InputType = {
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
const CreateFacility = (
  input: InputType
): Promise<AxiosResponse<ResponseType>> => {
  return request(
    "POST",
    `/facilities`,
    {
      name: input.name,
      type: input.type,
      careLevel: input.careLevel,
      status: input.status,
      location: input.location,
      //   contact: input.contact,
      longitude: input.longitude,
      latitude: input.latitude,
      address: input.address
    },
    true
  );
};

const useCreateFacility = () => {
  const queryClient = useQueryClient();
  return useMutation<
    AxiosResponse<ResponseType>,
    AxiosError<ErrorType>,
    InputType
  >((input: InputType) => CreateFacility(input), {
    onSuccess: async () => {
      await queryClient.invalidateQueries(QUERYKEYS.FETCHFACILITIES);
    }
  });
};

export { useCreateFacility };
