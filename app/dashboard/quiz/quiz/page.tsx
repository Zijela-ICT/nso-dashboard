"use client";
import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Plus,
  X,
  Check,
  ChevronDown,
  ChevronUp,
  Search,
  Trash,
} from "lucide-react";
import {
  useBulkCreateQuestion,
  useCreateQuestion,
  useCreateQuiz,
  useDeleteQuiz,
} from "@/hooks/api/mutations/quiz";
import {
  useFetchQuestions,
  QuestionsDataResponse,
  useFetchQuizzes,
} from "@/hooks/api/queries/quiz";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Pagination,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui";
import { deleteQuizQuestion } from "@/utils/quiz.service";
import CSVQuizParser from "./components/CSVQuizParser";
import { QuestionModal } from "./components/question-modal";
import { useApproveQuiz } from "@/hooks/api/mutations/quiz/useApproveQuiz";

type TabTypes = "New Quiz" | "Question bank" | "Quiz List";

interface Question {
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correctOption: string;
  id?: number;
}

interface iQuestion {
  question: string;
  options: string[];
  answer: string;
  id: number;
}

const QuizContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const {
    data: fetchedQuestions,
    isLoading: questionsLoading,
    refetch: getQuestions,
  } = useFetchQuestions(currentPage);
  const reportsPerPage = 10;
  const {
    data: quizzesData,
    isLoading: quizzesLoading,
    error: quizzesError,
  } = useFetchQuizzes(currentPage, reportsPerPage, search);
  const { mutate: createQuestion } = useCreateQuestion();
  const { mutate: createBulkQuestion, isLoading: bulkLoading } =
    useBulkCreateQuestion();
  const { mutate: submitQuiz } = useCreateQuiz();
  const { mutate: approveQuiz, isLoading: isApproving } = useApproveQuiz();
  const { mutate: deleteQuiz, isLoading: isDeleting } = useDeleteQuiz();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedBankQuestion, setExpandedBankQuestion] = useState<
    number | null
  >(null);
  const [isAddingNewQuestion, setIsAddingNewQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState<Question>({
    question: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    correctOption: "",
  });

  const tabs: TabTypes[] = ["New Quiz", "Question bank", "Quiz List"];
  const tab = searchParams.get("tab") as TabTypes;
  const [selectedTab, setSelectedTab] = useState<TabTypes>(tab || "New Quiz");
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleTabClick = (tab: TabTypes) => {
    setSelectedTab(tab);
    router.push(`?tab=${tab}`, { scroll: false });
  };

  const isQuestionComplete = (question: Question) => {
    return (
      question.question &&
      question.option1 &&
      question.option2 &&
      question.option3 &&
      question.option4 &&
      question.correctOption
    );
  };

  const handleQuestionSubmit = () => {
    if (!isQuestionComplete(newQuestion)) {
      alert("Please fill in all fields");
      return;
    }

    createQuestion(newQuestion, {
      onSuccess: (response) => {
        const newId = response.data?.data;
        setSelectedQuestions((prev) => [...prev, Number(newId)]);
        // Clear all input fields and close the form
        setNewQuestion({
          question: "",
          option1: "",
          option2: "",
          option3: "",
          option4: "",
          correctOption: "",
        });
        getQuestions();
        setIsAddingNewQuestion(false); // Close the form
      },
    });
  };

  const handleQuestionsUpload = (questions: iQuestion[]) => {
    const data: Question[] = questions.map((q) => {
      const result: Question = {
        question: q.question,
        option1: "",
        option2: "",
        option3: "",
        option4: "",
        correctOption: "",
      };
      const resultIndex = q.options.findIndex((option) => option === q.answer);
      result.question = q.question;
      result.correctOption = `option${resultIndex + 1}`;

      q.options.forEach((option, index) => {
        if (index === 0) result.option1 = option;
        else if (index === 1) result.option2 = option;
        else if (index === 2) result.option3 = option;
        else if (index === 3) result.option4 = option;
      });
      return result;
    });

    createBulkQuestion(
      { questions: data },
      {
        onSuccess: () => {
          getQuestions();
          setOpen(false);
          setNewQuestion({
            question: "",
            option1: "",
            option2: "",
            option3: "",
            option4: "",
            correctOption: "",
          });
        },
      }
    );
  };

  const handleQuestionSelect = (questionId: number) => {
    setSelectedQuestions((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  };

  const handleCreateQuiz = () => {
    if (!title || !description) {
      alert("Please fill in quiz title and description");
      return;
    }
    if (selectedQuestions.length === 0) {
      alert("Please select at least one question");
      return;
    }
    submitQuiz({
      name: title,
      description,
      questionIds: selectedQuestions,
    });
  };

  const updateNewQuestion = (field: keyof Question, value: string) => {
    setNewQuestion((prev) => ({ ...prev, [field]: value }));
  };

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDeleteQuestion = async (questionId: number) => {
    try {
      await deleteQuizQuestion(questionId.toString());
      getQuestions();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteQuiz = (quizId: number) => {
    deleteQuiz(quizId);
  };
  const handleApproveQuiz = (quizId: number) => {
    approveQuiz({ id: quizId });
  };

  const renderNewQuiz = () => {
    const selectedQuestionsList =
      fetchedQuestions?.data?.data?.filter((q) =>
        selectedQuestions.includes(q.id)
      ) || [];

    return (
      <div className="space-y-6 bg-white p-6 rounded-lg">
        <div className="space-y-4">
          <Input
            name="title"
            placeholder="Input quiz title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl"
          />
          <Input
            name="description"
            placeholder="Quiz description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <Button
          onClick={() => handleTabClick("Question bank")}
          variant="outline"
          className="w-full"
        >
          Add Questions from Bank
        </Button>

        <div className="space-y-4">
          {selectedQuestionsList.map((question) => (
            <div key={question.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="flex-1">{question.question}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuestionSelect(question.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {selectedQuestions.length > 0 && (
          <Button
            onClick={handleCreateQuiz}
            className="w-32 bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
          >
            Create Quiz
          </Button>
        )}
      </div>
    );
  };

  const renderQuestionBank = () => {
    if (questionsLoading) return <div>Loading...</div>;

    const filteredQuestions = fetchedQuestions?.data?.data?.filter((q) =>
      q.question.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="space-y-4 bg-white p-6 rounded-lg">
        <div className="flex justify-between items-center">
          <div className="relative flex-1 mr-4">
            <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
            <Input
              name="searchTerm"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            onClick={() => setIsAddingNewQuestion(true)}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Question
          </Button>
        </div>

        {isAddingNewQuestion && (
          <div className="border rounded-lg p-4 space-y-4">
            <Input
              name="question"
              placeholder="Enter question"
              value={newQuestion.question}
              onChange={(e) => updateNewQuestion("question", e.target.value)}
            />
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="flex items-center gap-2">
                <Input
                  name={`option${num}`}
                  placeholder={`Option ${num}`}
                  value={newQuestion[`option${num}` as keyof Question]}
                  onChange={(e) =>
                    updateNewQuestion(
                      `option${num}` as keyof Question,
                      e.target.value
                    )
                  }
                  className="flex-1"
                />
                <Button
                  variant={
                    newQuestion.correctOption === `option${num}`
                      ? "default"
                      : "outline"
                  }
                  size="icon"
                  onClick={() =>
                    updateNewQuestion("correctOption", `option${num}`)
                  }
                >
                  {newQuestion.correctOption === `option${num}` ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))}
            <div className="flex gap-2">
              <Button
                onClick={handleQuestionSubmit}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                disabled={!isQuestionComplete(newQuestion)}
              >
                Add Question
              </Button>
              <Button
                onClick={() => setIsAddingNewQuestion(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {filteredQuestions?.map((question: QuestionsDataResponse) => (
          <div key={question.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={selectedQuestions.includes(question.id)}
                  onCheckedChange={() => handleQuestionSelect(question.id)}
                />
                <span className="flex-1">{question.question}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <Trash className="h-4 w-4 text-destructive" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setExpandedBankQuestion(
                      expandedBankQuestion === question.id ? null : question.id
                    )
                  }
                >
                  {expandedBankQuestion === question.id ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {expandedBankQuestion === question.id && (
              <div className="mt-4 space-y-2 pl-8">
                <div>Option 1: {question.option1}</div>
                <div>Option 2: {question.option2}</div>
                <div>Option 3: {question.option3}</div>
                <div>Option 4: {question.option4}</div>
                <div className="text-green-600">
                  Correct Option:{" "}
                  {
                    question[
                      question.correctOption as keyof QuestionsDataResponse
                    ]
                  }
                </div>
              </div>
            )}
          </div>
        ))}

        {selectedQuestions.length > 0 && (
          <div className="fixed bottom-6 right-6 space-x-4">
            <Button
              onClick={() => handleTabClick("New Quiz")}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Return to Quiz ({selectedQuestions.length} selected)
            </Button>
          </div>
        )}

        <Pagination
          currentPage={fetchedQuestions.data.currentPage}
          totalPages={fetchedQuestions?.data?.totalPages}
          onPageChange={onPageChange}
        />
      </div>
    );
  };

  const renderQuizList = () => {
    return (
      <div className="space-y-4 bg-white p-6 rounded-lg">
        <div className="px-4">
          <input
            className="border border-[#919EAB33] px-12 py-4 rounded-lg w-full text-[#637381] placeholder:text-[#637381] text-sm"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="bg-white p-4 rounded-2xl">
          {quizzesLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">Loading quizzes...</div>
            </div>
          ) : quizzesError ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-red-500">
                Error loading quizzes. Please try again.
              </div>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quiz Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>No of Questions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quizzesData?.data?.data?.map((quiz) => (
                    <TableRow className="cursor-pointer" key={quiz.id}>
                      <TableCell
                        className="font-medium hover:text-blue-500 cursor-pointer"
                        onClick={() => {
                          setSelectedQuiz(quiz);
                          setModalOpen(true);
                        }}
                      >
                        {quiz.name}
                      </TableCell>
                      <TableCell
                        className="max-w-xs truncate"
                        title={quiz.description}
                      >
                        {quiz.description}
                      </TableCell>
                      <TableCell className="font-medium">
                        {quiz.questions?.length}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            quiz.isApproved
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {quiz.isApproved ? "Approved" : "Pending"}
                        </span>
                      </TableCell>
                      <TableCell>
                        {new Date(quiz.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(quiz.updatedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {/* Approval Action - only show if not approved */}
                          {!quiz.isApproved && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-green-600 hover:text-green-600 hover:bg-green-100"
                                  title="Approve Quiz"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Approve Quiz
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to approve &quot;
                                    {quiz.name}&quot;? Once approved, this quiz
                                    will be available for use.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleApproveQuiz(quiz.id)}
                                    className="bg-green-600 text-white hover:bg-green-700"
                                    disabled={isApproving}
                                  >
                                    {isApproving ? "Approving..." : "Approve"}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}

                          {/* Delete Action */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                title="Delete Quiz"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Quiz</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete &quot;
                                  {quiz.name}&quot;? This action cannot be
                                  undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteQuiz(quiz.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  disabled={isDeleting}
                                >
                                  {isDeleting ? "Deleting..." : "Delete"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={quizzesData?.data?.totalPages || 1}
                  onPageChange={onPageChange}
                />
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="w-full mt-8">
        <div className="flex justify-between items-center mb-6">
          <div className="w-full flex flex-row items-center gap-10 overflow-x-scroll bg-white p-4 rounded-2xl">
            {tabs.map((name) => (
              <div
                key={name}
                className={`py-3 font-semibold cursor-pointer ${
                  name === selectedTab
                    ? "border-b-2 border-[#0CA554] text-[#212B36]"
                    : "text-[#637381]"
                }`}
                onClick={() => handleTabClick(name)}
              >
                {name}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setOpen(true)} size="sm" className="w-fit">
              Upload questions
            </Button>
          </div>
        </div>

        {selectedTab === "New Quiz"
          ? renderNewQuiz()
          : selectedTab === "Question bank"
          ? renderQuestionBank()
          : renderQuizList()}
      </div>
      <QuestionModal
        quiz={selectedQuiz}
        open={modalOpen}
        setOpen={setModalOpen}
      />
      <CSVQuizParser
        open={open}
        setOpen={() => setOpen(false)}
        proceed={(questions) => handleQuestionsUpload(questions)}
        loading={bulkLoading}
      />
    </>
  );
};

const QuizLoadingFallback = () => {
  return (
    <div className="w-full mt-8 space-y-4">
      <div className="w-full h-16 bg-gray-100 animate-pulse rounded-2xl"></div>
      <div className="w-full h-[600px] bg-gray-100 animate-pulse rounded-lg"></div>
    </div>
  );
};

const Page = () => {
  return (
    <Suspense fallback={<QuizLoadingFallback />}>
      <QuizContent />
    </Suspense>
  );
};

export default Page;
