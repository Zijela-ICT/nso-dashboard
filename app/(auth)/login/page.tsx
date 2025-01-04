"use client";
import { Button, Icon, Input } from "@/components/ui";
import React from "react";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/shared";
import { LoginSchema } from "@/validation-schema/auth";
import { useFormik } from "formik";
import { useInitiatePasswordReset, useLogin } from "@/hooks/api/mutations/auth";
import storageUtil from "@/utils/browser-storage";
import { CHPBRN_TOKEN } from "@/constants";

const Login = () => {
  const navigation = useRouter();

  const login = useLogin();
  const initiateReset = useInitiatePasswordReset();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      login.mutate(
        {
          email: values.email,
          password: values.password,
        },
        {
          onSuccess: (data) => {
            if (data.data.requirePasswordReset) {
              storageUtil.store("@chprbn", data.data.token);
              navigation.push(`/complete-registration?email=${encodeURIComponent(values.email)}`);s

              // initiateReset.mutate(
              //   {
              //     email: values.email
              //   },
              //   {
              //     onSuccess: () => {
              //       navigation.push(`/complete-registration?email=${encodeURIComponent(values.email)}`);
              //     }
              //   }
              // );
              return;
            }
            storageUtil.store("@chprbn", data.data.token);
            navigation.push("/dashboard/home");
          }
        }
      );
    },
  });

  return (
    <AuthLayout>
      <div className="w-full rounded-2xl drop-shadow-sm bg-white">
        <form className="w-full" onSubmit={formik.handleSubmit}>
          <div className="p-6 md:p-12 flex flex-col items-start gap-4">
            <div>
              <h2 className="text-[#212B36] font-medium text-xl md:text-2xl">
                Log in
              </h2>
              <p>Enter your details to log in</p>
            </div>
            <Input
              name="email"
              containerClassName="mt-4"
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
            <div className="flex flex-col items-end w-full gap-4">
              <Input
                name="password"
                type="password"
                placeholder="Enter your password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              <span
                className="text-[#F97066] font-normal text-xs cursor-pointer"
                onClick={() => navigation.push("/complete-registration")}>
                Forgot Password?
              </span>
            </div>
            <Button
              type="submit"
              disabled={!formik.isValid || !formik.dirty}
              isLoading={login.isLoading || initiateReset.isLoading}>
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
