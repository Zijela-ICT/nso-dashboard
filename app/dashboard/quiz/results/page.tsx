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
import { useFetchCompletedAssessments } from "@/hooks/api/queries/quiz";
import { formatToLocalTime } from "@/utils/date-formatter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const ResultsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 10;

  const {
    data: completedAssessments,
    isLoading,
    error,
  } = useFetchCompletedAssessments(currentPage, reportsPerPage);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  // const getScoreColor = (
  //   score: string
  // ): "success" | "pending" | "failed" | "overdue" => {
  //   const numScore = parseFloat(score);
  //   if (numScore >= 80) return "success";
  //   if (numScore >= 60) return "pending";
  //   return "failed";
  // };

  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        <div className="flex justify-between items-center">
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

  const results = completedAssessments?.data?.data || [];
  // const totalCount = completedAssessments?.data?.totalCount || 0;
  const totalPages = completedAssessments?.data?.totalPages || 1;

  // Calculate summary statistics
  // const totalSubmissions = totalCount;
  // const averageScore =
  //   results.length > 0
  //     ? (
  //         results.reduce(
  //           (sum, result) => sum + parseFloat(result.totalScore),
  //           0
  //         ) / results.length
  //       ).toFixed(1)
  //     : "0";
  // const passedCount = results.filter(
  //   (result) => parseFloat(result.totalScore) >= 60
  // ).length;
  // const passRate =
  //   results.length > 0
  //     ? ((passedCount / results.length) * 100).toFixed(1)
  //     : "0";

  return (
    <div className="w-full space-y-6">
      {/* Summary Cards */}
      {/* Results Table */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Assessment Results</CardTitle>
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
                    <TableHead>Assessment Name</TableHead>
                    {/* <TableHead>Score</TableHead> */}
                    <TableHead>Status</TableHead>
                    <TableHead>Submission Date</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Late Submission</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell className="font-medium hover:text-blue-500">
                        <Link href={`/dashboard/quiz/results/${result.id}`}>
                          {result.assessment.name}
                        </Link>
                      </TableCell>
                      {/* <TableCell>
                        <Badge variant={getScoreColor(result.totalScore)}>
                          {result.totalScore}%
                        </Badge>
                      </TableCell> */}
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
                          variant={
                            result.isLateSubmission ? "failed" : "success"
                          }
                        >
                          {result.isLateSubmission ? "Late" : "On Time"}
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
    </div>
  );
};

export default ResultsPage;
