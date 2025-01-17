"use client";
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
import { useFetchAppUsers } from "@/hooks/api/queries/users";
import React, { useState } from "react";

const Page = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 20; // Adjust as needed

  const {data} = useFetchAppUsers(currentPage, reportsPerPage);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

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
        <Button className="w-fit" variant="outline">
          Sort
        </Button>
        <Button className="w-fit">
          Filter 
        </Button>
        
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
                    <DropdownMenuItem className="py-2  rounded-[8px]" >
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
        totalPages={data?.data?.totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default Page;
