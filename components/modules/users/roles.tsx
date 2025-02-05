"use client";
import { DeleteModal, RoleManagementModal } from "@/components/modals/users";
import { CreateRoleModal } from "@/components/modals/users/create-role";
import {
  Icon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Pagination,
  Button
} from "@/components/ui";
import { useDeleteRole } from "@/hooks/api/mutations/user";
import { RoleDataResponse, useFetchRoles } from "@/hooks/api/queries/users";
import { usePermissions } from "@/hooks/custom/usePermissions";
import { SystemPermissions } from "@/utils/permission-enums";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface RoleManagementProps {
  open: boolean;
  role: RoleDataResponse | null;
  mode: "view" | "edit";
}
const Roles = () => {
  const router = useRouter();
  const { hasPermission } = usePermissions();
  const { mutate, isLoading: isLoadingDeleteRole } = useDeleteRole();

  const [createRoleModal, setCreateRoleModal] = useState(false);

  const [roleManagementModal, setRoleManagementModal] =
    useState<RoleManagementProps>({
      open: false,
      role: null,
      mode: "view"
    });

  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 20; // Adjust as needed

  const { data } = useFetchRoles(currentPage, reportsPerPage);
  return (
    <div className="bg-white p-4 rounded-2xl">
      <div className="gap-4 flex flex-row items-center w-full mb-3">
        <div className="relative w-full">
          <input
            className="border border-[#919EAB33] px-12 py-4 rounded-lg w-full text-[#637381] placeholder:text-[#637381] text-sm"
            placeholder="Search"
          />
          <Icon name="search" className="absolute top-4 left-4 " fill="none" />
        </div>
        {hasPermission(SystemPermissions.CREATE_ADMIN_ROLES) && (
          <Button className="w-fit" onClick={() => setCreateRoleModal(true)}>
            {" "}
            Create Role
          </Button>
        )}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Roles</TableHead>
            <TableHead>Users</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.data?.map((role, index) => (
            <TableRow className="cursor-pointer" key={index}>
              <TableCell>{role.name}</TableCell>
              <TableCell>{role.users}</TableCell>
              <TableCell>
                <div className="flex flex-row items-center justify-start gap-2">
                  {hasPermission([
                    SystemPermissions.READ_ADMIN_USERS_SYSTEM,
                    SystemPermissions.READ_ADMIN_USERS_APP,
                  ]) && (
                    <div
                      className="text-[#212B36] text-sm font-bold border border-[#919EAB52] py-1.5 px-3 rounded-lg"
                      onClick={() =>
                        router.push(`/dashboard/users/roles/${role.name}`)
                      }>
                      View user
                    </div>
                  )}
                  {hasPermission([
                    SystemPermissions.READ_ADMIN_ROLES_PERMISSIONS,
                    SystemPermissions.UPDATE_ADMIN_ROLES,
                    SystemPermissions.READ_ADMIN_ROLES_ID
                  ]) && (
                    <div
                      className="text-[#212B36] text-sm font-bold border border-[#919EAB52] py-1.5 px-3 rounded-lg"
                      onClick={() =>
                        setRoleManagementModal({
                          open: true,
                          role: role,
                          mode: "view"
                        })
                      }>
                      View Permissions
                    </div>
                  )}
                  {hasPermission([
                    SystemPermissions.UPDATE_ADMIN_ROLES,
                    SystemPermissions.READ_ADMIN_ROLES_ID
                  ]) && (
                    <div
                      className="text-sm font-bold bg-[#0CA554] text-[#FCFCFD] hover:bg-[#0CA554]/90 py-1.5 px-3 rounded-lg"
                      onClick={() =>
                        setRoleManagementModal({
                          open: true,
                          role: role,
                          mode: "edit"
                        })
                      }>
                      Edit role
                    </div>
                  )}
                  {hasPermission(SystemPermissions.DELETE_ADMIN_ROLES) &&
                    role.name !== "super_admin" && (
                      <Icon
                        name="trash"
                        className="text-[#FF3B30]"
                        fill="#FF3B30"
                        onClick={() => {
                          setSelectedRole(role.id);
                          setDeleteModal(true);
                        }}
                      />
                    )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination
        currentPage={currentPage}
        totalPages={1}
        onPageChange={setCurrentPage}
      />

      <CreateRoleModal
        openModal={createRoleModal}
        setOpenModal={setCreateRoleModal}
      />

      <DeleteModal
        openModal={deleteModal}
        setOpenModal={setDeleteModal}
        header="Delete Role"
        subText="Are you sure you want to delete this role "
        loading={isLoadingDeleteRole}
        handleConfirm={() => {
          mutate(
            {
              id: selectedRole
            },
            {
              onSuccess: () => {
                setDeleteModal(false);
              }
            }
          );
        }}
      />

      {roleManagementModal.open && (
        <RoleManagementModal
          openModal={roleManagementModal.open}
          setOpenModal={setRoleManagementModal}
          role={roleManagementModal.role}
          mode={roleManagementModal.mode}
        />
      )}
    </div>
  );
};

export default Roles;
