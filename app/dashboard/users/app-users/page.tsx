"use client";
import { DeleteModal } from "@/components/modals/users";
import {
  Badge,
  Icon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Pagination,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui";
import { useDeactivate, useResetPassword } from "@/hooks/api/mutations/user";
import {
  SystemUsersDataResponse,
  useFetchAppUsers,
} from "@/hooks/api/queries/users";
import { usePermissions } from "@/hooks/custom/usePermissions";
import { cn } from "@/lib/utils";
import { SystemPermissions } from "@/utils/permission-enums";
import React, { useState } from "react";

const Page = () => {
  const { hasPermission } = usePermissions();
  const [search, setSearch] = useState("");
  const { mutate, isLoading: isLoadingCreateRole } = useResetPassword();
  const { mutate: mutateDeactivate, isLoading: isLoadingDeactivating } =
    useDeactivate();
  // const [editUserModal, setEditUserModal] = useState(false);
  const [resetPasswordModal, setResetPasswordModal] = useState(false);
  const [deactivateModal, setDeactivateModal] = useState(false);

  const [selectedUser, setSelectedUser] =
    useState<SystemUsersDataResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 20; // Adjust as needed

  const { data, refetch } = useFetchAppUsers(currentPage, reportsPerPage, search);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-white p-4 rounded-2xl mt-20">
      <div className="gap-4 flex flex-row items-center w-full mb-3">
        <div className="relative w-full">
          <input
            className="border border-[#919EAB33] px-12 py-4 rounded-lg w-full text-[#637381] placeholder:text-[#637381] text-sm"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Icon name="search" className="absolute top-4 left-4 " fill="none" />
        </div>
        <Button className="w-fit" variant="outline">
          Sort
        </Button>
        <Button className="w-fit">Filter</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Index Number</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>License Expires</TableHead>
            <TableHead>Cadre</TableHead>
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
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.regExpiration || "N/a"}</TableCell>
              <TableCell>{user.cadre}</TableCell>
              <TableCell>
                <Badge variant="success">{user.roles[0].name}</Badge>
              </TableCell>
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
                    {/* {hasPermission(SystemPermissions.UPDATE_ADMIN_USERS) && (
                      <DropdownMenuItem
                        className="py-2  rounded-[8px]"
                        onClick={() => {
                          setEditUserModal(true);
                          setSelectedUser(user);
                        }}
                      >
                        Edit User
                      </DropdownMenuItem>
                    )} */}
                    {hasPermission(
                      SystemPermissions.UPDATE_ADMIN_USERS_RESET_PASSWORD
                    ) && (
                      <DropdownMenuItem
                        className="py-2 rounded-[8px]"
                        onClick={() => {
                          setSelectedUser(user);
                          setResetPasswordModal(true);
                        }}
                      >
                        Reset Password
                      </DropdownMenuItem>
                    )}
                    {hasPermission(
                      SystemPermissions.UPDATE_ADMIN_USERS_DEACTIVATE
                    ) && (
                      <DropdownMenuItem
                        className={cn(
                          "py-2 text-[#FF3B30] rounded-[8px]",
                          user?.isDeactivated && "text-[#036B26]"
                        )}
                        onClick={() => {
                          setSelectedUser(user);
                          setDeactivateModal(true);
                        }}
                      >
                        {user?.isDeactivated
                          ? "Re-activate User"
                          : "Deactivate User"}
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
        onPageChange={onPageChange}
      />
      {/* <EditUser
        openModal={editUserModal}
        setOpenModal={setEditUserModal}
        user={selectedUser}
      /> */}

      <DeleteModal
        openModal={resetPasswordModal}
        setOpenModal={setResetPasswordModal}
        header="Reset Password"
        subText="Are you sure you want to reset this user’s password?"
        loading={isLoadingCreateRole}
        handleConfirm={() => {
          mutate(
            {
              id: selectedUser.id,
            },
            {
              onSuccess: () => {
                setResetPasswordModal(false);
                refetch();
              },
            }
          );
        }}
      />

      {selectedUser?.id && (
        <DeleteModal
          openModal={deactivateModal}
          setOpenModal={setDeactivateModal}
          header={
            selectedUser.isDeactivated ? "Re-activate User" : "Deactivate User"
          }
          subText={`Are you sure you want to ${
            selectedUser.isDeactivated ? "re-activate" : "deactivate"
          } this user?`}
          loading={isLoadingDeactivating}
          handleConfirm={() => {
            mutateDeactivate(
              {
                id: selectedUser.id,
                status: selectedUser.isDeactivated ? "activate" : "deactivate",
              },
              {
                onSuccess: () => {
                  setDeactivateModal(false);
                  refetch();
                },
              }
            );
          }}
        />
      )}
    </div>
  );
};

export default Page;
