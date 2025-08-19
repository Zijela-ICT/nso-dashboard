"use client";
import React, { useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { Upload, FileText, X, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Icon,
} from "@/components/ui";

// Facility type matches your API schema
export type Facility = {
  id?: number;
  name: string;
  type: "public" | "private";
  address: string;
  contact: string;
  status: "active" | "inactive";
  location: "urban" | "rural";
  careLevel: "primary" | "secondary" | "tertiary";
  longitude: number;
  latitude: number;
};

type UploadBulkFacilityProps = {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  proceed: (facilities: Facility[]) => void; // strict typed
  loading?: boolean;
};

export const UploadBulkFacility = ({
  openModal,
  setOpenModal,
  proceed,
  loading,
}: UploadBulkFacilityProps) => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [error, setError] = useState<string>("");

  const requiredHeaders: (keyof Facility)[] = [
    "name",
    "type",
    "address",
    "contact",
    "status",
    "location",
    "careLevel",
    "longitude",
    "latitude",
  ];

  const handleSampleDownload = () => {
    const sampleUrl = "/bulk-samples/bulk_facilities.csv";
    const link = document.createElement("a");
    link.href = sampleUrl;
    link.download = "sample_facilities.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isCSVFile = (file: File) =>
    file.type === "text/csv" || file.name.endsWith(".csv");

  const isExcelFile = (file: File) =>
    file.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    file.type === "application/vnd.ms-excel" ||
    file.name.endsWith(".xlsx") ||
    file.name.endsWith(".xls");

  const processData = (data: unknown[][]) => {
    try {
      const [headers, ...rows] = data;

      if (!headers) {
        setError("No headers found in file");
        return;
      }

      const missing = requiredHeaders.filter(
        (header) => !(headers as string[]).includes(header)
      );
      if (missing.length > 0) {
        setError("Missing headers: " + missing.join(", "));
        return;
      }

      const parsedFacilities: Facility[] = rows
        .filter((row) => row.some((cell) => cell !== ""))
        .map((row) => {
          const facility: Partial<Facility> = {};
          (headers as string[]).forEach((header, i) => {
            const key = header as keyof Facility;
            let value: string | number = row[i] as string | number;

            if (key === "longitude" || key === "latitude") {
              value = Number(value);
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (facility as any)[key] = value;
          });

          return { ...facility } as Facility;
        });

      setFacilities(parsedFacilities);
    } catch (err) {
      setError("Error parsing file: " + (err as Error).message);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!isCSVFile(file) && !isExcelFile(file)) {
      setError("Please upload a CSV/XLSX file");
      return;
    }

    setError("");

    if (isCSVFile(file)) {
      Papa.parse(file, {
        complete: (results) => processData(results.data as unknown[][]),
        error: (error) => setError("Error reading file: " + error.message),
        header: false,
        skipEmptyLines: true,
      });
    } else if (isExcelFile(file)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const firstSheet = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheet];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            defval: "",
          });
          processData(jsonData as unknown[][]);
        } catch (err) {
          setError("Error parsing Excel file: " + (err as Error).message);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const resetUpload = () => {
    setFacilities([]);
    setError("");
  };

  const removeFacility = (index: number) => {
    setFacilities((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <AlertDialog open={openModal} onOpenChange={() => setOpenModal(false)}>
      <AlertDialogContent className="max-w-2xl w-full">
        <AlertDialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <AlertDialogTitle className="text-[#212B36] text-xl font-semibold">
                Upload Bulk Facilities
              </AlertDialogTitle>
              <AlertDialogDescription className="text-[#637381] text-base">
                Import CSV / Excel file
              </AlertDialogDescription>
            </div>
            <div onClick={() => setOpenModal(false)} className="w-6 h-6">
              <Icon name="cancel" className="h-6 w-6 text-[#A4A7AE]" />
            </div>
          </div>
        </AlertDialogHeader>

        {/* Upload Section */}
        {facilities.length === 0 && (
          <div className="mt-6">
            <div
              onClick={handleSampleDownload}
              className="flex flex-row items-center justify-between py-2.5 px-5 shadow-md rounded-md cursor-pointer"
            >
              <div className="flex flex-row items-center gap-5">
                <FileText className="w-6 h-6 text-gray-500" />
                <p className="text-[#637381] text-sm">
                  Download Sample file format for uploading
                </p>
              </div>
              <Icon name="download" className="w-6 h-6" />
            </div>

            <div className="mt-6 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:bg-gray-100">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <label htmlFor="facility-upload" className="cursor-pointer">
                <span className="text-lg font-medium text-gray-700 hover:text-blue-600">
                  Choose CSV/Excel file
                </span>
              </label>
              <input
                id="facility-upload"
                type="file"
                accept=".csv, .xlsx, .xls"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md flex items-center">
                <X className="h-5 w-5 mr-2" />
                {error}
              </div>
            )}
          </div>
        )}

        {/* Preview Section */}
        {facilities.length > 0 && (
          <div className="mt-6 max-h-[400px] overflow-y-auto space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-gray-800">
                Parsed Facilities ({facilities.length})
              </h2>
              <Button
                onClick={resetUpload}
                className="bg-gray-500 hover:bg-gray-600"
              >
                Upload New File
              </Button>
            </div>

            {facilities.map((f, i) => (
              <div
                key={f.id}
                className="bg-gray-50 rounded-lg p-4 border flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold text-gray-800">{f.name}</h3>
                  <p className="text-sm text-gray-600">
                    {f.type} • {f.careLevel} • {f.status}
                  </p>
                  <p className="text-sm text-gray-500">{f.address}</p>
                </div>
                <button
                  onClick={() => removeFacility(i)}
                  className="border border-red-500 rounded-full w-7 h-7 flex items-center justify-center"
                >
                  <Trash className="text-red-500 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end mt-6">
          <Button
            disabled={!facilities.length}
            onClick={() => proceed(facilities)}
            isLoading={loading}
          >
            Submit
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
