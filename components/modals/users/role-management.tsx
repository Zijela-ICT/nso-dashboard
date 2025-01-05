"use client";

import React, { useState, useMemo, useEffect, SetStateAction } from "react";
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
import { UpdateRoleInputType, useUpdateRole } from "@/hooks/api/mutations/user";
import {
  RoleDataResponse,
  useFetchPermissions
} from "@/hooks/api/queries/users";
import { useFetchRole } from "@/hooks/api/queries/users";
import { useFormik } from "formik";

interface RoleManagementModalProps {
  openModal: boolean;
  setOpenModal: any;
  role: RoleDataResponse;
  mode: "view" | "edit";
}

const RoleManagementModal = ({
  openModal,
  setOpenModal,
  role,
  mode
}: RoleManagementModalProps) => {
  const { mutate: updateRole, isLoading: isUpdating } = useUpdateRole();
  const { data: roleData, isLoading: isLoadingRole } = useFetchRole(role?.id);
  const { data: allPermissionsData, isLoading: isLoadingAllPermissions } =
    useFetchPermissions();
  const [expandedSections, setExpandedSections] = useState({});
  const [selected, setSelected] = useState<Record<number, boolean>>({});
  const isViewMode = mode === "view";

  const formik = useFormik({
    initialValues: {
      roleName: "",
      permissions: [] as number[]
    },
    // validationSchema: CreateRoleSchema,
    onSubmit: (values) => {
      if (isViewMode) return;

      const updates: UpdateRoleInputType = {
        id: role.id
      };

      // Add name if it changed
      if (values.roleName !== role?.name) {
        updates.name = values.roleName;
      }

      // Get current permission IDs
      const currentPermissionIds =
        roleData?.data?.permissions?.map((p) => p.id) || [];

      // Get selected permission IDs (ensure they're numbers)
      const selectedPermissionIds = Object.entries(selected)
        .filter(([_, isSelected]) => isSelected)
        .map(([id]) => Number(id));

      // Check if permissions changed
      const hasPermissionChanges =
        JSON.stringify(selectedPermissionIds.sort()) !==
        JSON.stringify(currentPermissionIds.sort());

      if (hasPermissionChanges) {
        updates.permissions = selectedPermissionIds;
      }

      // Only proceed if there are actual changes
      if (Object.keys(updates).length > 1) {
        updateRole(updates, {
          onSuccess: () => {
            setOpenModal(false, null, "view");
          }
        });
      }
    },
    enableReinitialize: true
  });

  // Initialize form with role data
  useEffect(() => {
    if (roleData?.data) {
      formik.setValues({
        roleName: roleData.data.name || "",
        permissions: roleData.data.permissions?.map((p) => p.id) || []
      });

      // Initialize selected permissions from role permissions using IDs
      const selectedMap: Record<number, boolean> = {};
      roleData.data.permissions?.forEach((permission) => {
        selectedMap[permission.id] = true;
      });
      setSelected(selectedMap);
    }
  }, [roleData]);

  // Memoize grouped permissions from all system permissions
  const groupedPermissions = useMemo(() => {
    if (!allPermissionsData?.data?.data) return {};

    // First, group all permissions
    const allGroups = allPermissionsData.data.data.reduce(
      (groups: Record<string, any[]>, permission) => {
        const [action, resource] = permission.permissionString.split("_");
        const resourceName = resource.split(":")[0];

        if (!groups[resourceName]) {
          groups[resourceName] = [];
        }

        groups[resourceName].push(permission);
        return groups;
      },
      {}
    );

    // If in view mode, filter to only show selected permissions
    if (isViewMode) {
      const filteredGroups: Record<string, any[]> = {};

      Object.entries(allGroups).forEach(([resourceName, permissions]) => {
        const selectedPermissions = permissions.filter(
          (permission) => selected[permission.id]
        );

        if (selectedPermissions.length > 0) {
          filteredGroups[resourceName] = selectedPermissions;
        }
      });

      return filteredGroups;
    }

    return allGroups;
  }, [allPermissionsData, selected, isViewMode]);

  const togglePermission = (permissionId: number) => {
    if (isViewMode) return;

    console.log("permissionId", permissionId);

    setSelected((prev) => ({
      ...prev,
      [permissionId]: !prev[permissionId]
    }));
  };

  // Update formik when selected state changes
  useEffect(() => {
    if (isViewMode) return;

    const selectedPermissions = Object.entries(selected)
      .filter(([_, value]) => value)
      .map(([key]) => Number(key));

    formik.setFieldValue("permissions", selectedPermissions);
  }, [selected]);

  const toggleSection = (resourceName: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [resourceName]: !prev[resourceName]
    }));
  };

  const handleClose = () => {
    formik.resetForm();
    setOpenModal(false, null, "view");
  };

  if (isLoadingRole || isLoadingAllPermissions) {
    return (
      <AlertDialog open={openModal} onOpenChange={handleClose}>
        <AlertDialogContent className="max-w-md w-full md:max-w-[600px]">
          <div className="flex items-center justify-center p-8">Loading...</div>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <AlertDialog open={openModal} onOpenChange={handleClose}>
      <AlertDialogContent className="max-w-md w-full md:max-w-[600px]">
        <AlertDialogHeader className="space-y-3 relative">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <AlertDialogTitle className="text-[#212B36] text-2xl font-normal">
                {isViewMode ? "View Role" : "Edit Role"}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-[#637381] text-base font-normal">
                {isViewMode ? "View role details" : "Modify role settings"}
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
            label="Name of role"
            name="roleName"
            placeholder="Enter role name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.roleName}
            errorMessage={formik.touched.roleName && formik.errors.roleName}
            disabled={isViewMode}
          />

          <div className="flex flex-col gap-2">
            <p className="text-[#637381] text-base font-normal">Permissions</p>
            <div className="bg-white py-4 max-h-[400px] overflow-y-auto">
              {Object.entries(groupedPermissions).map(
                ([resourceName, permissions]) => (
                  <div
                    key={resourceName}
                    className="border border-gray-300 rounded-lg overflow-hidden mb-2">
                    <button
                      type="button"
                      className="w-full py-3 px-4 flex items-center justify-between hover:bg-gray-50"
                      onClick={() => toggleSection(resourceName)}>
                      <h3 className="text-base font-normal capitalize">
                        {resourceName.replace(/-/g, " ")}
                      </h3>
                      <svg
                        className={`w-5 h-5 transition-transform duration-200 ${
                          expandedSections[resourceName] ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
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
                        {permissions.map((permission) => {
                          return (
                            <div
                              key={permission.id}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                              <Checkbox
                                id={`permission-${permission.id}`}
                                checked={!!selected[permission.id]}
                                onCheckedChange={() =>
                                  togglePermission(permission.id)
                                }
                                disabled={isViewMode}
                              />
                              <label
                                htmlFor={`permission-${permission.id}`}
                                className={`cursor-pointer ${
                                  isViewMode ? "cursor-default" : ""
                                }`}>
                                {permission.permissionString}
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          </div>

          {!isViewMode && (
            <Button
              className="self-end mt-4 w-fit"
              type="submit"
              disabled={!formik.isValid || !formik.dirty || isUpdating}>
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          )}
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export { RoleManagementModal };
