import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../../components/ui/dialog";
import { Minus, Plus } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../../components/ui/accordion";
import { MultiSelect } from "./MultiSelect";
import { IDecisionTree } from "../booktypes";

function AddDecisionTreeModal({
  addNewElement,
  showDecisionTreeModal,
  onClose,
  editElement,
  elementIndex,
  decisionTreeData,
}: {
  addNewElement?: (e, f) => void;
  showDecisionTreeModal: boolean;
  onClose: () => void;
  editElement?: (e, f) => void;
  elementIndex?: number;
  decisionTreeData?: IDecisionTree;
}) {
  const [step, setStep] = useState<number>(1);
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([""]);
  const [examinations, setExaminations] = useState([""]);
  const [allSymptoms, setAllSymptoms] = useState([""]);
  const [healthEducation, setHealthEducation] = useState([""]);
  const [ailments, setAilments] = useState([
    {
      findingsOnHistory: "",
      clinicalJudgement: [""],
      actions: [""],
      findingsOnExamination: [""],
      decisionScore: 0,
      decisionDependencies: [""],
    },
  ]);

  useEffect(() => {
    if (decisionTreeData) {
      setTitle(decisionTreeData.title);
      setQuestions(decisionTreeData.history);
      setExaminations(decisionTreeData.examinationsActions);
      setHealthEducation(decisionTreeData.healthEducation);
      setAllSymptoms(decisionTreeData.findingsOnExamination);
      setAilments(decisionTreeData.cases);
    }
  }, [decisionTreeData]);

  const handleSave = () => {
    const decisionTree = {
      type: "decision",
      title,
      history: questions,
      examinationsActions: examinations,
      findingsOnExamination: allSymptoms,
      cases: ailments,
      healthEducation,
    };
    if (decisionTreeData) {
      editElement(decisionTree, elementIndex);
    } else {
      addNewElement("decision", decisionTree);
    }
  };

  const updateAilment = (
    index: number,
    type: string,
    value: string | string[]
  ) => {
    let valueToUse = null;
    if (type == "compulsoryFindings") {
      //needed in case you delete an item from the full symtpoms array
      const value_ = value as string[];
      valueToUse = value_.filter((v) => allSymptoms.includes(v));
    } else {
      valueToUse = value;
    }
    const currentItem = {
      ...ailments[index],
      [type]: valueToUse,
    };
    const oldAilments = [...ailments];
    oldAilments[index] = currentItem;
    setAilments(oldAilments);
  };

  const move = (up: boolean) => {
    if (up && step < 4) {
      setStep(step + 1);
    }
    if (!up && step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <>
      <Dialog open={showDecisionTreeModal} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[605px]">
          <DialogHeader>
            <DialogTitle>Add Decision tree</DialogTitle>
          </DialogHeader>
          <div className="border-t min-h-[50vh] max-h-[75vh] overflow-y-scroll">
            {step === 1 && (
              <>
                <h3 className="mt-2">Title</h3>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border-[#cccfd3] bg-[#FCFCFD] border px-4 mb-2 rounded-sm h-[50px] w-full outline-none focus:outline-none  mt-1"
                />
                <div className="border-t mt-4 pt-4 border-[#e4e4e4]">
                  <h3 className="mt-2 mb-1">History</h3>
                  <div className="flex">
                    <div className="flex-1 pr-2">
                      {questions.map((q, index) => (
                        <input
                          key={index}
                          value={q}
                          onChange={(e) => {
                            const newQuestions = [...questions];
                            newQuestions[index] = e.target.value;
                            setQuestions(newQuestions);
                          }}
                          className="border-[#cccfd3] bg-[#FCFCFD] border px-4 mb-2 rounded-sm h-[50px] w-full outline-none focus:outline-none"
                        />
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="border border-[#0CA554] text-[#0CA554] bg-[#F6FEF9] w-[24px] h-[24px] rounded-full flex items-center justify-center"
                        onClick={() => setQuestions([...questions, ""])}
                      >
                        <Plus width={12} />
                      </button>

                      <button
                        onClick={() => setQuestions([...questions, ""])}
                        className="border border-[#F04438] text-[#F04438] bg-[#FFFBFA] w-[24px] h-[24px] rounded-full flex items-center justify-center"
                      >
                        <Minus />
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mt-2 mb-1">Examinations/Actions</h3>
                  <div className="flex">
                    <div className="flex-1 pr-2">
                      {examinations.map((e, index) => (
                        <input
                          key={index}
                          value={e}
                          onChange={(e) => {
                            const newExaminations = [...examinations];
                            newExaminations[index] = e.target.value;
                            setExaminations(newExaminations);
                          }}
                          className="border-[#cccfd3] bg-[#FCFCFD] border px-4 mb-2 rounded-sm h-[50px] w-full outline-none focus:outline-none"
                        />
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <button
                        className="border border-[#0CA554] text-[#0CA554] bg-[#F6FEF9] w-[24px] h-[24px] rounded-full flex items-center justify-center"
                        onClick={() => setExaminations([...examinations, ""])}
                      >
                        <Plus width={12} />
                      </button>

                      <button
                        onClick={() => setQuestions([...questions, ""])}
                        className="border border-[#F04438] text-[#F04438] bg-[#FFFBFA] w-[24px] h-[24px] rounded-full flex items-center justify-center"
                      >
                        <Minus />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <div className="pt-4">
                <h3>Add all possibile findings for all cases.</h3>
                <div className="flex pt-4">
                  <div className="flex-1 pr-2">
                    {allSymptoms.map((symptom, index) => (
                      <div key={index}>
                        <input
                          placeholder="Symptom"
                          value={allSymptoms[index]}
                          onChange={(e) => {
                            const newSymptoms = [...allSymptoms];
                            newSymptoms[index] = e.target.value;
                            setAllSymptoms(newSymptoms);
                          }}
                          className="border-[#cccfd3] bg-[#FCFCFD] border px-4 mb-2 rounded-sm h-[50px] w-full outline-none focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="border border-[#0CA554] text-[#0CA554] bg-[#F6FEF9] w-[24px] h-[24px] rounded-full flex items-center justify-center"
                      onClick={() => {
                        const newSymptoms = [...allSymptoms];
                        newSymptoms.push("");
                        setAllSymptoms(newSymptoms);
                      }}
                    >
                      <Plus width={12} />
                    </button>

                    <button
                      onClick={() => {
                        const newSymptoms = [...allSymptoms];
                        newSymptoms.push("");
                        setAllSymptoms(newSymptoms);
                      }}
                      className="border border-[#F04438] text-[#F04438] bg-[#FFFBFA] w-[24px] h-[24px] rounded-full flex items-center justify-center"
                    >
                      <Minus />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <>
                <Accordion type="single" collapsible className="w-full">
                  {ailments.map((ailment, i) => (
                    <AccordionItem key={i} value={`item-${i}`}>
                      <AccordionTrigger>
                        <span className="capitalize">
                          {ailment.findingsOnHistory || `Case ${i + 1}`}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="">
                          <div className="flex">
                            <div className="flex-1 pr-2">
                              <div className="mb-4">
                                <label htmlFor="">
                                  Finding on history(Name of ailment)
                                </label>
                                <input
                                  onChange={(e) =>
                                    updateAilment(
                                      i,
                                      "findingsOnHistory",
                                      e.target.value
                                    )
                                  }
                                  value={ailment.findingsOnHistory}
                                  className="border-[#cccfd3] bg-[#FCFCFD] border px-4 mb-2 rounded-sm h-[50px] w-full outline-none focus:outline-none"
                                />
                              </div>
                              <div className="mb-4">
                                <label htmlFor="">
                                  Clinical judgement(severity level)
                                </label>
                                <input
                                  placeholder="Clinical Judgement"
                                  onChange={(e) =>
                                    updateAilment(
                                      i,
                                      "clinicalJudgement",
                                      e.target.value
                                    )
                                  }
                                  value={ailment.clinicalJudgement}
                                  className="border-[#cccfd3] bg-[#FCFCFD] border px-4 mb-2 rounded-sm h-[50px] w-full outline-none focus:outline-none"
                                />
                              </div>
                              <div className="mb-4">
                                <label htmlFor="">
                                  Select all symptoms associated with this
                                  ailment
                                </label>
                                <MultiSelect
                                  className="bg-white h-auto"
                                  options={allSymptoms.map((value) => ({
                                    value,
                                    label: value,
                                  }))}
                                  value={ailment.findingsOnExamination.filter(
                                    (n) => n
                                  )}
                                  defaultValue={ailment.findingsOnExamination.filter(
                                    (n) => n
                                  )}
                                  onValueChange={(e) => {
                                    updateAilment(
                                      i,
                                      "findingsOnExamination",
                                      e.filter((n) => n)
                                    );
                                  }}
                                />
                              </div>
                              <div className="mb-4">
                                <label htmlFor="">Correlation score</label>
                                <input
                                  placeholder="0-100"
                                  onChange={(e) =>
                                    updateAilment(
                                      i,
                                      "decisionScore",
                                      e.target.value
                                    )
                                  }
                                  value={ailment.decisionScore}
                                  className="border-[#cccfd3] bg-[#FCFCFD] border px-4 mb-2 rounded-sm h-[50px] w-full outline-none focus:outline-none"
                                />
                              </div>
                              <div className="mb-4">
                                <label htmlFor="">Compulsory findings</label>
                                <MultiSelect
                                  className="bg-white"
                                  options={ailment.findingsOnExamination.map(
                                    (value) => ({
                                      value,
                                      label: value,
                                    })
                                  )}
                                  value={ailment.decisionDependencies.filter(
                                    (n) => n
                                  )}
                                  onValueChange={(e) => {
                                    updateAilment(
                                      i,
                                      "decisionDependencies",
                                      e.filter((n) => n)
                                    );
                                  }}
                                  defaultValue={ailment.decisionDependencies.filter(
                                    (n) => n
                                  )}
                                />
                              </div>
                            </div>
                          </div>

                          <h3 className="mt-2 mb-1">Actions</h3>
                          <div className="flex">
                            <div className="flex-1 pr-2">
                              {ailment.actions.map((e, index) => (
                                <input
                                  key={index}
                                  value={e}
                                  onChange={(e) => {
                                    const currentActions = [...ailment.actions];
                                    currentActions[index] = e.target.value;
                                    const currAilment = ailments[i];
                                    currAilment.actions = currentActions;
                                    const newdata = [...ailments];
                                    newdata[i] = currAilment;
                                    setAilments(newdata);
                                  }}
                                  className="border-[#cccfd3] bg-[#FCFCFD] border px-4 mb-2 rounded-sm h-[50px] w-full outline-none focus:outline-none"
                                />
                              ))}
                            </div>

                            <div className="flex gap-2">
                              <button
                                className="border border-[#0CA554] text-[#0CA554] bg-[#F6FEF9] w-[24px] h-[24px] rounded-full flex items-center justify-center"
                                onClick={() => {
                                  const currentItem = ailments[i];
                                  const currentItem_ = {
                                    ...currentItem,
                                    actions: [...currentItem.actions, ""],
                                  };
                                  const newdata = [...ailments];
                                  newdata[i] = currentItem_;
                                  setAilments(newdata);
                                }}
                              >
                                <Plus width={12} />
                              </button>

                              <button
                                onClick={() => setQuestions([...questions, ""])}
                                className="border border-[#F04438] text-[#F04438] bg-[#FFFBFA] w-[24px] h-[24px] rounded-full flex items-center justify-center"
                              >
                                <Minus />
                              </button>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </>
            )}

            {step === 4 && (
              <div className="pt-4">
                <h3>Health education</h3>
                <div className="flex pt-4">
                  <div className="flex-1 pr-2">
                    {healthEducation?.map((education, index) => (
                      <div key={index}>
                        <input
                          value={education}
                          onChange={(e) => {
                            const newHealthEducation = [...healthEducation];
                            healthEducation[index] = e.target.value;
                            setAllSymptoms(newHealthEducation);
                          }}
                          className="border-[#cccfd3] bg-[#FCFCFD] border px-4 mb-2 rounded-sm h-[50px] w-full outline-none focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="border border-[#0CA554] text-[#0CA554] bg-[#F6FEF9] w-[24px] h-[24px] rounded-full flex items-center justify-center"
                      onClick={() => {
                        const newHealthEducation = [...healthEducation];
                        newHealthEducation.push("");
                        setHealthEducation(newHealthEducation);
                      }}
                    >
                      <Plus width={12} />
                    </button>

                    <button
                      onClick={() => {
                        const newSymptoms = [...allSymptoms];
                        newSymptoms.push("");
                        setAllSymptoms(newSymptoms);
                      }}
                      className="border border-[#F04438] text-[#F04438] bg-[#FFFBFA] w-[24px] h-[24px] rounded-full flex items-center justify-center"
                    >
                      <Minus />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <div>
              <div className="flex justify-end gap-2 mb-2">
                {step === 3 && (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setAilments([
                        ...ailments,
                        {
                          findingsOnHistory: "",
                          clinicalJudgement: [""],
                          actions: [""],
                          findingsOnExamination: [""],
                          decisionScore: 0,
                          decisionDependencies: [""],
                        },
                      ]);
                    }}
                  >
                    Add new case
                  </Button>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  disabled={step === 1}
                  variant="outline"
                  onClick={() => move(false)}
                >
                  Previous
                </Button>
                {step < 4 ? (
                  <Button onClick={() => move(true)}>Proceed</Button>
                ) : (
                  <Button onClick={handleSave}>
                    {editElement ? "Update" : "Create"} Decision tree
                  </Button>
                )}
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddDecisionTreeModal;