import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Input,
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

interface CreateUserModalProps {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
}

// Validation schema
const CreateUserSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .required("First name is required"),
  lastName: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .required("Last name is required"),
  phoneNumber: Yup.string()
    .matches(/^[0-9+\-\s()]+$/, "Invalid phone number format")
    .min(10, "Phone number must be at least 10 digits")
    .required("Phone number is required"),
  emailAddress: Yup.string()
    .email("Invalid email address")
    .required("Email address is required"),
  role: Yup.string()
    .required("Role selection is required")
});

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
          role: [values.role]
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
            <Select
              name="role"
              onValueChange={(value) => formik.setFieldValue("role", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder="Select role"
                  className="text-placeholder font-normal"
                />
              </SelectTrigger>
              <SelectContent>
                {isLoadingRoles ? (
                  <SelectItem value="loading" disabled>
                    Loading roles...
                  </SelectItem>
                ) : (
                  rolesData?.data?.map((role) => (
                    <SelectItem key={role.id} value={role.name}>
                      {role.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {/* {formik.touched.role && formik.errors.role && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.role}</div>
            )} */}
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