import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui";
import { useFetchSingleAssessment } from "@/hooks/api/queries/quiz";
import React from "react";

interface ViewAudienceModalProps {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  assessmentId: string;
}

// Validation schema

const ViewAudience = ({
  openModal,
  setOpenModal,
  assessmentId
}: ViewAudienceModalProps) => {
  const { data } = useFetchSingleAssessment(assessmentId);

  console.log("data", data);

  const handleClose = () => {
    setOpenModal(false);
  };

  return (
    <AlertDialog open={openModal} onOpenChange={handleClose}>
      <AlertDialogContent className="max-w-md w-full md:max-w-[600px]">
        <AlertDialogHeader className="space-y-3 relative">
          <div className="flex items-start justify-between !mt-0">
            <div className="flex-1">
              <AlertDialogTitle className="text-[#212B36] text-2xl font-normal">
                Audience
              </AlertDialogTitle>
            </div>
            <button
              type="button"
              onClick={handleClose}
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
        <div className="flex flex-col item-start gap-8">
          {data?.data?.audience.map((audience) => (
            <div key={audience?.id} className="text-[#101828] font-medium text-base">{audience?.id}</div>
          ))}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export { ViewAudience };
