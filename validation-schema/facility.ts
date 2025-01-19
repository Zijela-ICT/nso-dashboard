import * as Yup from "yup";

export const CreateFacilitySchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  facilityType: Yup.string()
    .min(2, "Facility type must be at least 2 characters")
    .required("Facility type is required"),
  status: Yup.string()
    .min(2, "Facility status must be at least 2 characters")
    .required("Facility status is required"),
  careLevel: Yup.string()
    .min(2, "Facility level of care must be at least 2 characters")
    .required("Facility type is required"),
  latitude: Yup.number()
    .required("Latitude is required")
    .min(-90, "Latitude must be between -90 and 90 degrees")
    .max(90, "Latitude must be between -90 and 90 degrees")
    .test(
      "is-decimal",
      "Latitude must be a valid coordinate",
      (value) =>
        value === undefined ||
        (value !== null && /^-?\d*\.?\d*$/.test(value.toString()))
    ),
  longitude: Yup.number()
    .required("Longitude is required")
    .min(-180, "Longitude must be between -180 and 180 degrees")
    .max(180, "Longitude must be between -180 and 180 degrees")
    .test(
      "is-decimal",
      "Longitude must be a valid coordinate",
      (value) =>
        value === undefined ||
        (value !== null && /^-?\d*\.?\d*$/.test(value.toString()))
    ),
  location: Yup.string()
    .min(2, "Location must be at least 2 characters")
    .required("Location is required"),
  address: Yup.string()
    .min(2, "Location must be at least 2 characters")
    .required("Location is required"),
  contact: Yup.string()
    .required("Contact number is required")
    .matches(
      /^(\+?234|0)[789][01]\d{8}$/,
      "Please enter a valid Nigerian phone number"
    )
    .test(
      "is-valid-length",
      "Phone number must be between 11 and 14 characters",
      (value) => !value || (value.length >= 11 && value.length <= 14)
    )
});
