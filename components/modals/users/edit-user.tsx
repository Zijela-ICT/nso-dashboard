import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Icon,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui";
import { useFormik } from "formik";
import React from "react";

type EditUserModal = {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
};
const EditUser = ({ openModal, setOpenModal }: EditUserModal) => {
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      emailAddress: "",
      password: ""
    },
    // validationSchema: LoginSchema,
    onSubmit: (values) => {}
  });
  return (
    <AlertDialog open={openModal} onOpenChange={() => setOpenModal(false)}>
      <AlertDialogContent className="max-w-md w-full md:max-w-[600px]">
        <AlertDialogHeader className="space-y-3 relative">
          <div className="flex items-start justify-between !mt-0">
            <AlertDialogTitle className="text-[#212B36] text-2xl font-normal ">
              Edit User
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[#637381] text-base font-normal">
              You can manage users access here
            </AlertDialogDescription>

            <div onClick={() => setOpenModal(false)} className="w-6 h-6">
              <Icon
                name="cancel"
                className="h-6 w-6 text-[#A4A7AE] cursor-pointer"
              />
            </div>
          </div>
          <div className="text-sm text-muted-foreground"></div>
        </AlertDialogHeader>

        <form
          className="w-full flex flex-col gap-4"
          onSubmit={formik.handleSubmit}>
          <div className="flex flex-row items-center w-full gap-4">
            <Input
              label="First name"
              name="firstName"
              placeholder="Enter your first name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.firstName}
              errorMessage={
                formik.errors.firstName && formik.touched.firstName
                  ? formik.errors.firstName
                  : ""
              }
            />
            <Input
              label="Last name"
              name="lastName"
              placeholder="Enter your last name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.lastName}
              errorMessage={
                formik.errors.lastName && formik.touched.lastName
                  ? formik.errors.lastName
                  : ""
              }
            />
          </div>
          <Input
            label="Phone number"
            name="phoneNumber"
            placeholder="Enter your phone number"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.phoneNumber}
            errorMessage={
              formik.errors.phoneNumber && formik.touched.phoneNumber
                ? formik.errors.phoneNumber
                : ""
            }
          />
          <Input
            label="Email address"
            name="emailAddress"
            placeholder="Enter your email address"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.emailAddress}
            errorMessage={
              formik.errors.emailAddress && formik.touched.emailAddress
                ? formik.errors.emailAddress
                : ""
            }
          />

          <div>
            <label className="block text-sm font-medium text-[#637381]">
              Role
            </label>
            <Select>
              <SelectTrigger>
                <SelectValue
                  placeholder="Edit Role"
                  className="text-placeholder font-normal"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="super admin">Super Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="facility manager">
                  Facility Manager
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            className="self-end mt-4 w-fit"
            type="submit"
            disabled={!formik.isValid || !formik.dirty}>
            Create User
          </Button>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export { EditUser };
