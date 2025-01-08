"use client";
import { Button, Input } from "@/components/ui";
import React, { Suspense } from "react";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/shared";
import { NewPasswordSchema } from "@/validation-schema/auth";
import { useFormik } from "formik";
import { usePasswordChange } from "@/hooks/api/mutations/auth";

const CompleteRegistration = () => {
  const resetPassword = usePasswordChange();
  const navigation = useRouter();

  const formik = useFormik({
    initialValues: {
      password: "",
      newPassword: ""
    },
    validationSchema: NewPasswordSchema,
    onSubmit: (values) => {
      resetPassword.mutate(
        {
          oldPassword: values.password,
          newPassword: values.newPassword
        },
        {
          onSuccess: (data) => {
            console.log("data", data);
            navigation.push("/dashboard/home");
          }
        }
      );
    }
  });

  return (
    <AuthLayout>
      <div className="w-full rounded-2xl drop-shadow-sm bg-white">
        <form className="w-full" onSubmit={formik.handleSubmit}>
          <div className="p-6 md:p-12 flex flex-col items-start gap-4">
            <div>
              <h2 className="text-[#212B36] font-medium text-xl md:text-2xl">
                Complete registration
              </h2>
              <p>Your email has been verified, kindly update your password</p>
            </div>

            <Input
              name="password"
              type="password"
              placeholder="Old Password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              errorMessage={
                formik.errors.password && formik.touched.password
                  ? formik.errors.password
                  : ""
              }
            />

            <Input
              name="newPassword"
              type="password"
              placeholder="New Password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.newPassword}
              errorMessage={
                formik.errors.newPassword && formik.touched.newPassword
                  ? formik.errors.newPassword
                  : ""
              }
            />

            <Button type="submit" disabled={!formik.isValid || !formik.dirty}>
              Proceed
            </Button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

const Page = () => {
  return (
    <Suspense>
      <CompleteRegistration />
    </Suspense>
  );
};

export default Page;
