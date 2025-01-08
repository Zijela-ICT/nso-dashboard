import { AxiosError } from "axios";
import { useMutation } from "react-query";

import request from "@/utils/api";

type ResponseType = {
  status: string;
  message: string;
  data: {
    token: string;
    requirePasswordReset: boolean;
    roles: string[];
  };
};

type InputType = {
  email: string;
  password: string;
  otp: string;
};

type ErrorType = { error: string; success: boolean };

const VerifyPasswordReset = (input: InputType): Promise<ResponseType> => {
  return request(
    "POST",
    `/auth/password/verify`,
    {
      email: input.email,
      password: input.password,
      otp: input.otp
    },
    true,
    true,
    "Password reset successful"
  );
};

const useVerifyPasswordReset = () => {
  return useMutation<ResponseType, AxiosError<ErrorType>, InputType>(
    (input: InputType) => VerifyPasswordReset(input)
  );
};

export { useVerifyPasswordReset };
