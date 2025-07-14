import React, { useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { Upload, FileText, Check, X, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button, Icon } from "@/components/ui";

export default function CSVQuizParser({
  open,
  setOpen,
  proceed,
  loading,
}: {
  open: boolean;
  setOpen: () => void;
  proceed: (questions: any) => void;
  loading: boolean;
}) {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState("");

  const handleDownload = () => {
    const fileUrl =
      "https://res.cloudinary.com/dl78ezj6d/raw/upload/v1752518522/sample_tlnaaa.xlsx"; // Path to file in public directory
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "sample.xlsx"; // Name of the file when downloaded
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Clean up
  };

  const isCSVFile = (file) => {
    return file.type === "text/csv" || file.name.endsWith(".csv");
  };

  const isExcelFile = (file) => {
    return (
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.type === "application/vnd.ms-excel" ||
      file.name.endsWith(".xlsx") ||
      file.name.endsWith(".xls")
    );
  };

  const processData = (data) => {
    try {
      const parsedQuestions = data
        .filter(
          (row) =>
            row.length >= 2 &&
            row[0]?.toString().trim() &&
            row[1]?.toString().trim()
        )
        .map((row, index) => {
          const question = row[0]?.toString().trim();
          const answer = row[1]?.toString().trim();
          const options = row
            .slice(2)
            .filter((option) => option?.toString().trim())
            .map((option) => option.toString().trim());

          return {
            id: index + 1,
            question,
            answer,
            options: options.length > 0 ? options : [],
          };
        });

      setQuestions(parsedQuestions);
    } catch (err) {
      setError("Error parsing file: " + err.message);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    console.log("file.type", file.type);

    if (!file) return;

    if (!isCSVFile(file) && !isExcelFile(file)) {
      setError("Please upload a CSV/XLSX file");
      return;
    }

    setError("");
    if (isCSVFile(file)) {
      Papa.parse(file, {
        complete: (results) => {
          processData(results.data);
        },
        error: (error) => {
          setError("Error reading file: " + error.message);
        },
        header: false,
        skipEmptyLines: true,
        dynamicTyping: false,
      });
    } else if (isExcelFile(file)) {
      // Parse Excel file
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const result = e.target.result;
          if (!result || typeof result === "string") {
            setError("Error reading Excel file: Invalid file data");
            return;
          }

          const data = new Uint8Array(result);
          const workbook = XLSX.read(data, { type: "array" });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            defval: "",
          });

          processData(jsonData);
        } catch (err) {
          setError("Error parsing Excel file: " + err.message);
        }
      };
      reader.onerror = () => {
        setError("Error reading Excel file");
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const resetUpload = () => {
    setQuestions([]);
    setError("");
    // document.getElementById('csv-upload').value = '';
  };

  const removeQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen();
        setQuestions([]);
      }}
    >
      <DialogContent>
        <DialogTitle>
          <div className="mb-8">
            <h1 className="text-xl font-bold text-gray-800 mb-2">
              CSV Quiz Parser
            </h1>
            <p className="text-gray-600">
              Upload a CSV file with questions, answers, and options
            </p>
          </div>
        </DialogTitle>
        <div className="mx-auto w-full max-h-[70vh] overflow-y-auto bg-white">
          {/* Upload Section */}
          {questions.length === 0 && (
            <>
              <div className="p-1">
                <a
                  href="https://res.cloudinary.com/dl78ezj6d/raw/upload/v1752518522/sample_tlnaaa.xlsx"
                  target="_blank"
                  download
                >
                  <div className="flex flex-row items-center justify-between py-2.5 px-5 shadow-md rounded-md mb-4 cursor-pointer">
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
                </a>

                <div className="mb-8">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <label htmlFor="csv-upload" className="cursor-pointer">
                      <span className="text-lg font-medium text-gray-700 hover:text-blue-600">
                        Choose CSV file
                      </span>
                      <p className="text-sm text-gray-500 mt-2">
                        Format: Question, Answer, Option1, Option2, Option3...
                      </p>
                    </label>
                    <input
                      id="csv-upload"
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

                  {loading && (
                    <div className="mt-4 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-md">
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-700 mr-2"></div>
                        Parsing CSV file...
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Results Section */}
          {questions.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-[18px] font-bold text-gray-800 flex items-center">
                  <FileText className="h-6 w-6 mr-2" />
                  Parsed Questions ({questions.length})
                </h2>
                <button
                  onClick={resetUpload}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  Upload New File
                </button>
              </div>

              <div className="space-y-6">
                {questions.map((q, i) => (
                  <div
                    key={q.id}
                    className="bg-gray-50 rounded-lg p-6 border border-gray-200"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          Question {q.id}
                        </h3>
                        <p className="text-gray-700 bg-white p-3 rounded border">
                          {q.question}
                        </p>
                      </div>
                      <button
                        onClick={() => removeQuestion(i)}
                        className="border border-red-500 rounded-full w-[30px] h-[30px] flex items-center justify-center"
                      >
                        <Trash className="text-red-500 w-3" />
                      </button>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-md font-medium text-green-700 mb-2 flex items-center">
                        <Check className="h-4 w-4 mr-1" />
                        Correct Answer
                      </h4>
                      <p className="text-gray-700 bg-green-50 p-3 rounded border border-green-200">
                        {q.answer}
                      </p>
                    </div>

                    {q.options.length > 0 && (
                      <div>
                        <h4 className="text-md font-medium text-gray-700 mb-2">
                          Options ({q.options.length})
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {q.options.map((option, index) => (
                            <div
                              key={index}
                              className="bg-white p-3 rounded border border-gray-200 text-gray-700"
                            >
                              <span className="font-medium text-gray-500 mr-2">
                                {String.fromCharCode(65 + index)}.
                              </span>
                              {option}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            disabled={!questions.length}
            onClick={() => proceed(questions)}
            isLoading={loading}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
