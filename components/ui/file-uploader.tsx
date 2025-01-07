import React, {useRef, useState} from "react";
import {Icon, Spinner} from "../ui";
import {showToast} from "@/utils/toast";

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  acceptedFileTypes?: string;
  maxFileSizeInBytes?: number;
  label?: string;
  isLoading?: boolean;
}

const FileUploader = ({
  onFileSelect,
  acceptedFileTypes = ".csv,.xls,.xlsx",
  maxFileSizeInBytes = 2 * 1024 * 1024, // 200MB
  label = "Upload file",
  isLoading = false,
}: FileUploaderProps) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Convert acceptedFileTypes string to array for easier validation
  const acceptedTypesArray = acceptedFileTypes.split(',').map(type => 
    type.toLowerCase().trim().replace('.', '')
  );

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxFileSizeInBytes) {
      showToast(`File size should be less than ${maxFileSizeInBytes / (1024 * 1024)}MB`, "error");
      return false;
    }

    // Get file extension
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    // Check if file type is accepted
    if (!fileExtension || !acceptedTypesArray.includes(fileExtension)) {
      showToast(`Only ${acceptedTypesArray.join(', ')} files are allowed`, "error");
      return false;
    }

    // Additional MIME type validation
    const validMimeTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (!validMimeTypes.includes(file.type)) {
      showToast("Invalid file type. Please upload a valid spreadsheet file", "error");
      return false;
    }

    return true;
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if any of the dragged files are valid
    if (e.dataTransfer?.items) {
      const hasInvalidFiles = Array.from(e.dataTransfer.items).some(item => {
        const fileExtension = item.type.split('/').pop()?.toLowerCase();
        return !acceptedTypesArray.includes(fileExtension || '');
      });

      if (hasInvalidFiles) {
        setDragActive(false);
        return;
      }
    }

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleFiles = (files: FileList) => {
    const file = files[0];
    
    if (!file) {
      showToast("No file selected", "error");
      return;
    }

    if (validateFile(file)) {
      onFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    // Check if multiple files are being dropped
    if (e.dataTransfer.files.length > 1) {
      showToast("Please upload only one file at a time", "error");
      return;
    }

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <>
          <div className="animate-spin">
            <Spinner className="w-[56px] h-[56px] text-primary" />
          </div>
          <h3 className="font-[600] text-lg md:text-xl mt-2 text-title text-center">
            Uploading file...
          </h3>
          <p className="font-normal text-base mt-2 text-body text-center">
            Please wait while we process your file
          </p>
        </>
      );
    }

    return (
      <>
        <Icon name="upload" className="w-10 h-10 text-[#FBC2B61A]" />
        <h3 className="font-normal text-sm mt-2 text-[#212B36]">
          {dragActive ? "Drop your file here" : "Select a file or drag and drop here"}
        </h3>
        <p className="font-normal text-xs  mt-2 text-center text-[#637381]">
        .CSV file size no more than 2MB
        </p>
      </>
    );
  };

  return (
    <div
      className={`mt-4 flex flex-col items-center justify-center border-dashed border-[#0CA554] border min-h-[200px] rounded-lg ${
        dragActive ? 'border-primary' : ''
      } ${isLoading ? "cursor-default" : "cursor-pointer"}`}
      onDragEnter={!isLoading ? handleDrag : undefined}
      onDragLeave={!isLoading ? handleDrag : undefined}
      onDragOver={!isLoading ? handleDrag : undefined}
      onDrop={!isLoading ? handleDrop : undefined}
      onClick={!isLoading ? onButtonClick : undefined}
      onKeyDown={!isLoading ? onButtonClick : undefined}
    >
      {renderContent()}
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={acceptedFileTypes}
        onChange={handleChange}
        disabled={isLoading}
      />
    </div>
  );
};

export {FileUploader};