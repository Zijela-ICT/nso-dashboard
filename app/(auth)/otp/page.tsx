"use client";
import { Button, Icon, Input, InputOTP, InputOTPSlot } from "@/components/ui";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthLayout } from "@/components/shared";
import { LoginSchema } from "@/validation-schema/auth";
import { useFormik } from "formik";
import { useLogin } from "@/hooks/api/mutations/auth";
import storageUtil from "@/utils/browser-storage";

const Login = ({
  
}) => {
  const navigation = useRouter();

  const searchParams = useSearchParams();
  const [otp, setOtp] = useState("");

  const email = searchParams.get("email") as string;

  const login = useLogin();

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    
  };

  return (
    <AuthLayout>
      <div className="w-full rounded-2xl drop-shadow-sm bg-white">
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="p-6 md:p-12 flex flex-col items-start gap-4">
            <div>
              <h2 className="text-[#212B36] font-medium text-xl md:text-2xl">
                Input OTP
              </h2>
              <p className="text-[#637381] text-base font-normal">
                We’ve sent a code to{" "}
                <span className="text-[#A8353A]">
                  oluwadolabomipeacel@gmail.com
                </span>{" "}
                <br />
                You might need to check your spam folder
              </p>
            </div>
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
              className="flex flex-row items-center justify-between w-full"
              containerClassName="w-full">
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTP>
            <div>
              <p className="text-[#212B36] text-base font-normal">
                Didn’t get a code?{" "}
                <span className="text-[#A8353A]">Click to Resend</span>
              </p>
            </div>
            <Button
              type="submit"
              disabled={otp.length < 6}
              isLoading={login.isLoading}>
              Verify
            </Button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;