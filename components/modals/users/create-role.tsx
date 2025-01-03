"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Input,
  Checkbox
} from "@/components/ui";
import { useCreateRole } from "@/hooks/api/mutations/user";
import { useFetchPermissions } from "@/hooks/api/queries/users";
import { useFormik } from "formik";
import { CreateRoleSchema } from "@/validation-schema/auth";

const CreateRoleModal = ({ openModal, setOpenModal }) => {
  const { mutate, isLoading: isLoadingCreateRole } = useCreateRole();
  const { data: permissionsData } = useFetchPermissions();
  const [expandedSections, setExpandedSections] = useState({});
  const [selected, setSelected] = useState({});

  const formik = useFormik({
    initialValues: {
      roleName: "",
      permissions: []
    },
    validationSchema: CreateRoleSchema,
    onSubmit: (values) => {
      console.log("values", values);
      mutate(
        {
          name: values.roleName,
          permissions: values.permissions
        },
        {
          onSuccess: () => {
            setOpenModal(false);
            formik.resetForm();
            setSelected({});
          }
        }
      );
    }
  });

  // Memoize grouped permissions to prevent unnecessary recalculations
  const groupedPermissions = useMemo(() => {
    if (!permissionsData?.data?.data) return {};

    return permissionsData.data.data.reduce((groups, permission) => {
      const [action, resource] = permission.permissionString.split("_");
      const resourceName = resource.split(":")[0];

      if (!groups[resourceName]) {
        groups[resourceName] = [];
      }

      groups[resourceName].push({
        ...permission,
        action,
        resource: resourceName
      });

      return groups;
    }, {});
  }, [permissionsData]);

  const togglePermission = (permissionId) => {
    setSelected((prev) => ({
      ...prev,
      [permissionId]: prev[permissionId] ? undefined : true
    }));
  };

  // Update formik when selected state changes
  useEffect(() => {
    const selectedPermissions = Object.entries(selected)
      .filter(([_, value]) => value !== undefined)
      .map(([key]) => Number(key));

    formik.setFieldValue("permissions", selectedPermissions);
  }, [selected]);

  const toggleSection = (resourceName) => {
    setExpandedSections((prev) => ({
      ...prev,
      [resourceName]: !prev[resourceName]
    }));
  };

  return (
    <AlertDialog open={openModal} onOpenChange={setOpenModal}>
      <AlertDialogContent className="max-w-md w-full md:max-w-[600px]">
        <AlertDialogHeader className="space-y-3 relative">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <AlertDialogTitle className="text-[#212B36] text-2xl font-normal">
                Create Role
              </AlertDialogTitle>
              <AlertDialogDescription className="text-[#637381] text-base font-normal">
                You can manage users' access here
              </AlertDialogDescription>
            </div>
            <button
              type="button"
              onClick={() => setOpenModal(false)}
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
          <Input
            label="Name of role"
            name="roleName"
            placeholder="Enter role name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.roleName}
            errorMessage={formik.touched.roleName && formik.errors.roleName}
          />

          <div className="flex flex-col gap-2">
            <p className="text-[#637381] text-base font-normal">
              Permission menu
            </p>
            <div className="bg-white py-4 max-h-[400px] overflow-y-auto">
              {Object.entries(groupedPermissions).map(
                ([resourceName, permissions]) => (
                  <div
                    key={resourceName}
                    className="border border-gray-300 rounded-lg overflow-hidden mb-2"
                  >
                    <button
                      type="button"
                      className="w-full py-3 px-4 flex items-center justify-between hover:bg-gray-50"
                      onClick={() => toggleSection(resourceName)}
                    >
                      <h3 className="text-base font-normal capitalize">
                        {resourceName.replace(/-/g, " ")}
                      </h3>
                      <svg
                        className={`w-5 h-5 transition-transform duration-200 ${
                          expandedSections[resourceName] ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {expandedSections[resourceName] && (
                      <div className="border-t border-gray-300 py-2">
                        {permissions.map((permission) => (
                          <div
                            key={permission.id}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                          >
                            <Checkbox
                              id={`permission-${permission.id}`}
                              checked={!!selected[permission.id]}
                              onCheckedChange={() =>
                                togglePermission(permission.id)
                              }
                            />
                            <label
                              htmlFor={`permission-${permission.id}`}
                              className="cursor-pointer"
                            >
                              {permission.permissionString}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
            {formik.touched.permissions && formik.errors.permissions && (
              <div className="text-red-500 text-sm">
                {formik.errors.permissions}
              </div>
            )}
          </div>

          <Button
            className="self-end mt-4 w-fit"
            type="submit"
            disabled={!formik.isValid || !formik.dirty || isLoadingCreateRole}
          >
            {isLoadingCreateRole ? "Creating..." : "Create Role"}
          </Button>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export { CreateRoleModal };