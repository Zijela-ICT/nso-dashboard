import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileText, Check, X } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button"; // use your button component

export function QuestionModal({ assessment, open, setOpen }) {
  if (!assessment) return null;

  return (
    <Dialog open={open} onOpenChange={() => setOpen(false)}>
      <DialogContent className="max-w-3xl">
        <DialogTitle>
          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-800">
              {assessment.quizzes?.[0]?.quizName || "Assessment"}
            </h1>
            <p className="text-gray-600">
              Taken by {assessment.user.firstName} {assessment.user.lastName} (
              {assessment.user.email})
            </p>
            <p className="text-gray-500 text-sm">
              Score: {assessment.totalScore} •{" "}
              {assessment.isCompleted ? "Completed" : "Not Completed"}
            </p>
          </div>
        </DialogTitle>

        <div className="mx-auto w-full max-h-[70vh] overflow-y-auto bg-white pr-2">
          {assessment.quizzes.map((quiz) => (
            <div key={quiz.id} className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                {quiz.quizName} – Score: {quiz.quizScore}
              </h2>

              <div className="space-y-6">
                {quiz.questions.map((q, i) => (
                  <div
                    key={q.id}
                    className="bg-gray-50 rounded-lg p-6 border border-gray-200"
                  >
                    {/* Question */}
                    <div className="mb-3">
                      <h3 className="text-md font-semibold text-gray-800 mb-2">
                        Q{i + 1}: {q.question}
                      </h3>
                    </div>

                    {/* Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                      {Object.entries(q.options).map(([key, option]) => {
                        const isSelected = key === q.selectedOption;
                        const isCorrect = key === q.correctOption;

                        return (
                          <div
                            key={key}
                            className={`p-3 rounded border text-gray-700 flex items-center ${
                              isCorrect
                                ? "border-green-500 bg-green-50"
                                : isSelected
                                ? "border-red-500 bg-red-50"
                                : "border-gray-200 bg-white"
                            }`}
                          >
                            <span className="mr-2">{String(option)}</span>
                            {isCorrect && (
                              <Check className="text-green-600 ml-auto w-4 h-4" />
                            )}
                            {isSelected && !q.isCorrect && (
                              <X className="text-red-600 ml-auto w-4 h-4" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Correctness Note */}
                    <p
                      className={`text-sm font-medium ${
                        q.isCorrect ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {q.isCorrect
                        ? "✅ Your answer is correct."
                        : `❌ Your answer is incorrect. Correct answer: ${
                            q.options[q.correctOption]
                          }`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
