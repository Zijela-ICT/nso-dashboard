import * as Yup from "yup";

export const EditUserSchema = Yup.object().shape({
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
  roles: Yup.array().of(Yup.string()).min(1, "At least one role is required")
});

export const CreateUserSchema = Yup.object().shape({
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
  role: Yup.array()
    .of(Yup.string())
    .min(1, "At least one role must be selected")
    .required("Role selection is required")
});
