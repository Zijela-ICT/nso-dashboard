"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
  Icon,
  Pagination,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Input,
  DatePicker
} from "@/components/ui";
import { useFetchAssessments, useFetchQuizzes } from "@/hooks/api/queries/quiz";
import { useFetchAppUsers } from "@/hooks/api/queries/users";
import { useCreateAssessment } from "@/hooks/api/mutations/quiz";
import { ViewAudience } from "@/components/modals/quiz/view-audience";
import { formatToLocalTime } from "@/utils/date-formatter";

const MultiSelect = dynamic(
  () => import("@/components/ui").then((mod) => mod.MultiSelect),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-10 bg-gray-100 animate-pulse rounded-lg" />
    )
  }
);

const Page = () => {
  const reportsUserPerPage = 50;
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 20; // Adjust as needed

  const createAssessment = useCreateAssessment();
  const { data: assessmentData } = useFetchAssessments(
    currentPage,
    reportsPerPage
  );
  const { data: usersData } = useFetchAppUsers(1, reportsUserPerPage);
  const { data: quizData } = useFetchQuizzes();

  // Existing state
  const [isMounted, setIsMounted] = useState(false);
  const [assessmentTitle, setAssessmentTitle] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedCadre, setSelectedCadre] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [duration, setDuration] = useState("40");
  const [selectedDays, setSelectedDays] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const [assessmentId, setAssessmentId] = useState(null);
  // New state for assignment type
  const [assignmentType, setAssignmentType] = useState(null); // 'user' or 'cadre'

  const quizOptions = React.useMemo(() => {
    if (!quizData?.data) return [];
    return quizData?.data?.data.map((role) => ({
      label: role.name,
      value: role.id
    }));
  }, [quizData?.data]);

  const cadreOptions = [
    { label: "CHO", value: "CHO" },
    { label: "CHEW", value: "CHEW" },
    { label: "JCHEW", value: "JCHEW" }
  ];

  const userList = React.useMemo(() => {
    if (!usersData?.data) return [];
    return usersData?.data?.data?.map((user) => ({
      label: `${user.firstName} ${user.lastName}`,
      value: user.id
    }));
  }, [usersData?.data]);

  const notificationDays = React.useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      value: Number(i + 1),
      label: `${i + 1} ${i + 1 === 1 ? "day" : "days"}`
    }));
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleAssignmentTypeSelect = (type) => {
    setAssignmentType(type);
    // Reset the other selection when switching types
    if (type === "user") {
      setSelectedCadre("");
    } else {
      setSelectedUsers([]);
    }
  };

  const useAssessmentValidation = (
    assessmentTitle: string,
    selectedQuiz: Array<{ value: number }>,
    startDate: Date | undefined,
    endDate: Date | undefined,
    duration: string,
    selectedDays: Array<{ value: number }>,
    assignmentType: string | null,
    selectedUsers: Array<{ value: number }>,
    selectedCadre: string
  ) => {
    const isValid = React.useMemo(() => {
      // Basic field validation
      const hasTitle = assessmentTitle.trim() !== "";
      const hasQuizzes = selectedQuiz.length > 0;
      const hasDates = startDate && endDate;
      const hasDuration = duration !== "" && Number(duration) > 0;
      const hasReminders = selectedDays.length > 0;

      // Assignment type validation
      const hasValidAssignment =
        assignmentType === "user"
          ? selectedUsers.length > 0
          : assignmentType === "cadre"
          ? selectedCadre !== ""
          : false;

      return (
        hasTitle &&
        hasQuizzes &&
        hasDates &&
        hasDuration &&
        hasReminders &&
        hasValidAssignment
      );
    }, [
      assessmentTitle,
      selectedQuiz,
      startDate,
      endDate,
      duration,
      selectedDays,
      assignmentType,
      selectedUsers,
      selectedCadre
    ]);

    return isValid;
  };

  const handleCreateAssessment = async () => {
    if (!startDate || !endDate) {
      return;
    }

    // Create a new Date object to avoid mutating the state
    const startDateCopy = new Date(startDate);
    const endDateCopy = new Date(endDate);

    const formattedStartDate = new Date(
      startDateCopy.setHours(10, 0, 0, 0)
    ).toISOString();
    const formattedEndDate = new Date(
      endDateCopy.setHours(23, 59, 59, 999)
    ).toISOString();

    const payload = {
      name: assessmentTitle,
      quizIds: selectedQuiz,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      duration: Number(duration),
      dayReminderSchedule: selectedDays
    };

    try {
      if (assignmentType === "cadre") {
        await createAssessment.mutateAsync({
          ...payload,
          cadre: selectedCadre as "JCHEW" | "CHEW" | "CHO"
        });
      } else {
        await createAssessment.mutateAsync({
          ...payload,
          audience: selectedUsers
        });
      }

      // Clear all input fields after successful creation
      setAssessmentTitle("");
      setSelectedQuiz([]);
      setSelectedUsers([]);
      setSelectedCadre("");
      setStartDate(undefined);
      setEndDate(undefined);
      setDuration("40");
      setSelectedDays([]);
      setAssignmentType(null);
    } catch (error) {
      // Error handling is already managed by the mutation
      console.error("Failed to create assessment:", error);
    }
  };

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const isFormValid = useAssessmentValidation(
    assessmentTitle,
    selectedQuiz,
    startDate,
    endDate,
    duration,
    selectedDays,
    assignmentType,
    selectedUsers,
    selectedCadre
  );

  if (!isMounted) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Assessment Header */}
      <div className="bg-white p-6 rounded-2xl mb-6 mt-8">
        <div className="flex flex-col space-y-4">
          <Input
            name="assessmentTitle"
            placeholder="Enter assessment title"
            value={assessmentTitle}
            onChange={(e) => setAssessmentTitle(e.target.value)}
            className="text-xl font-semibold mb-2"
          />

          <div className="flex flex-row justify-between w-full items-center space-x-4">
            <div className="w-full">
              <MultiSelect
                isMulti
                usePortal
                options={quizOptions}
                value={selectedQuiz}
                onChange={(value) => setSelectedQuiz(value)}
                placeholder="Select quiz type"
              />
            </div>
            <div className="w-full">
              <MultiSelect
                isMulti
                usePortal
                options={notificationDays}
                value={selectedDays}
                onChange={(value) => setSelectedDays(value)}
                placeholder="notification before assessment"
              />
            </div>

            <div className="w-full">
              <DatePicker
                value={startDate}
                onChange={setStartDate}
                placeholder="Select start date"
              />
            </div>

            <div className="w-full">
              <DatePicker
                value={endDate}
                fromDate={startDate || undefined}
                onChange={setEndDate}
                placeholder="Select end date"
              />
            </div>

            <div className="flex items-center space-x-1">
              <Input
                name="duration"
                type="number"
                className="w-16 text-center"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
              <span className="text-gray-500">Mins</span>
            </div>
          </div>

          <div className="flex flex-row justify-between w-full items-center space-x-4">
            {/* Conditional rendering for user/cadre selection */}
            <div className="w-full">
              {assignmentType === "cadre" ? (
                <Select value={selectedCadre} onValueChange={setSelectedCadre}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select cadre" />
                  </SelectTrigger>
                  <SelectContent>
                    {cadreOptions?.map((cadre) => (
                      <SelectItem key={cadre.value} value={cadre.value}>
                        {cadre.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : assignmentType === "user" ? (
                <MultiSelect
                  isMulti
                  usePortal
                  options={userList}
                  value={selectedUsers}
                  onChange={(value) => setSelectedUsers(value)}
                  placeholder="Select users"
                />
              ) : null}
            </div>
          </div>

          {/* Updated button section */}
          <div className="flex justify-end space-x-4">
            {assignmentType === "cadre" ? (
              <>
                <Button
                  variant="outline"
                  className="w-40"
                  onClick={() => handleAssignmentTypeSelect("user")}>
                  Add to Individuals
                </Button>

                <Button
                  className="w-40"
                  disabled={!isFormValid || createAssessment.isLoading}
                  onClick={handleCreateAssessment}>
                  Create Assessment
                </Button>
              </>
            ) : assignmentType === "user" ? (
              <>
                <Button
                  variant="outline"
                  className="w-40"
                  onClick={() => handleAssignmentTypeSelect("cadre")}>
                  Assign to Cadre
                </Button>
                <Button
                  className="w-40"
                  onClick={handleCreateAssessment}
                  isLoading={createAssessment.isLoading}>
                  Create Assessment
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="w-40"
                  onClick={() => handleAssignmentTypeSelect("user")}>
                  Add to Individuals
                </Button>
                <Button
                  className="w-40"
                  onClick={() => handleAssignmentTypeSelect("cadre")}>
                  Assign to Cadre
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      {/* Assessment Table */}
      <div className="bg-white p-6 rounded-2xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Assessment title</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>CADRE</TableHead>
              <TableHead>Start date</TableHead>
              <TableHead>End date</TableHead>
              <TableHead>Audiences</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assessmentData?.data?.data?.map((assessment, index) => (
              <TableRow key={index}>
                <TableCell>{assessment.name}</TableCell>
                <TableCell>{assessment.duration}</TableCell>
                <TableCell>{assessment.cadre || "N/a"}</TableCell>
                <TableCell>{formatToLocalTime(assessment.startDate)}</TableCell>
                <TableCell>{formatToLocalTime(assessment.endDate)}</TableCell>
                <TableCell>
                  {!assessment.cadre ? (
                    <button
                      className="flex items-center text-gray-600"
                      onClick={() => {
                        setOpenModal(true);
                        setAssessmentId(assessment.id);
                      }}>
                      <span>View audiences</span>
                      <Icon name="chevron-down" className="h-4 w-4 ml-1" />
                    </button>
                  ) : (
                    <span>N/a</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={assessmentData?.data?.totalPages}
            onPageChange={onPageChange}
          />
        </div>
        {!!assessmentId && (
          <ViewAudience
            openModal={openModal}
            setOpenModal={setOpenModal}
            assessmentId={assessmentId}
          />
        )}
      </div>
    </div>
  );
};

export default Page;
