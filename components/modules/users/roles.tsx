"use client";
import {  CreateUser, EditUser, UploadBulkUser } from "@/components/modals/users";
import { CreateRoleModal } from "@/components/modals/users/create-role";
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
  Button
} from "@/components/ui";
import { useFetchRoles } from "@/hooks/api/queries/users";
import React, { useState } from "react";

const Roles = () => {
  const  {data} = useFetchRoles();

  const [createRoleModal, setCreateRoleModal] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 20; // Adjust as needed
  const totalPages = Math.ceil(100 / reportsPerPage);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const templates = Array(5).fill(null);
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
        <Button className="w-fit" onClick={() => setCreateRoleModal(true)}>
          {" "}
          Create Role
        </Button>
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
                  <div className="text-[#212B36] text-sm font-bold border border-[#919EAB52] py-1.5 px-3 rounded-lg">View User</div>
                  <Icon name="trash"/>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <CreateRoleModal
        openModal={createRoleModal}
        setOpenModal={setCreateRoleModal}
      />
     
    </div>
  );
};

export default Roles;
