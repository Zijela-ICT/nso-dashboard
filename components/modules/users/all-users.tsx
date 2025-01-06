"use client";
import {
  CreateUser,
  EditUser,
  UploadBulkUser,
} from "@/components/modals/users";
import {
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Icon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Pagination,
  Button,
} from "@/components/ui";
import {
  SystemUsersDataResponse,
  useFetchSystemUsers,
} from "@/hooks/api/queries/users";
import { usePermissions } from "@/hooks/custom/usePermissions";
import { SystemPermissions } from "@/utils/permission-enums";
import React, { useState } from "react";

const AllUsers = () => {
  const { hasPermission } = usePermissions();
  const [createUserModal, setCreateUserModal] = useState(false);
  const [bulkUploadModal, setBulkUploadModal] = useState(false);
  const [editUserModal, setEditUserModal] = useState(false);

  const [selectedUser, setSelectedUser] =
    useState<SystemUsersDataResponse | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 20; // Adjust as needed
  const totalPages = Math.ceil(100 / reportsPerPage);

  const { data, isLoading } = useFetchSystemUsers(currentPage, reportsPerPage);

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
        {hasPermission(SystemPermissions.CREATE_ADMIN_USERS) && (
          <Button className="w-fit" onClick={() => setCreateUserModal(true)}>
            {" "}
            Create User
          </Button>
        )}
        <Button
          className="w-fit"
          variant="outline"
          onClick={() => setBulkUploadModal(true)}
        >
          {" "}
          Bulk User
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.data?.data.map((user, index) => (
            <TableRow className="cursor-pointer" key={index}>
              <TableCell>{user.firstName}</TableCell>
              <TableCell>{user.lastName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.roles[0]?.name}</TableCell>
              <TableCell>
                <Badge variant={user?.isDeactivated ? "failed" : "success"}>
                  {user?.isDeactivated ? "Inactive" : "Active"}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="w-4 h-4">
                      <Icon
                        name="menu-dots"
                        className="w-4 h-4 text-quaternary"
                        fill="none"
                      />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="text-sm text-[#212B36] font-medium rounded-[8px] px-1"
                  >
                    {hasPermission(SystemPermissions.UPDATE_ADMIN_USERS) && (
                      <DropdownMenuItem
                        className="py-2  rounded-[8px]"
                        onClick={() => {
                          setEditUserModal(true);
                          setSelectedUser(user);
                        }}
                      >
                        Edit User
                      </DropdownMenuItem>
                    )}
                    {hasPermission(
                      SystemPermissions.UPDATE_ADMIN_USERS_RESET_PASSWORD
                    ) && (
                      <DropdownMenuItem className="py-2 rounded-[8px]">
                        Reset Password
                      </DropdownMenuItem>
                    )}
                    {hasPermission(
                      SystemPermissions.UPDATE_ADMIN_USERS_DEACTIVATE
                    ) && (
                      <DropdownMenuItem className="py-2 text-[#FF3B30] rounded-[8px]">
                        Deactivate User
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination
        currentPage={currentPage}
        totalPages={data?.data?.totalPages}
        onPageChange={setCurrentPage}
      />

      <CreateUser
        openModal={createUserModal}
        setOpenModal={setCreateUserModal}
      />
      <UploadBulkUser
        openModal={bulkUploadModal}
        setOpenModal={setBulkUploadModal}
      />

      <EditUser
        openModal={editUserModal}
        setOpenModal={setEditUserModal}
        user={selectedUser}
      />
    </div>
  );
};

export default AllUsers;
