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
  Button,
  Spinner,
} from "@/components/ui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useFetchDecisions } from "@/hooks/api/queries/users/useFetchDecisions";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { Filter, SortAsc } from "lucide-react";
import React, { useState } from "react";
import FilterIcon from "@/assets/icons/filter.svg";
import SortIcon from "@/assets/icons/sort.svg";

function Decisions() {
  const [currentPage, setCurrentPage] = useState(1);
  const {
    data,
    decisions = [],
    isLoading,
  } = useFetchDecisions(currentPage, 10);

  return (
    <div className="bg-white p-4 mt-[50px] rounded-2xl">
      <div className="gap-4 flex justify-between flex-row items-center w-full mb-3">
        <div className="relative w-[500px]">
          <input
            className="border border-[#919EAB33] px-12 py-4 rounded-lg w-full text-[#637381] placeholder:text-[#637381] text-sm"
            placeholder="Search"
          />
          <Icon name="search" className="absolute top-4 left-4 " fill="none" />
        </div>
        <div className="flex gap-4">
          <Button className="w-fit" variant="outline">
            Sort <SortIcon />
          </Button>
          <Button className="w-fit">
            Filter <FilterIcon />
          </Button>
        </div>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center w-full py-[50px]">
          <Spinner />
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Decision ID</TableHead>
                <TableHead>Practitioner</TableHead>
                <TableHead>Cadre</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>More</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {decisions?.map((user, index) => (
                <TableRow className="cursor-pointer" key={index}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>
                    {user?.practitioner?.firstName} {user.practitioner.lastName}
                  </TableCell>
                  <TableCell>
                    <Badge variant={"success"}>{user.practitioner.cadre}</Badge>
                  </TableCell>
                  <TableCell>
                    {dayjs(user.createdAt).format("DD MMM YYYY: hh:mm a")}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <div className="w-4 h-4">
                          <Icon
                            name="menu-dots"
                            className="w-4 h-4 text-quaternary"
                            fill="none"
                          />
                        </div>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[505px]">
                        <DialogHeader>
                          <DialogTitle>More Details</DialogTitle>
                        </DialogHeader>
                        <div className="border-t border-[#EAECF0] pt-8 mt-2">
                          {user.decisionDetails.diagnosis
                            .filter((n) => typeof n === "string")
                            .map((item, i) => (
                              <div className="mb-4" key={i}>
                                <p className="text-[#101828] text-[16px] mb-2 font-medium">
                                  Possible diagnosis
                                </p>
                                <div className="p-4 border border-[#F2F4F7] bg-[#FCFCFD] rounded-[8px]">
                                  <p className="mb-2">{item}</p>
                                  <Badge variant="failed">Severe</Badge>
                                </div>
                              </div>
                            ))}
                          <div className="flex w-full mb-4 gap-4">
                            <div className="w-full">
                              <p className="text-[#101828] text-[16px] mb-2 font-medium">
                                Patient ID
                              </p>
                              <div className="p-4 border border-[#F2F4F7] bg-[#FCFCFD] rounded-[8px]">
                                {user.patientDetails.id || "---"}
                              </div>
                            </div>
                            <div className="w-full">
                              <p className="text-[#101828] text-[16px] mb-2 font-medium">
                                Patient Age
                              </p>
                              <div className="p-4 border border-[#F2F4F7] bg-[#FCFCFD] rounded-[8px]">
                                {user.patientDetails.age} years
                              </div>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination
            currentPage={currentPage}
            totalPages={data?.data?.totalPages || 1}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}

export default Decisions;
