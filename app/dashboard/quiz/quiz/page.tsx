'use client'
import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X, Check, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { useCreateQuestion, useCreateQuiz } from '@/hooks/api/mutations/quiz';
import { useFetchQuestions, QuestionsDataResponse } from '@/hooks/api/queries/quiz';
import { Checkbox } from '@/components/ui/checkbox';

type TabTypes = "New Quiz" | "Question bank";

interface Question {
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correctOption: string;
  id?: number;
}

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {data: fetchedQuestions, isLoading} = useFetchQuestions();
  const { mutate: createQuestion } = useCreateQuestion();
  const { mutate: submitQuiz } = useCreateQuiz();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedBankQuestion, setExpandedBankQuestion] = useState<number | null>(null);
  const [isAddingNewQuestion, setIsAddingNewQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState<Question>({
    question: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    correctOption: ''
  });

  const tabs: TabTypes[] = ["New Quiz", "Question bank"];
  const tab = searchParams.get("tab") as TabTypes;
  const [selectedTab, setSelectedTab] = useState<TabTypes>(tab || "New Quiz");

  const handleTabClick = (tab: TabTypes) => {
    setSelectedTab(tab);
    router.push(`?tab=${tab}`, { scroll: false });
  };

  const isQuestionComplete = (question: Question) => {
    return question.question &&
           question.option1 &&
           question.option2 &&
           question.option3 &&
           question.option4 &&
           question.correctOption;
  };

  const handleQuestionSubmit = () => {
    if (!isQuestionComplete(newQuestion)) {
      alert('Please fill in all fields');
      return;
    }

    createQuestion(newQuestion, {
      onSuccess: (response) => {
        const newId = response.data.data;
        setSelectedQuestions(prev => [...prev, Number(newId)]);
        // Clear all input fields and close the form
        setNewQuestion({
          question: '',
          option1: '',
          option2: '',
          option3: '',
          option4: '',
          correctOption: ''
        });
        setIsAddingNewQuestion(false); // Close the form
      }
    });
  };

  const handleQuestionSelect = (questionId: number) => {
    setSelectedQuestions(prev => 
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const handleCreateQuiz = () => {
    if (!title || !description) {
      alert('Please fill in quiz title and description');
      return;
    }
    if (selectedQuestions.length === 0) {
      alert('Please select at least one question');
      return;
    }
    submitQuiz({
      name: title,
      description,
      questionIds: selectedQuestions
    });
  };

  const updateNewQuestion = (field: keyof Question, value: string) => {
    setNewQuestion(prev => ({ ...prev, [field]: value }));
  };

  const renderNewQuiz = () => {
    const selectedQuestionsList = fetchedQuestions?.data?.data?.filter(q => 
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
    if (isLoading) return <div>Loading...</div>;
  
    const filteredQuestions = fetchedQuestions?.data?.data?.filter(q => 
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
              onChange={(e) => updateNewQuestion('question', e.target.value)}
            />
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="flex items-center gap-2">
                <Input
                name={`option${num}`}
                  placeholder={`Option ${num}`}
                  value={newQuestion[`option${num}` as keyof Question]}
                  onChange={(e) => updateNewQuestion(`option${num}` as keyof Question, e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant={newQuestion.correctOption === `option${num}` ? "default" : "outline"}
                  size="icon"
                  onClick={() => updateNewQuestion('correctOption', `option${num}`)}
                >
                  {newQuestion.correctOption === `option${num}` ? 
                    <Check className="h-4 w-4" /> : 
                    <X className="h-4 w-4" />
                  }
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
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setExpandedBankQuestion(
                  expandedBankQuestion === question.id ? null : question.id
                )}
              >
                {expandedBankQuestion === question.id ? 
                  <ChevronUp className="h-4 w-4" /> : 
                  <ChevronDown className="h-4 w-4" />
                }
              </Button>
            </div>
  
            {expandedBankQuestion === question.id && (
              <div className="mt-4 space-y-2 pl-8">
                <div>Option 1: {question.option1}</div>
                <div>Option 2: {question.option2}</div>
                <div>Option 3: {question.option3}</div>
                <div>Option 4: {question.option4}</div>
                <div className="text-green-600">
                  Correct Option: {question[question.correctOption as keyof QuestionsDataResponse]}
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
      </div>
    );
  };

  return (
    <div className="w-full mt-8">
      <div className="w-full flex flex-row items-center gap-10 overflow-x-scroll bg-white p-4 rounded-2xl mb-6">
        {tabs.map((name) => (
          <div
            key={name}
            className={`py-3 font-semibold cursor-pointer ${
              name === selectedTab 
                ? 'border-b-2 border-[#0CA554] text-[#212B36]' 
                : 'text-[#637381]'
            }`}
            onClick={() => handleTabClick(name)}
          >
            {name}
          </div>
        ))}
      </div>

      {selectedTab === "New Quiz" ? renderNewQuiz() : renderQuestionBank()}
    </div>
  );
};

export default Page;