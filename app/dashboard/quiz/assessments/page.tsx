"use client";
import React, { useState } from "react";
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
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  DatePicker,
  MultiSelect
} from "@/components/ui";
import { useFetchQuizzes } from "@/hooks/api/queries/quiz";

interface Assessment {
  title: string;
  quiz: string;
  startDate: string;
  endDate: string;
  audience: string;
  duration: number;
}

const Page = () => {
  const { data: quizData } = useFetchQuizzes();
  const [currentPage, setCurrentPage] = useState(1);
  const [assessmentTitle, setAssessmentTitle] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [duration, setDuration] = useState("40");

  const [selectedDays, setSelectedDays] = useState<{ value: string; name: string }[]>([]);

  const quizOptions = React.useMemo(() => {
    if (!quizData?.data) return [];
    return quizData?.data?.data.map((role) => ({
      label: role.name,
      value: role.id
    }));
  }, [quizData?.data]);

  const notificationDays = React.useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      value: String(i + 1),
      label: `${i + 1} ${i + 1 === 1 ? 'day' : 'days'}`
    }));
  }, []);


  // Mock data for the assessment list
  const assessments = [
    {
      title: "JCEW Assessment",
      quiz: "Malaria Assessment",
      startDate: "12/12/2024",
      endDate: "31/12/2024",
      audience: "View audience",
      duration: 40
    },
    {
      title: "Ruth",
      quiz: "Bamidele",
      startDate: "123456789",
      endDate: "123456789",
      audience: "View audience",
      duration: 40
    },
    {
      title: "Jacob",
      quiz: "Jacobs",
      startDate: "123456789",
      endDate: "123456789",
      audience: "View audience",
      duration: 40
    },
    {
      title: "Olusegun",
      quiz: "Sylvester",
      startDate: "123456789",
      endDate: "123456789",
      audience: "View audience",
      duration: 40
    },
    {
      title: "Amaka",
      quiz: "Egwuda",
      startDate: "123456789",
      endDate: "123456789",
      audience: "View audience",
      duration: 40
    },
    {
      title: "Garuba",
      quiz: "Adamu",
      startDate: "123456789",
      endDate: "123456789",
      audience: "View audience",
      duration: 40
    }
  ];

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

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
               onChange={setSelectedQuiz}
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
                onChange={setEndDate}
                placeholder="Select end date"
              />
            </div>

            <div className="flex items-center space-x-1">
              <Input
                type="number"
                className="w-16 text-center"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
              <span className="text-gray-500">Mins</span>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button variant="outline" className="w-40">
              Add to Individuals
            </Button>
            <Button className="w-40 bg-green-600 hover:bg-green-700 text-white">
              Assign to Cadre
            </Button>
          </div>
        </div>
      </div>

      {/* Assessment Table */}
      <div className="bg-white p-6 rounded-2xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Assessment title</TableHead>
              <TableHead>Quiz</TableHead>
              <TableHead>Start date</TableHead>
              <TableHead>End date</TableHead>
              <TableHead>Audience</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assessments.map((assessment, index) => (
              <TableRow key={index}>
                <TableCell>{assessment.title}</TableCell>
                <TableCell>{assessment.quiz}</TableCell>
                <TableCell>{assessment.startDate}</TableCell>
                <TableCell>{assessment.endDate}</TableCell>
                <TableCell>
                  <button
                    className="flex items-center text-gray-600"
                    onClick={() => {}}>
                    {assessment.audience}
                    <Icon name="chevron-down" className="h-4 w-4 ml-1" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={5}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
