import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "react-query";
import request from "@/utils/api";
import { QUERYKEYS } from "@/utils/query-keys";

type ResponseType = {
  success: boolean;
  data: string;
};

type ErrorType = { error: string; success: boolean };

const DeleteFacility = (params: { id: string }): Promise<ResponseType> => {
  return request(
    "DELETE",
    `/facilities/${params.id}`,
    null,
    true,
    true,
    "Facility deleted successfully"
  );
};

const useDeleteFacility = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, AxiosError<ErrorType>, { id: string }>(
    (params) => DeleteFacility(params),
    {
      onSuccess: () => {
        // Invalidate teams query to refetch the list
        queryClient.invalidateQueries(QUERYKEYS.FETCHFACILITIES);
      }
    }
  );
};

export { useDeleteFacility };
