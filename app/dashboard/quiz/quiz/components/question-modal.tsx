import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileText, Check } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";

export function QuestionModal({ quiz, open, setOpen }) {
  if (!quiz) return null;

  return (
    <Dialog open={open} onOpenChange={() => setOpen(false)}>
      <DialogContent className="max-w-3xl">
        <DialogTitle>
          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-800">
              {quiz.name || "Quiz"}
            </h1>
            <p className="text-gray-600">{quiz.description}</p>
          </div>
        </DialogTitle>

        <div className="mx-auto w-full max-h-[70vh] overflow-y-auto bg-white pr-2">
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
              <FileText className="h-5 w-5 mr-2 text-blue-600" />
              {quiz.name}
            </h2>

            <div className="space-y-6">
              {quiz.questions.map((q, i) => (
                <div
                  key={q.id}
                  className="bg-gray-50 rounded-lg p-6 border border-gray-200"
                >
                  <div className="mb-3">
                    <h3 className="text-md font-semibold text-gray-800 mb-2">
                      Q{i + 1}: {q.question}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                    {["option1", "option2", "option3", "option4"].map((key) => {
                      const isCorrect = key === q.correctOption;
                      // Note: Since we don't have selectedOption in the new data,
                      // we'll skip selection state rendering
                      return (
                        <div
                          key={key}
                          className={`p-3 rounded border text-gray-700 flex items-center ${
                            isCorrect
                              ? "border-green-500 bg-green-50"
                              : "border-gray-200 bg-white"
                          }`}
                        >
                          <span className="mr-2">{q[key]}</span>
                          {isCorrect && (
                            <Check className="text-green-600 ml-auto w-4 h-4" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <p className="text-sm font-medium text-green-700">
                    Correct answer: {q[q.correctOption]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
