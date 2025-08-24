"use client";
import { EditFacility } from "@/components/modals/facilities/edit-facility";
import { DeleteModal } from "@/components/modals/users";
import { Avatar, AvatarFallback, Button, Icon } from "@/components/ui";
import { useDeleteFacility } from "@/hooks/api/mutations/facility";
import { useFetchSingleFacility } from "@/hooks/api/queries/facilities";
import { usePermissions } from "@/hooks/custom/usePermissions";
import { SystemPermissions } from "@/utils/permission-enums";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";

const Page = () => {
  const { mutate: mutateDelete, isLoading: isLoadingDelete } =
    useDeleteFacility();
  const { hasPermission } = usePermissions();
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const { data } = useFetchSingleFacility(params.id);

  const facility = data?.data;

  const faciltyDetails = {
    Name: facility?.name,
    "Contact Person": facility?.contact,
    "Facility Type": facility?.type,
    "⁠Facility Level of Care": facility?.careLevel,
    Coordinates: `${facility?.latitude}, ${facility?.longitude}`,
    Location: facility?.location,
    Address: facility?.address,
  };

  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  return (
    <div className="mt-10">
      <div className="flex flex-row items-center justify-between w-full mb-4">
        <div className="flex flex-row items-center cursor-pointer gap-2">
          <span onClick={() => router.back()}>Facilities</span>
          <Icon name="arrow-left" />
          <span className="text-[#0CA554] text-base font-normal">
            {facility?.name}
          </span>
        </div>
        <div className="flex flex-row items-center gap-4 mt-4">
          {hasPermission(SystemPermissions.DELETE_ADMIN_FACILITIES) && (
            <Button
              className="bg-[#FEF3F2] border border-[#F04438] w-fit text-[#912018] hover:bg-[#FEF3F2]"
              onClick={() => setDeleteModal(true)}
            >
              Delete facility
              <Icon
                name="trash-2"
                className="text-[#912018]"
                stroke="#912018"
              />
            </Button>
          )}
          {hasPermission(SystemPermissions.UPDATE_ADMIN_FACILITIES) && (
            <Button
              className="w-fit flex items-center"
              onClick={() => setEditModal(true)}
            >
              Edit facility
              <Icon
                name="edit-2"
                className=" text-primary"
                fill="none"
                stroke="#fff"
              />
            </Button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
        <div className=" bg-white col-span-1 flex flex-col items-center justify-center rounded-[12px] py-5 px-4 md:py-10 md:px-8 shadow-md">
          <div className="flex flex-col items-center justify-start ">
            <div className="relative">
              <Avatar className="w-40 h-40 rounded-full">
                {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                <AvatarFallback className="text-xl md:text-5xl font-bold">
                  {facility?.name[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {/* <Icon
                name="edit-2"
                className="absolute bottom-0 right-0 cursor-pointer"
                stroke="#1D2939"
              /> */}
            </div>
            <span className="font-semibold text-2xl text-[#303030] hidden md:block mt-5">
              {facility?.name}
            </span>
            <p className="mt-3 text-[#606060] text-base">{facility?.contact}</p>
          </div>
        </div>
        <div className=" bg-white col-span-1 md:col-span-2 py-3 px-3 md:py-6 md:px-6 rounded-[12px] shadow-md">
          {Object.entries(faciltyDetails).map(([key, value], index) => (
            <div
              key={index}
              className="flex flex-col items-start gap-2 justify-start w-full mb-4"
            >
              <h3 className="text-[#101828] font-medium text-base">{key}</h3>
              <div className="border border-[#D0D5DD] rounded-[4px] p-4 text-base font-normal w-full">
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      <DeleteModal
        openModal={deleteModal}
        setOpenModal={setDeleteModal}
        header="Delete Facility"
        subText={`Are you sure you want to delete ${facility?.name}?`}
        loading={isLoadingDelete}
        handleConfirm={() => {
          mutateDelete(
            {
              id: params.id,
            },
            {
              onSuccess: () => {
                setDeleteModal(false);
                router.push("/dashboard/nearby-facilities");
              },
            }
          );
        }}
      />

      <EditFacility
        openModal={editModal}
        setOpenModal={setEditModal}
        facilityData={facility}
      />
    </div>
  );
};

export default Page;
