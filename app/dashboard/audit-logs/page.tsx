"use client";
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
} from "@/components/ui";
import { useAuditLogs } from "@/hooks/api/queries/users/useAuditLogs";
import dayjs from "dayjs";
import React, { useState } from "react";

const Page = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 10; // Adjust as needed

  const { auditLogs, data } = useAuditLogs(currentPage, reportsPerPage);

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
            <TableHead>User ID</TableHead>
            <TableHead>Resourse</TableHead>
            <TableHead>IP Address</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {auditLogs?.map((user, index) => (
            <TableRow className="cursor-pointer" key={index}>
              <TableCell>{user.user.email}</TableCell>
              <TableCell>{user.resource}</TableCell>
              <TableCell>{user.metadata.ipAddress}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    user.action === "READ"
                      ? "pending"
                      : user.action === "Create"
                      ? "success"
                      : "overdue"
                  }
                >
                  {user.action}
                </Badge>
              </TableCell>
              <TableCell>
                {dayjs(user.createdAt).format("DD MMM YYYY; hh:mma") || "N/a"}
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
