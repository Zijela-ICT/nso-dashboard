import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Input,
  MultiSelect,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui";
import { useCreateUser } from "@/hooks/api/mutations/user";
import { useFetchRoles } from "@/hooks/api/queries/users";
import { useFormik } from "formik";
import * as Yup from "yup";
import React from "react";
import { CreateUserSchema } from "@/validation-schema/user";

interface CreateUserModalProps {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
}

// Validation schema

const CreateUser = ({ openModal, setOpenModal }: CreateUserModalProps) => {
  const { mutate, isLoading } = useCreateUser();
  const { data: rolesData, isLoading: isLoadingRoles } = useFetchRoles();

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      emailAddress: "",
      role: [],
    },
    validationSchema: CreateUserSchema,
    onSubmit: (values, { resetForm }) => {
      mutate(
        {
          first_name: values.firstName,
          last_name: values.lastName,
          mobile: values.phoneNumber,
          email: values.emailAddress,
          role: values.role
        },
        {
          onSuccess: () => {
            resetForm();
            setOpenModal(false);
          }
        }
      );
    }
  });

  const roleOptions = React.useMemo(() => {
    if (!rolesData?.data) return [];
    return rolesData.data.map(role => ({
      label: role.name,
      value: role.name
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
                Create User
              </AlertDialogTitle>
              <AlertDialogDescription className="text-[#637381] text-base font-normal">
                You can create and manage users access here
              </AlertDialogDescription>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="w-6 h-6 text-[#A4A7AE] hover:text-gray-600"
              aria-label="Close dialog"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
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
                errorMessage={formik.touched.firstName && formik.errors.firstName}
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
              formik.errors.phoneNumber && formik.touched.phoneNumber
              ? formik.errors.phoneNumber
              : ""
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
            errorMessage={formik.touched.emailAddress && formik.errors.emailAddress}
          />

          <div className="w-full">
            <label className="block text-sm font-medium text-[#637381] mb-1.5">
              Role
            </label>
            <MultiSelect
              isMulti
              usePortal
              options={roleOptions}
              value={formik.values.role}
              onChange={(value) => formik.setFieldValue("role", value)}
              isLoading={isLoadingRoles}
              placeholder="Select roles"
              error={!!(formik.touched.role && formik.errors.role)}
            />
            {formik.touched.role && formik.errors.role && (
              <div className="text-red-500 text-sm mt-1">
                {typeof formik.errors.role === 'string' ? formik.errors.role : 'Please select a valid role(s)'}
              </div>
            )}
          </div>

          <Button
            className="self-end mt-4 w-fit"
            type="submit"
            disabled={!formik.isValid || !formik.dirty || isLoading}
          >
            {isLoading ? "Creating..." : "Create User"}
          </Button>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export { CreateUser };