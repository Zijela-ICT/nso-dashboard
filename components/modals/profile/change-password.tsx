import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogDescription,
  Button,
  Input,
  Icon
} from "@/components/ui";

// Validation schema for password change
const PasswordChangeSchema = Yup.object().shape({
  oldPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[^\w]/, "Password must contain at least one symbol"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Please confirm your password")
});

interface PasswordChangeModalProps {
  onPasswordChange: (oldPassword: string, newPassword: string) => Promise<void>;
}

const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({
  onPasswordChange
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    },
    validationSchema: PasswordChangeSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await onPasswordChange(values.oldPassword, values.newPassword);
        setIsOpen(false);
        resetForm();
      } catch (error) {
        console.error("Password change failed:", error);
      } finally {
        setSubmitting(false);
      }
    }
  });

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      formik.resetForm();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <div className="flex items-center justify-between cursor-pointer">
          <span className="text-gray-600">Change Password</span>
          <Icon name="arrow-left" className="rotate-180" />
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <AlertDialogTitle className="text-xl font-semibold">
                Change Password
              </AlertDialogTitle>
              <AlertDialogDescription>
                Please enter your current password and choose a new password.
              </AlertDialogDescription>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
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

        <form onSubmit={formik.handleSubmit} className="space-y-4 mt-4">
          <Input
            type="password"
            label="Current Password"
            name="oldPassword"
            placeholder="Enter current password"
            value={formik.values.oldPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            errorMessage={
              formik.touched.oldPassword && formik.errors.oldPassword
            }
          />

          <Input
            type="password"
            label="New Password"
            name="newPassword"
            placeholder="Enter new password"
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            errorMessage={
              formik.touched.newPassword && formik.errors.newPassword
            }
          />

          <Input
            type="password"
            label="Confirm New Password"
            name="confirmPassword"
            placeholder="Confirm new password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            errorMessage={
              formik.touched.confirmPassword && formik.errors.confirmPassword
            }
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                !formik.isValid || !formik.dirty || formik.isSubmitting
              }>
              {formik.isSubmitting ? "Changing..." : "Change Password"}
            </Button>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export { PasswordChangeModal };
