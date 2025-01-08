"use client";
import { Button, Input, InputOTP, InputOTPSlot } from "@/components/ui";
import React from "react";
import { AuthLayout } from "@/components/shared";

type OtpSectionProps = {
  otp: string;
  email: string;
  setOtp: (otp: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleSubmit: (e: any) => void;
  isLoading: boolean;
  hasPassword?: boolean;
  password?: string;
  handlePasswordChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePasswordBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
};
const OtpSection = ({
  otp,
  setOtp,
  handleSubmit,
  isLoading,
  email,
  password,
  handlePasswordChange,
  error,
  handlePasswordBlur
}: OtpSectionProps) => {
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
                <span className="text-[#A8353A]">{email}</span> <br />
                You might need to check your spam folder
              </p>
            </div>
            <div>
              <label
                htmlFor="otp"
                className="text-[#637381] font-semibold text-sm ">
                Enter your OTP
              </label>
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
            </div>

            <Input
              label="New Password"
              name="password"
              type="password"
              placeholder="Enter your new Password"
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
              value={password}
              errorMessage={error}
            />
            <div>
              <p className="text-[#212B36] text-base font-normal">
                Didn’t get a code?{" "}
                <span className="text-[#A8353A]">Click to Resend</span>
              </p>
            </div>
            <Button
              type="submit"
              disabled={otp.length < 6 || !!error}
              isLoading={isLoading}>
              Verify
            </Button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export { OtpSection };
