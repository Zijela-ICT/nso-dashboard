import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../../components/ui/dialog";
import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../../components/ui/accordion";
import { MultiSelect } from "./MultiSelect";
import { IDecisionTree, ItemTypes } from "../booktypes";

function AddDecisionTreeModal({
  addNewElement,
  showDecisionTreeModal,
  onClose,
  editElement,
  elementIndex,
  decisionTreeData,
}: {
  addNewElement?: (e: ItemTypes, f, g) => void;
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
      clinicalJudgement: "",
      actions: [],
      findingsOnExamination: [],
      decisionScore: 0,
      decisionDependencies: [],
    },
  ]);

  useEffect(() => {
    if (decisionTreeData) {
      setTitle(decisionTreeData.name);
      setQuestions(decisionTreeData.history);
      setExaminations(decisionTreeData.examinationsActions);
      setHealthEducation(decisionTreeData.healthEducation);
      setAllSymptoms(decisionTreeData.findingsOnExamination);
      setAilments(decisionTreeData.cases);
    }
  }, [decisionTreeData]);

  const handleSave = () => {
    const decisionTree: IDecisionTree = {
      type: "decision",
      name: title,
      history: questions.filter((e) => e),
      examinationsActions: examinations.filter((e) => e),
      findingsOnExamination: allSymptoms.filter((e) => e),
      cases: ailments,
      healthEducation: healthEducation.filter((e) => e),
    };

    setStep(1);
    if (decisionTreeData) {
      editElement(decisionTree, elementIndex);
    } else {
      addNewElement("decision", decisionTree, elementIndex);
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
      <Dialog
        open={showDecisionTreeModal}
        onOpenChange={() => {
          setStep(1);
          onClose();
        }}
      >
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
                        <div key={index} className="flex items-center">
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
                          <div className="flex gap-2 ml-2">
                            <button
                              className="border border-[#0CA554] text-[#0CA554] bg-[#F6FEF9] w-[24px] h-[24px] rounded-full flex items-center justify-center"
                              onClick={() => {
                                const newArray = [...questions];
                                newArray.splice(index + 1, 0, "");
                                setQuestions(newArray);
                              }}
                            >
                              <Plus width={12} />
                            </button>

                            <button
                              onClick={() => {
                                const questions_ = [...questions];
                                questions_.splice(index, 1);
                                setQuestions(questions_);
                              }}
                              className="border border-[#F04438] text-[#F04438] bg-[#FFFBFA] w-[24px] h-[24px] rounded-full flex items-center justify-center"
                            >
                              <Minus />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between">
                    <h3 className="mt-2 mb-1">Examinations/Actions</h3>
                    <button
                      className="border border-[#0CA554] text-[#0CA554] bg-[#F6FEF9] w-[24px] h-[24px] rounded-full flex items-center justify-center"
                      onClick={() => {
                        const newArray = [...examinations];
                        newArray.splice(0, 0, "");
                        setExaminations(newArray);
                      }}
                    >
                      <Plus width={12} />
                    </button>
                  </div>
                  <div className="flex">
                    <div className="flex-1 pr-2">
                      {examinations.map((e, index) => (
                        <div key={index} className="flex items-center">
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
                          <div className="flex gap-2 ml-2">
                            <button
                              className="border border-[#0CA554] text-[#0CA554] bg-[#F6FEF9] w-[24px] h-[24px] rounded-full flex items-center justify-center"
                              onClick={() => {
                                const newArray = [...examinations];
                                newArray.splice(index + 1, 0, "");
                                setExaminations(newArray);
                              }}
                            >
                              <Plus width={12} />
                            </button>

                            <button
                              onClick={() => {
                                const examinations_ = [...examinations];
                                examinations_.splice(index, 1);
                                setExaminations(examinations_);
                              }}
                              className="border border-[#F04438] text-[#F04438] bg-[#FFFBFA] w-[24px] h-[24px] rounded-full flex items-center justify-center"
                            >
                              <Minus />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <div className="pt-4">
                <div className="flex justify-between">
                  <h3>Add all possibile findings for all cases.</h3>{" "}
                  <button
                    className="border border-[#0CA554] text-[#0CA554] bg-[#F6FEF9] w-[24px] h-[24px] rounded-full flex items-center justify-center"
                    onClick={() => {
                      const newSymptoms = [...allSymptoms];
                      newSymptoms.unshift("");
                      setAllSymptoms(newSymptoms);
                    }}
                  >
                    <Plus width={12} />
                  </button>
                </div>
                <div className="flex pt-4">
                  <div className="flex-1 pr-2">
                    {allSymptoms.map((symptom, index) => (
                      <div className="flex items-center" key={index}>
                        <input
                          placeholder="Symptom"
                          value={symptom}
                          onChange={(e) => {
                            const newSymptoms = [...allSymptoms];
                            newSymptoms[index] = e.target.value;
                            setAllSymptoms(newSymptoms);
                          }}
                          className="border-[#cccfd3] bg-[#FCFCFD] border px-4 mb-2 rounded-sm h-[50px] w-full outline-none focus:outline-none"
                        />

                        <div className="flex gap-2 pl-2">
                          <button
                            className="border border-[#0CA554] text-[#0CA554] bg-[#F6FEF9] w-[24px] h-[24px] rounded-full flex items-center justify-center"
                            onClick={() => {
                              const newSymptoms = [...allSymptoms];
                              newSymptoms.splice(index + 1, 0, "");
                              setAllSymptoms(newSymptoms);
                            }}
                          >
                            <Plus width={12} />
                          </button>

                          <button
                            onClick={() => {
                              const newSymptoms = [...allSymptoms];
                              setAllSymptoms(
                                newSymptoms.filter((_, j) => index !== j)
                              );
                            }}
                            className="border border-[#F04438] text-[#F04438] bg-[#FFFBFA] w-[24px] h-[24px] rounded-full flex items-center justify-center"
                          >
                            <Minus />
                          </button>
                        </div>
                      </div>
                    ))}
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
                        <div className="flex justify-between items-center w-full">
                          <span className="capitalize">
                            {ailment.findingsOnHistory || `Case ${i + 1}`}
                          </span>
                          <button
                            onClick={() => {
                              setAilments(
                                [...ailments].filter((_, j) => i !== j)
                              );
                            }}
                            className="text-red-600 text-[12px]"
                          >
                            <Trash width={14} />
                          </button>
                        </div>
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

                          <div className="flex justify-between items-center">
                            <h3 className="mt-2 mb-1">Actions</h3>
                            <button
                              className="border border-[#0CA554] text-[#0CA554] bg-[#F6FEF9] w-[24px] h-[24px] rounded-full flex items-center justify-center"
                              onClick={() => {
                                const currentItem = ailments[i];
                                const currentItemActions = currentItem.actions;
                                const newActions = [...currentItemActions, ""];
                                const currentItem_ = {
                                  ...currentItem,
                                  actions: newActions,
                                };
                                const newdata = [...ailments];
                                newdata[i] = currentItem_;
                                setAilments(newdata);
                              }}
                            >
                              <Plus width={12} />
                            </button>
                          </div>
                          <div className="flex">
                            <div className="flex-1 pr-2">
                              {ailment.actions.map((e, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between"
                                >
                                  <input
                                    key={index}
                                    value={e}
                                    onChange={(e) => {
                                      const currentActions = [
                                        ...ailment.actions,
                                      ];
                                      currentActions[index] = e.target.value;
                                      const currAilment = ailments[i];
                                      currAilment.actions = currentActions;
                                      const newdata = [...ailments];
                                      newdata[i] = currAilment;
                                      setAilments(newdata);
                                    }}
                                    className="border-[#cccfd3] bg-[#FCFCFD] border px-4 mb-2 rounded-sm h-[50px] w-full outline-none focus:outline-none"
                                  />

                                  <div className="flex gap-2 pl-2">
                                    <button
                                      className="border border-[#0CA554] text-[#0CA554] bg-[#F6FEF9] w-[24px] h-[24px] rounded-full flex items-center justify-center"
                                      onClick={() => {
                                        const currentItem = ailments[i];
                                        const currentItemActions =
                                          currentItem.actions;
                                        currentItemActions.splice(
                                          index + 1,
                                          0,
                                          ""
                                        );
                                        const currentItem_ = {
                                          ...currentItem,
                                          actions: currentItemActions,
                                        };
                                        const newdata = [...ailments];
                                        newdata[i] = currentItem_;
                                        setAilments(newdata);
                                      }}
                                    >
                                      <Plus width={12} />
                                    </button>

                                    <button
                                      onClick={() => {
                                        const currentItem = ailments[i];
                                        const currentItemActions =
                                          currentItem.actions;
                                        currentItemActions.splice(index, 1);
                                        const currentItem_ = {
                                          ...currentItem,
                                          actions: currentItemActions,
                                        };
                                        const newdata = [...ailments];
                                        newdata[i] = currentItem_;
                                        setAilments(newdata);
                                      }}
                                      className="border border-[#F04438] text-[#F04438] bg-[#FFFBFA] w-[24px] h-[24px] rounded-full flex items-center justify-center"
                                    >
                                      <Minus />
                                    </button>
                                  </div>
                                </div>
                              ))}
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
                <div className="flex justify-between">
                  <h3>Health education</h3>
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
                </div>
                <div className="flex pt-4">
                  <div className="flex-1 pr-2">
                    {healthEducation?.map((education, index) => (
                      <div className="flex gap-3 items-center mb-4" key={index}>
                        <input
                          value={education}
                          onChange={(e) => {
                            const newHealthEducation = [...healthEducation];
                            newHealthEducation[index] = e.target.value;
                            setHealthEducation(newHealthEducation);
                          }}
                          className="border-[#cccfd3] bg-[#FCFCFD] border px-4 rounded-sm h-[50px] w-full outline-none focus:outline-none"
                        />

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
                              const newHealthEducation = [...healthEducation];
                              setHealthEducation(
                                newHealthEducation.filter((_, n) => n !== index)
                              );
                            }}
                            className="border border-[#F04438] text-[#F04438] bg-[#FFFBFA] w-[24px] h-[24px] rounded-full flex items-center justify-center"
                          >
                            <Minus />
                          </button>
                        </div>
                      </div>
                    ))}
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
                          clinicalJudgement: "",
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
