import { AxiosError, AxiosResponse } from "axios";
import { useMutation } from "react-query";

import request from "@/utils/api";

type ResponseType = {
  success: boolean;
  data: string;
};

type InputType = {
  email: string;
  password: string;
};

type ErrorType = { error: string; success: boolean };

const Login = (input: InputType): Promise<AxiosResponse<ResponseType>> => {
  return request(
    "POST",
    `/auth/login`,
    {
      email: input.email,
      password: input.password
    },
    false
  );
};

const useLogin = () => {
  return useMutation<
    AxiosResponse<ResponseType>,
    AxiosError<ErrorType>,
    InputType
  >((input: InputType) => Login(input));
};

export { useLogin };
