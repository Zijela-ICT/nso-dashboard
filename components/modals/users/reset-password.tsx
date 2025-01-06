"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Input,
  Checkbox,
  InputOTP,
  InputOTPSlot
} from "@/components/ui";
import { useFormik } from "formik";
import { ResetPasswordSchema } from "@/validation-schema/auth";
import { useVerifyPasswordReset } from "@/hooks/api/mutations/auth";

const ResetPasswordModal = ({ openModal, setOpenModal, user }) => {
  const { mutate, isLoading: isLoadingCreateRole } = useVerifyPasswordReset();

  const formik = useFormik({
    initialValues: {
      name: "",
      newPassword: "",
      otp: ""
    },
    validationSchema: ResetPasswordSchema,
    onSubmit: (values) => {
      mutate(
        {
          email: values.name,
          password: values.newPassword,
          otp: values.otp
        },
        {
          onSuccess: () => {
            setOpenModal(false);
          }
        }
      );
    }
  });

  return (
    <AlertDialog open={openModal} onOpenChange={setOpenModal}>
      <AlertDialogContent className="max-w-md w-full md:max-w-[600px]">
        <AlertDialogHeader className="space-y-3 relative">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <AlertDialogTitle className="text-[#212B36] text-2xl font-normal">
                Reset Password
              </AlertDialogTitle>
              <AlertDialogDescription className="text-[#637381] text-base font-normal">
                Change the password for this user
              </AlertDialogDescription>
            </div>
            <button
              type="button"
              onClick={() => setOpenModal(false)}
              className="w-6 h-6 text-[#A4A7AE] hover:text-gray-600"
              aria-label="Close dialog">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </AlertDialogHeader>

        <form
          className="w-full flex flex-col gap-4"
          onSubmit={formik.handleSubmit}>
          <Input
            label="Name of User"
            name="name"
            placeholder="Enter user name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            errorMessage={formik.touched.name && formik.errors.name}
          />


        
          <Input
            label="New Password"
            name="newPassword"
            type="password"
            placeholder="Enter new password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.newPassword}
            errorMessage={
              formik.touched.newPassword && formik.errors.newPassword
            }
          />

          <InputOTP
            maxLength={6}
            value={formik.values.otp}
            onChange={formik.handleChange}
            className="flex flex-row items-center justify-between w-full"
            containerClassName="w-full">
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTP>

          <Button
            className="self-end mt-4 w-fit"
            type="submit"
            disabled={!formik.isValid || !formik.dirty || isLoadingCreateRole}>
            {isLoadingCreateRole ? "Resetting..." : "Reset"}
          </Button>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export { ResetPasswordModal };
