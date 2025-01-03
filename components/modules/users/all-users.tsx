"use client";
import {  CreateUser, EditUser, UploadBulkUser } from "@/components/modals/users";
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
import React, { useState } from "react";

const AllUsers = () => {
  const [createUserModal, setCreateUserModal] = useState(false);
  const [bulkUploadModal, setBulkUploadModal] = useState(false);
  const [editUserModal, setEditUserModal] = useState(false);

  
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
        <Button className="w-fit" onClick={() => setCreateUserModal(true)}>
          {" "}
          Create User
        </Button>
        <Button className="w-fit" variant="outline" onClick={() => setBulkUploadModal(true)}>
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
          {templates.map((_, index) => (
            <TableRow className="cursor-pointer" key={index}>
              <TableCell>Evelyn</TableCell>
              <TableCell>William</TableCell>
              <TableCell>abctest@gmail.com</TableCell>
              <TableCell>Super Admin</TableCell>
              <TableCell>
                <Badge variant="pending">Pending</Badge>
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
                    className="text-sm text-[#212B36] font-medium rounded-[8px] px-1">
                    <DropdownMenuItem className="py-2  rounded-[8px]" onClick={
                      () => setEditUserModal(true)
                    }>
                      Edit User
                    </DropdownMenuItem>
                    <DropdownMenuItem className="py-2 rounded-[8px]">
                      Reset Password
                    </DropdownMenuItem>
                    <DropdownMenuItem className="py-2 text-[#FF3B30] rounded-[8px]">
                      Deactivate User
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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

      <CreateUser
        openModal={createUserModal}
        setOpenModal={setCreateUserModal}
      />
      <UploadBulkUser
        openModal={bulkUploadModal}
        setOpenModal={setBulkUploadModal}
      />

      <EditUser openModal={editUserModal} setOpenModal={setEditUserModal} />
    </div>
  );
};

export default AllUsers;
