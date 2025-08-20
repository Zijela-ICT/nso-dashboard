"use client";
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Pagination,
} from "@/components/ui";
import { useFetchAssessmentsID } from "@/hooks/api/queries/quiz";
import { formatToLocalTime } from "@/utils/date-formatter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { QuestionModal } from "./question-modal";

const ResultsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [questions, setQuestions] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { id } = useParams();
  const router = useRouter();
  const reportsPerPage = 10;

  const { data, isLoading, error } = useFetchAssessmentsID(
    currentPage,
    reportsPerPage,
    Number(id)
  );

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getScoreColor = (
    score: string
  ): "success" | "pending" | "failed" | "overdue" => {
    const numScore = parseFloat(score);
    if (numScore >= 80) return "success";
    if (numScore >= 60) return "pending";
    return "failed";
  };

  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        <div className="flex items-center">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Quiz Results</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="w-full h-20 bg-gray-100 animate-pulse rounded-lg"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="w-full h-[400px] bg-gray-100 animate-pulse rounded-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="flex justify-between items-center mb-6">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Quiz Results</h1>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="text-red-500">
            Error loading quiz results. Please try again.
          </div>
        </div>
      </div>
    );
  }

  const results = data?.data?.submissions?.data || [];
  const totalPages = data?.data?.submissions?.totalPages || 1;

  return (
    <div className="w-full space-y-6">
      {/* Back button */}
      <div className="flex items-center gap-4 pt-4">
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="flex items-center gap-2 w-32"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <h1 className="text-xl font-bold">Quiz Results</h1>
      </div>

      {/* Results Table */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>
            {data?.data?.assessment?.name || "Assessment Results"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {results.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">
                No completed assessments found.
              </div>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User Name</TableHead>
                    <TableHead>User Cadre</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submission Date</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Late Submission</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell
                        className="font-medium hover:text-blue-500"
                        onClick={() => {
                          setModalOpen(true);
                          setQuestions(result);
                        }}
                      >
                        {result.user.firstName || ""}{" "}
                        {result.user.lastName || ""}
                      </TableCell>
                      <TableCell className="font-medium">
                        {result.user.cadre || ""}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getScoreColor(String(result.totalScore))}
                        >
                          {result.totalScore ? `${result.totalScore}%` : "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={result.isCompleted ? "success" : "pending"}
                        >
                          {result.isCompleted ? "Completed" : "In Progress"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatToLocalTime(result.submissionDate)}
                      </TableCell>
                      <TableCell>
                        {(() => {
                          const start = new Date(result.startDate);
                          const submission = new Date(result.submissionDate);
                          const durationMs =
                            submission.getTime() - start.getTime();
                          const minutes = Math.floor(durationMs / (1000 * 60));
                          const hours = Math.floor(minutes / 60);
                          const remainingMinutes = minutes % 60;

                          if (hours > 0) {
                            return `${hours}h ${remainingMinutes}m`;
                          }
                          return `${remainingMinutes}m`;
                        })()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={result.isCompleted ? "failed" : "success"}
                        >
                          {result.isCompleted ? "Late" : "On Time"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={onPageChange}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
      <QuestionModal
        assessment={questions}
        open={modalOpen}
        setOpen={setModalOpen}
      />
    </div>
  );
};

export default ResultsPage;
