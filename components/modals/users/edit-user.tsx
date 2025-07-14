import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Icon,
  Input,
  MultiSelect,
} from "@/components/ui";
import { SystemUsersDataResponse } from "@/hooks/api/queries/users";
import { useFetchRoles } from "@/hooks/api/queries/users";
import { InputType, useUpdateUser } from "@/hooks/api/mutations/user";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { EditUserSchema } from "@/validation-schema/user";

interface EditUserModal {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  user: SystemUsersDataResponse;
}

const EditUser = ({ openModal, setOpenModal, user }: EditUserModal) => {
  const { mutate: updateUser, isLoading: isUpdating } = useUpdateUser();
  const { data: rolesData, isLoading: isLoadingRoles } = useFetchRoles();

  // Initialize with empty array for roles
  const [initialValues, setInitialValues] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    emailAddress: "",
    roles: [] as string[],
  });

  useEffect(() => {
    if (user) {
      const values = {
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phoneNumber: user.mobile || "",
        emailAddress: user.email || "",
        // Ensure roles is always an array
        roles: Array.isArray(user.roles)
          ? user.roles.map((role) => role.name)
          : [user.roles].filter(Boolean),
      };
      setInitialValues(values);
    }
  }, [user]);

  const formik = useFormik({
    initialValues,
    validationSchema: EditUserSchema,
    onSubmit: (values) => {
      const updates: InputType = {
        id: user.id,
      };

      if (values.firstName !== initialValues.firstName) {
        updates.first_name = values.firstName;
      }
      if (values.lastName !== initialValues.lastName) {
        updates.last_name = values.lastName;
      }
      if (values.phoneNumber !== initialValues.phoneNumber) {
        updates.mobile = values.phoneNumber;
      }
      if (values.emailAddress !== initialValues.emailAddress) {
        updates.email = values.emailAddress;
      }

      // Compare role arrays properly
      const rolesChanged =
        JSON.stringify(values.roles) !== JSON.stringify(initialValues.roles);
      if (rolesChanged) {
        updates.role = values.roles;
      }

      if (Object.keys(updates).length > 1) {
        updateUser(updates, {
          onSuccess: () => {
            setOpenModal(false);
          },
        });
      }
    },
    enableReinitialize: true,
  });

  const roleOptions = React.useMemo(() => {
    if (!rolesData?.data) return [];
    return rolesData.data.map((role) => ({
      label: role.name,
      value: role.name,
    }));
  }, [rolesData?.data]);

  const handleClose = () => {
    formik.resetForm();
    setOpenModal(false);
  };

  return (
    <AlertDialog open={openModal} onOpenChange={handleClose}>
      <AlertDialogContent className="max-w-md w-full md:max-w-[600px]">
        <AlertDialogHeader className="space-y-3 relative">
          <div className="flex items-start justify-between !mt-0">
            <div className="flex-1">
              <AlertDialogTitle className="text-[#212B36] text-2xl font-normal">
                Edit User
              </AlertDialogTitle>
              <AlertDialogDescription className="text-[#637381] text-base font-normal">
                You can manage users access here
              </AlertDialogDescription>
            </div>
            <div onClick={handleClose} className="w-6 h-6">
              <Icon
                name="cancel"
                className="h-6 w-6 text-[#A4A7AE] cursor-pointer"
              />
            </div>
          </div>
        </AlertDialogHeader>

        <form
          className="w-full flex flex-col gap-4"
          onSubmit={formik.handleSubmit}
        >
          <div className="flex flex-col md:flex-row items-start w-full gap-4">
            <div className="w-full">
              <Input
                label="First name"
                name="firstName"
                placeholder="Enter your first name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.firstName}
                errorMessage={
                  formik.touched.firstName && formik.errors.firstName
                }
              />
            </div>
            <div className="w-full">
              <Input
                label="Last name"
                name="lastName"
                placeholder="Enter your last name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.lastName}
                errorMessage={formik.touched.lastName && formik.errors.lastName}
              />
            </div>
          </div>

          <Input
            label="Phone number"
            name="phoneNumber"
            type="tel"
            placeholder="Enter your phone number"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.phoneNumber}
            errorMessage={
              formik.touched.phoneNumber && formik.errors.phoneNumber
            }
          />

          <Input
            label="Email address"
            name="emailAddress"
            type="email"
            placeholder="Enter your email address"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.emailAddress}
            errorMessage={
              formik.touched.emailAddress && formik.errors.emailAddress
            }
          />

          <div className="w-full">
            <label className="block text-sm font-medium text-[#637381] mb-1.5">
              Role
            </label>

            <MultiSelect
              isMulti
              usePortal
              options={roleOptions}
              value={formik.values.roles}
              onChange={(value) => formik.setFieldValue("roles", value)}
              isLoading={isLoadingRoles}
              placeholder="Select roles"
              error={!!(formik.touched.roles && formik.errors.roles)}
            />
            {formik.touched.roles && formik.errors.roles && (
              <div className="text-red-500 text-sm mt-1">
                {typeof formik.errors.roles === "string"
                  ? formik.errors.roles
                  : "Please select a valid role(s)"}
              </div>
            )}
          </div>

          <Button
            className="self-end mt-4 w-fit"
            type="submit"
            disabled={!formik.isValid || !formik.dirty || isUpdating}
            isLoading={isUpdating}
          >
            {isUpdating ? "Updating..." : "Update User"}
          </Button>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export { EditUser };
