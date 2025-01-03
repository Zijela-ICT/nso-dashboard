import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  FileUploader,
  Icon,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui";
import { useFormik } from "formik";
import React from "react";

type UploadBulkUserModal = {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
};
const UploadBulkUser = ({ openModal, setOpenModal }: UploadBulkUserModal) => {
  return (
    <AlertDialog open={openModal} onOpenChange={() => setOpenModal(false)}>
      <AlertDialogContent className="max-w-md w-full md:max-w-[600px]">
        <AlertDialogHeader className="space-y-3 relative">
          <div className="flex items-start justify-between !mt-0">
            <AlertDialogTitle className="text-lg text-primary">
              <h3 className="text-[#212B36] text-xl font-semibold ">
                Upload Bulk User
              </h3>
              <p className="text-[#637381] text-base font-normal">
                Import CSV /Excel file
              </p>
            </AlertDialogTitle>
            <div onClick={() => setOpenModal(false)} className="w-6 h-6">
              <Icon
                name="cancel"
                className="h-6 w-6 text-[#A4A7AE] cursor-pointer"
              />
            </div>
          </div>
        </AlertDialogHeader>

        <div className="w-full flex flex-col gap-4 mt-6">
          <div className="flex flex-row items-center justify-between py-2.5 px-5 shadow-md rounded-md">
            <div className="flex flex-row items-center gap-5">
              <div className="w-11 h-11">
                <Icon name="file" className="w-11 h-11" />
              </div>
              <p className="text-[#637381] text-sm font-normal">
                Download Sample file format for uploading
              </p>
            </div>
            <Icon name="download" className="w-6 h-6" />
          </div>

          <FileUploader onFileSelect={
            (file) => {
              console.log(file);
            }
          } />
        </div>

        <Button className="self-end mt-4" type="submit">
          Submit
        </Button>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export {UploadBulkUser};
