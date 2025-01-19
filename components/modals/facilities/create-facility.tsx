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
import { useFormik } from "formik";
import React from "react";
import { CreateFacilitySchema } from "@/validation-schema/facility";
import { useCreateFacility } from "@/hooks/api/mutations/facility";

interface CreateFacilityModalProps {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
}

enum FacilityType {
  PUBLIC = "public",
  PRIVATE = "private"
}

enum FacilityStatus {
  ACTIVE = "active",
  INACTIVE = "inactive"
}

enum CareLevel {
  PRIMARY = "primary",
  SECONDARY = "secondary",
  TERTIARY = "tertiary"
}

enum LocationType {
  RURAL = "rural",
  URBAN = "urban"
}

const CreateFacility = ({
  openModal,
  setOpenModal
}: CreateFacilityModalProps) => {
  const { mutate, isLoading } = useCreateFacility();

  const formik = useFormik<{
    name: string;
    facilityType: "public" | "private" | string;
    status: "active" | "inactive" | string;
    careLevel: "primary" | "secondary" | "tertiary" | string;
    location: "rural" | "urban" | string;
    address: string;
    longitude: number;
    latitude: number;
    contact: string;
  }>({
    initialValues: {
      name: "",
      facilityType: "",
      status: "",
      careLevel: "",
      location: "",
      address: "",
      longitude: null,
      latitude: null,
      contact: ""
    },
    validationSchema: CreateFacilitySchema,
    onSubmit: (values, { resetForm }) => {
      mutate(
        {
          name: values.name,
          type: values.facilityType,
          status: values.status,
          careLevel: values.careLevel,
          location: values.location,
          address: values.address,
          longitude: Number(values.longitude), // Explicit conversion
          latitude: Number(values.latitude),
          contact: values.contact
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
                Create Facility
              </AlertDialogTitle>
              <AlertDialogDescription className="text-[#637381] text-base font-normal">
                Create and manage healthcare facilities
              </AlertDialogDescription>
            </div>
            <button
              type="button"
              onClick={handleClose}
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

        <form
          className="w-full flex flex-col gap-4"
          onSubmit={formik.handleSubmit}>
          <Input
            label="Facility Name"
            name="name"
            placeholder="Enter facility name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            errorMessage={formik.touched.name && formik.errors.name}
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#637381]">
              Facility Type
            </label>
            <Select
              name="facilityType"
              value={formik.values.facilityType}
              onValueChange={(value) =>
                formik.setFieldValue("facilityType", value)
              }>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select facility type" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(FacilityType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formik.touched.facilityType && formik.errors.facilityType && (
              <div className="text-red-500 text-sm">
                {formik.errors.facilityType}
              </div>
            )}
          </div>

          <Input
            label="Facility Address"
            name="address"
            placeholder="Enter facility address"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.address}
            errorMessage={formik.touched.address && formik.errors.address}
          />

          <Input
            label="Mobile number of contact person"
            name="contact"
            placeholder="Enter facility contact"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.contact}
            errorMessage={formik.touched.contact && formik.errors.contact}
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#637381]">
              Facility Status
            </label>
            <Select
              name="status"
              value={formik.values.status}
              onValueChange={(value) => formik.setFieldValue("status", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select facility status" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(FacilityStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formik.touched.status && formik.errors.status && (
              <div className="text-red-500 text-sm">{formik.errors.status}</div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#637381]">
              Level of Care
            </label>
            <Select
              name="careLevel"
              value={formik.values.careLevel}
              onValueChange={(value) =>
                formik.setFieldValue("careLevel", value)
              }>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select level of care" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(CareLevel).map((level) => (
                  <SelectItem key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formik.touched.careLevel && formik.errors.careLevel && (
              <div className="text-red-500 text-sm">
                {formik.errors.careLevel}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#637381]">
              Location Type
            </label>
            <Select
              name="location"
              value={formik.values.location}
              onValueChange={(value) =>
                formik.setFieldValue("location", value)
              }>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select location type" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(LocationType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formik.touched.location && formik.errors.location && (
              <div className="text-red-500 text-sm">
                {formik.errors.location}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Longitude"
              name="longitude"
              placeholder="Enter longitude"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.longitude}
              errorMessage={formik.touched.longitude && formik.errors.longitude}
            />
            <Input
              label="Latitude"
              name="latitude"
              placeholder="Enter latitude"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.latitude}
              errorMessage={formik.touched.latitude && formik.errors.latitude}
            />
          </div>

          {/* <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[#637381]">
                Facility Logo
              </label>
              <Input
                type="file"yarn
                name="logo"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleFileChange}
                onBlur={formik.handleBlur}
                errorMessage={formik.touched.logo && formik.errors.logo}
              />
              <div className="text-xs text-gray-500">
                Maximum file size: 5MB. Supported formats: JPEG, JPG, PNG
              </div>
            </div> */}

          <Button
            className="self-end mt-4 w-fit"
            type="submit"
            disabled={!formik.isValid || !formik.dirty || isLoading}>
            {isLoading ? "Creating..." : "Create Facility"}
          </Button>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export { CreateFacility };
