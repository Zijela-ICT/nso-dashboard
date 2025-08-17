"use client";
import { CreateFacility } from "@/components/modals/facilities/create-facility";
import {
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
import { useFetchFacilities } from "@/hooks/api/queries/facilities";
import { usePermissions } from "@/hooks/custom/usePermissions";
import { SystemPermissions } from "@/utils/permission-enums";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Page = () => {
  const router = useRouter();
  const { hasPermission } = usePermissions();
  const [createFacilityModal, setCreateFacilityModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 20; // Adjust as needed

  // const { data } = useFetchAppUsers(currentPage, reportsPerPage);
  const { data } = useFetchFacilities(currentPage, reportsPerPage);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };
  return (
    <div>
      <div className="flex justify-end items-center mb-4 mt-8 gap-4">
        <Button
          className="w-fit flex items-center"
          onClick={() => setCreateFacilityModal(true)}
        >
          Create new
          <Icon name="add-square" className=" text-primary" fill="none" />
        </Button>
        <Button
          className="w-fit flex items-center"
          onClick={() => setCreateFacilityModal(true)}
        >
          Bulk Upload
          <Icon name="add-square" className=" text-primary" fill="none" />
        </Button>
      </div>
      <div className="bg-white p-4 rounded-2xl">
        <div className="gap-4 flex flex-row items-center justify-end w-full mb-3">
          {/* <div className="relative w-full">
            <input
              className="border border-[#919EAB33] px-12 py-4 rounded-lg w-full text-[#637381] placeholder:text-[#637381] text-sm"
              placeholder="Search"
            />
            <Icon
              name="search"
              className="absolute top-4 left-4 "
              fill="none"
            />
          </div> */}
          <Button className="w-fit" variant="outline">
            Sort
          </Button>
          <Button className="w-fit">Filter</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Names</TableHead>
              <TableHead>Facility type</TableHead>
              <TableHead>Coordinates</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data?.data?.map((facility, index) => (
              <TableRow className="cursor-pointer" key={index}>
                <TableCell>{facility.name}</TableCell>
                <TableCell>{facility.type}</TableCell>
                <TableCell>
                  {facility.latitude}, {facility.longitude}
                </TableCell>
                <TableCell>{facility.location}</TableCell>
                <TableCell className="flex flex-row items-center justify-start gap-3">
                  {hasPermission(SystemPermissions.READ_FACILITIES_ID) && (
                    <div
                      className="w-6 h-6"
                      onClick={() => {
                        router.push(
                          `/dashboard/nearby-facilities/${facility.id}`
                        );
                      }}
                    >
                      <Icon name="edit-2" className="w-6 h-6" />
                    </div>
                  )}

                  {hasPermission(SystemPermissions.DELETE_ADMIN_FACILITIES) && (
                    <div className="w-6 h-6">
                      <Icon
                        name="trash-2"
                        className="text-[#F04438] w-6 h-6"
                        fill="#FF3B30"
                        stroke="#FF3B30"
                      />
                    </div>
                  )}
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

        <CreateFacility
          openModal={createFacilityModal}
          setOpenModal={setCreateFacilityModal}
        />
      </div>
    </div>
  );
};

export default Page;
