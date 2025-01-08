"use client";
import { Button, Input } from "@/components/ui";
import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthLayout, OtpSection } from "@/components/shared";
import { EmailSchema, ForgotPasswordSchema } from "@/validation-schema/auth";
import { useFormik } from "formik";
import {
  useInitiatePasswordReset,
  useVerifyPasswordReset
} from "@/hooks/api/mutations/auth";

const Page = () => {
  const initiateReset = useInitiatePasswordReset();
  const verifyReset = useVerifyPasswordReset();
  const navigation = useRouter();

  const searchParams = useSearchParams();

  const params = new URLSearchParams(searchParams);
  const rawEmail = params.get("email");
  const email = rawEmail
    ? decodeURIComponent(rawEmail.replace(/\+/g, "%2B"))
    : "";

  const formik = useFormik({
    initialValues: {
      email: email || "",
      otp: "",
      password: ""
    },
    validationSchema:
      searchParams.get("mode") === "password"
        ? ForgotPasswordSchema
        : EmailSchema,
    onSubmit: (values) => {
      if (searchParams.get("mode") === "password") {
        verifyReset.mutate(
          {
            email: email || values.email,
            otp: values.otp,
            password: values.password
          },
          {
            onSuccess: () => {
              navigation.push("/login");
            }
          }
        );
        return;
      }
      initiateReset.mutate(
        {
          email: values.email
        },
        {
          onSuccess: () => {
            navigation.push(
              "/forgot-password?mode=password&email=" +
             encodeURIComponent(values.email).replace(/\+/g, '%2B')
            );
          }
        }
      );
    }
  });

  return (
    <>
      {searchParams.get("mode") === "password" ? (
        <OtpSection
          email={email || formik.values.email}
          otp={formik.values.otp}
          hasPassword
          password={formik.values.password}
          handlePasswordChange={formik.handleChange}
          handlePasswordBlur={formik.handleBlur}
          error={
            formik.errors.password && formik.touched.password
              ? formik.errors.password
              : ""
          }
          handleSubmit={formik.handleSubmit}
          isLoading={verifyReset.isLoading}
          setOtp={(otp) => {
            formik.setFieldValue("otp", otp);
          }}
        />
      ) : (
        <AuthLayout>
          <div className="w-full rounded-2xl drop-shadow-sm bg-white">
            <form className="w-full" onSubmit={formik.handleSubmit}>
              <div className="p-6 md:p-12 flex flex-col items-start gap-4">
                <div>
                  <h2 className="text-[#212B36] font-medium text-xl md:text-2xl">
                    Reset your password
                  </h2>
                  <p>
                    Enter your email to receive an OTP to reset your password
                  </p>
                </div>

                <Input
                  name="email"
                  placeholder="Enter your email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  errorMessage={
                    formik.errors.email && formik.touched.email
                      ? formik.errors.email
                      : ""
                  }
                />

                <Button
                  type="submit"
                  disabled={!formik.isValid}
                  isLoading={initiateReset.isLoading}>
                  Proceed
                </Button>
              </div>
            </form>
          </div>
        </AuthLayout>
      )}
    </>
  );
};


export default Page;
