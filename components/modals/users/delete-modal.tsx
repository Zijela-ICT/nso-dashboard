"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Icon
} from "@/components/ui";

interface DeleteModalProps {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  header?: string;
  subText?: string;
  handleConfirm: () => void;
  loading: boolean;
}
const DeleteModal = ({
  openModal,
  setOpenModal,
  loading,
  header,
  subText,
  handleConfirm,
}: DeleteModalProps) => {
  const handleFinal = () => {
    handleConfirm();
  }
  return (
    <AlertDialog open={openModal} onOpenChange={setOpenModal}>
      <AlertDialogContent className="max-w-md w-full md:max-w-[600px]">
        <AlertDialogHeader className="space-y-3 relative">
          <div className="flex items-start justify-between">
            <button
              type="button"
              onClick={() => setOpenModal(false)}
              className="w-6 h-6 text-[#A4A7AE] hover:text-gray-600"
              aria-label="Close dialog">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </AlertDialogHeader>

        <div className="flex flex-col gap-4 items-center">
          <div className="">
            <Icon name="caution" />
          </div>
          <AlertDialogTitle className="text-[#212B36] text-2xl font-normal">
            {header}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[#637381] text-base font-normal">
            {subText}
          </AlertDialogDescription>
        </div>
        <div className="flex flex-row gap-4">
          <Button className="self-end mt-4" variant="outline"onClick={() => setOpenModal(false)} >
            Cancel
          </Button>
          <Button
            className="self-end "
            onClick={handleFinal}
            isLoading={loading}>
            Yes
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export { DeleteModal };
