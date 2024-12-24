"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@src/components/DashboardLayout";
import { Book, SubChapter, SubSubChapter, Page, ContentItem, Text, Heading, Space, Quiz, horizontalLine, BookImage, OrderedList, Decision, DecisionCase, Table } from "@src/types/book.types";

const ensureDefaults = (table: Table): Table => ({
  ...table,
  itemsPerPage: table.itemsPerPage || 5,
  columnCount: table.columnCount || 3,
});


const Editor = () => {
  const [book, setBook] = useState<Book | null>(null);
  const [selectedType, setSelectedType] = useState<string>("text");

  // Load and auto-save to local storage
  useEffect(() => {
    const savedBook = localStorage.getItem("book");
    if (savedBook) {
      setBook(JSON.parse(savedBook));
    }
  }, []);

  useEffect(() => {
    if (book) {
      localStorage.setItem("book", JSON.stringify(book));
    }
  }, [book]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        setBook(json);
      } catch (error) {
        console.log(JSON.stringify(error))
        alert("Invalid JSON file. Please upload a valid book JSON.");
      }
    };
    reader.readAsText(file);
  };

  const handleDownload = () => {
    if (!book) return;

    const blob = new Blob([JSON.stringify(book, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${book.bookTitle || "book"}.json`;
    link.click();

    URL.revokeObjectURL(url);
  };

  const addChapter = () => {
    setBook({
      ...book,
      content: [...(book?.content || []), { chapter: "New Chapter", pages: [], subChapters: [] }],
    } as Book);
  };

  const addSubChapter = (chapterIndex: number) => {
    const updatedChapters = [...(book?.content || [])];
    updatedChapters[chapterIndex].subChapters = [
      ...(updatedChapters[chapterIndex].subChapters || []),
      { subChapterTitle: "New SubChapter", pages: [], subSubChapters: [] },
    ];
    setBook({ ...book, content: updatedChapters } as Book);
  };

  const addSubSubChapter = (chapterIndex: number, subChapterIndex: number) => {
    const updatedChapters = [...(book?.content || [])];
    const subChapters = updatedChapters[chapterIndex].subChapters || [];
    subChapters[subChapterIndex].subSubChapters = [
      ...(subChapters[subChapterIndex].subSubChapters || []),
      { subSubChapterTitle: "New SubSubChapter", pages: [] },
    ];
    updatedChapters[chapterIndex].subChapters = subChapters;
    setBook({ ...book, content: updatedChapters } as Book);
  };

  const addPageToSubChapter = (chapterIndex: number, subChapterIndex: number) => {
    const updatedChapters = [...(book?.content || [])];
    const subChapters = updatedChapters[chapterIndex].subChapters || [];
    subChapters[subChapterIndex].pages = [
      ...(subChapters[subChapterIndex].pages || []),
      { pageTitle: "New Page", items: [] },
    ];
    updatedChapters[chapterIndex].subChapters = subChapters;
    setBook({ ...book, content: updatedChapters } as Book);
  };

  const addPageToSubSubChapter = (
    chapterIndex: number,
    subChapterIndex: number,
    subSubChapterIndex: number
  ) => {
    const updatedChapters = [...(book?.content || [])];
    const subChapters = updatedChapters[chapterIndex].subChapters || [];
    const subSubChapters = subChapters[subChapterIndex].subSubChapters || [];
    subSubChapters[subSubChapterIndex].pages = [
      ...(subSubChapters[subSubChapterIndex].pages || []),
      { pageTitle: "New Page", items: [] },
    ];
    subChapters[subChapterIndex].subSubChapters = subSubChapters;
    updatedChapters[chapterIndex].subChapters = subChapters;
    setBook({ ...book, content: updatedChapters } as Book);
  };

  const addContentItem = (target: Page, type: ContentItem["type"]) => {
    let newItem: ContentItem;

    switch (type) {
      case "text":
        newItem = { type: "text", content: "New Text Content" } as Text;
        break;
      case "heading1":
      case "heading2":
      case "heading3":
        newItem = { type, content: "New Heading" } as Heading;
        break;
      case "space":
        newItem = { type: "space" } as Space;
        break;
      case "image":
        newItem = { type: "image", src: "placeholder.png", alt: "Placeholder Image" } as BookImage;
        break;
      case "horizontalLine":
        newItem = { type: "horizontalLine", style: {} } as horizontalLine;
        break;
      case "orderedList":
        newItem = { type: "orderedList", items: ["List Item 1"] } as OrderedList;
        break;
      case "quiz":
        newItem = {
          type: "quiz",
          title: "New Quiz",
          sectionId: "section-1",
          duration: 5,
          retries: 3,
          questions: [{ question: "Sample Question?", options: ["A", "B", "C"], correctAnswer: "A" }],
        } as Quiz;
        break;
      case "table":
        newItem = ensureDefaults({
          type: "table",
          title: "New Table",
          headers: [[]],
          rows: [[]],
          showCellBorders: true,
          tableStyle: {},
          headless: false,
        } as Table);
        break;
      case "decision":
        newItem = {
          type: "decision",
          name: "New Decision",
          history: ["History Item 1"],
          examinationsActions: ["Examination Action 1"],
          findingsOnExamination: ["Finding 1"],
          cases: [
            {
              findingsOnHistory: "Initial Finding",
              findingsOnExamination: ["Finding A", "Finding B"],
              clinicalJudgement: ["Judgement 1"],
              actions: ["Action 1"],
              decisionScore: 0,
              decisionDependencies: [],
            },
          ],
          healthEducation: ["Education Item 1"],
        } as Decision;
        break;
      default:
        throw new Error(`Unsupported content type: ${type}`);
    }

    target.items = [...(target.items || []), newItem];
    setBook({ ...book } as Book);
  };


  const removeContentItem = (page: Page, itemIndex: number) => {
    page.items.splice(itemIndex, 1);
    setBook({ ...book } as Book);
  };

  const removePage = (pages: Page[], pageIndex: number) => {
    pages.splice(pageIndex, 1);
    setBook({ ...book } as Book);
  };

  const removeSubSubChapter = (subSubChapters: SubSubChapter[], index: number) => {
    subSubChapters.splice(index, 1);
    setBook({ ...book } as Book);
  };

  const removeSubChapter = (subChapters: SubChapter[], index: number) => {
    subChapters.splice(index, 1);
    setBook({ ...book } as Book);
  };

  const removeChapter = (index: number) => {
    const updatedChapters = [...(book?.content || [])];
    updatedChapters.splice(index, 1);
    setBook({ ...book, content: updatedChapters } as Book);
  };

  const renderEditableContentItem = (
    item: ContentItem,
    onUpdate: (newValue: Partial<ContentItem>) => void,
    onRemove: () => void
  ) => {
    switch (item.type) {
      case "text":
        return (
          <div>
            <label>
              Text Content:
              <input
                type="text"
                value={(item as Text).content}
                onChange={(e) => onUpdate({ content: e.target.value })}
              />
            </label>
            <button onClick={onRemove}>Remove</button>
          </div>
        );
      case "heading1":
      case "heading2":
      case "heading3":
        return (
          <div>
            <label>
              Heading Content:
              <input
                type="text"
                value={(item as Heading).content}
                onChange={(e) => onUpdate({ content: e.target.value })}
              />
            </label>
            <button onClick={onRemove}>Remove</button>
          </div>
        );
      case "space":
        return <div style={{ height: "20px", backgroundColor: "#f0f0f0", margin: "5px 0" }}> </div>;
      case "image":
        return (
          <div>
            <label>
              Image Source:
              <input
                type="text"
                value={(item as BookImage).src}
                onChange={(e) => onUpdate({ src: e.target.value })}
              />
            </label>
            <button onClick={onRemove}>Remove</button>
          </div>
        );
      case "quiz":
        return (
          <div>
            <p>Quiz: {(item as Quiz).title}</p>
            <button onClick={onRemove}>Remove</button>
          </div>
        );
      case "orderedList":
        return (
          <div>
            <h4>Ordered List</h4>
            {(item as OrderedList).items.map((listItem, listIndex) => (
              <div key={listIndex} style={{ marginLeft: "20px" }}>
                <input
                  type="text"
                  value={String(listItem)}
                  onChange={(e) => {
                    const updatedItems = [...(item as OrderedList).items];
                    updatedItems[listIndex] = e.target.value;
                    onUpdate({ items: updatedItems });
                  }}
                />
                <button onClick={() => {
                  const updatedItems = [...(item as OrderedList).items];
                  updatedItems.splice(listIndex, 1);
                  onUpdate({ items: updatedItems });
                }}>
                  Remove Item
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const updatedItems = [...(item as OrderedList).items, `List Item ${Date.now()}`];
                onUpdate({ items: updatedItems });
              }}
            >
              Add List Item
            </button>
            <button onClick={onRemove}>Remove Ordered List</button>
          </div>
        );
      case "decision":
        return (
          <div style={{ border: "1px solid #ddd", padding: "10px", borderRadius: "5px", marginBottom: "10px" }}>
            <h4>Decision: {(item as Decision).name}</h4>
            <label>
              Name:
              <input
                type="text"
                value={(item as Decision).name}
                onChange={(e) => onUpdate({ name: e.target.value })}
              />
            </label>

            <h5>History</h5>
            {(item as Decision).history.map((historyItem, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={historyItem}
                  onChange={(e) => {
                    const updatedHistory = [...(item as Decision).history];
                    updatedHistory[index] = e.target.value;
                    onUpdate({ history: updatedHistory });
                  }}
                />
                <button
                  onClick={() => {
                    const updatedHistory = [...(item as Decision).history];
                    updatedHistory.splice(index, 1);
                    onUpdate({ history: updatedHistory });
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const updatedHistory = [...(item as Decision).history, ""];
                onUpdate({ history: updatedHistory });
              }}
            >
              Add History
            </button>

            <h5>Examinations Actions</h5>
            {(item as Decision).examinationsActions.map((action, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={action}
                  onChange={(e) => {
                    const updatedActions = [...(item as Decision).examinationsActions];
                    updatedActions[index] = e.target.value;
                    onUpdate({ examinationsActions: updatedActions });
                  }}
                />
                <button
                  onClick={() => {
                    const updatedActions = [...(item as Decision).examinationsActions];
                    updatedActions.splice(index, 1);
                    onUpdate({ examinationsActions: updatedActions });
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const updatedActions = [...(item as Decision).examinationsActions, ""];
                onUpdate({ examinationsActions: updatedActions });
              }}
            >
              Add Action
            </button>

            <h5>Findings on Examination</h5>
            {(item as Decision).findingsOnExamination.map((finding, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={finding}
                  onChange={(e) => {
                    const updatedFindings = [...(item as Decision).findingsOnExamination];
                    updatedFindings[index] = e.target.value;
                    onUpdate({ findingsOnExamination: updatedFindings });
                  }}
                />
                <button
                  onClick={() => {
                    const updatedFindings = [...(item as Decision).findingsOnExamination];
                    updatedFindings.splice(index, 1);
                    onUpdate({ findingsOnExamination: updatedFindings });
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const updatedFindings = [...(item as Decision).findingsOnExamination, ""];
                onUpdate({ findingsOnExamination: updatedFindings });
              }}
            >
              Add Finding
            </button>
            {/* Health Education */}
            <div>
              <h5>Health Education</h5>
              {(item as Decision).healthEducation.map((educationItem, index) => (
                <div key={index}>
                  <input
                    type="text"
                    value={educationItem}
                    onChange={(e) => {
                      const updatedEducation = [...(item as Decision).healthEducation];
                      updatedEducation[index] = e.target.value;
                      onUpdate({ healthEducation: updatedEducation });
                    }}
                  />
                  <button
                    onClick={() => {
                      const updatedEducation = [...(item as Decision).healthEducation];
                      updatedEducation.splice(index, 1);
                      onUpdate({ healthEducation: updatedEducation });
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={() =>
                  onUpdate({
                    healthEducation: [
                      ...(item as Decision).healthEducation,
                      `Health Education ${Date.now()}`,
                    ],
                  })
                }
              >
                Add Health Education Item
              </button>
            </div>
            <h5>Cases</h5>
            {(item as Decision).cases.map((decisionCase, caseIndex) => (
              <div key={caseIndex} style={{ marginTop: "10px", border: "1px solid #ddd", padding: "10px", borderRadius: "5px" }}>
                <h6>Case {caseIndex + 1}</h6>

                <label>
                  Findings on History:
                  <input
                    type="text"
                    value={decisionCase.findingsOnHistory}
                    onChange={(e) => {
                      const updatedCases = [...(item as Decision).cases];
                      updatedCases[caseIndex].findingsOnHistory = e.target.value;
                      onUpdate({ cases: updatedCases });
                    }}
                  />
                </label>

                <h6>Findings on Examination</h6>
                {decisionCase.findingsOnExamination.map((finding, index) => (
                  <div key={index}>
                    <select
                      value={finding}
                      onChange={(e) => {
                        const updatedFindings = [...decisionCase.findingsOnExamination];
                        updatedFindings[index] = e.target.value;
                        const updatedCases = [...(item as Decision).cases];
                        updatedCases[caseIndex].findingsOnExamination = updatedFindings;
                        onUpdate({ cases: updatedCases });
                      }}
                    >
                      {(item as Decision).findingsOnExamination.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => {
                        const updatedFindings = [...decisionCase.findingsOnExamination];
                        updatedFindings.splice(index, 1);
                        const updatedCases = [...(item as Decision).cases];
                        updatedCases[caseIndex].findingsOnExamination = updatedFindings;
                        onUpdate({ cases: updatedCases });
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const updatedFindings = [...decisionCase.findingsOnExamination, ""];
                    const updatedCases = [...(item as Decision).cases];
                    updatedCases[caseIndex].findingsOnExamination = updatedFindings;
                    onUpdate({ cases: updatedCases });
                  }}
                >
                  Add Finding
                </button>

                <h6>Clinical Judgement</h6>
                {decisionCase.clinicalJudgement.map((judgement, index) => (
                  <div key={index}>
                    <input
                      type="text"
                      value={judgement}
                      onChange={(e) => {
                        const updatedJudgements = [...decisionCase.clinicalJudgement];
                        updatedJudgements[index] = e.target.value;
                        const updatedCases = [...(item as Decision).cases];
                        updatedCases[caseIndex].clinicalJudgement = updatedJudgements;
                        onUpdate({ cases: updatedCases });
                      }}
                    />
                    <button
                      onClick={() => {
                        const updatedJudgements = [...decisionCase.clinicalJudgement];
                        updatedJudgements.splice(index, 1);
                        const updatedCases = [...(item as Decision).cases];
                        updatedCases[caseIndex].clinicalJudgement = updatedJudgements;
                        onUpdate({ cases: updatedCases });
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const updatedJudgements = [...decisionCase.clinicalJudgement, ""];
                    const updatedCases = [...(item as Decision).cases];
                    updatedCases[caseIndex].clinicalJudgement = updatedJudgements;
                    onUpdate({ cases: updatedCases });
                  }}
                >
                  Add Judgement
                </button>

                <h6>Actions</h6>
                {decisionCase.actions.map((action, index) => (
                  <div key={index}>
                    <input
                      type="text"
                      value={action}
                      onChange={(e) => {
                        const updatedActions = [...decisionCase.actions];
                        updatedActions[index] = e.target.value;
                        const updatedCases = [...(item as Decision).cases];
                        updatedCases[caseIndex].actions = updatedActions;
                        onUpdate({ cases: updatedCases });
                      }}
                    />
                    <button
                      onClick={() => {
                        const updatedActions = [...decisionCase.actions];
                        updatedActions.splice(index, 1);
                        const updatedCases = [...(item as Decision).cases];
                        updatedCases[caseIndex].actions = updatedActions;
                        onUpdate({ cases: updatedCases });
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const updatedActions = [...decisionCase.actions, ""];
                    const updatedCases = [...(item as Decision).cases];
                    updatedCases[caseIndex].actions = updatedActions;
                    onUpdate({ cases: updatedCases });
                  }}
                >
                  Add Action
                </button>

                <h6>Decision Score</h6>
                <input
                  type="number"
                  value={decisionCase.decisionScore}
                  min={1}
                  max={100}
                  onChange={(e) => {
                    const updatedCases = [...(item as Decision).cases];
                    updatedCases[caseIndex].decisionScore = parseInt(e.target.value, 10);
                    onUpdate({ cases: updatedCases });
                  }}
                />

                <h6>Decision Dependencies</h6>
                {decisionCase.decisionDependencies.map((dependency, index) => (
                  <div key={index}>
                    <select
                      value={dependency}
                      onChange={(e) => {
                        const updatedDependencies = [...decisionCase.decisionDependencies];
                        updatedDependencies[index] = e.target.value;
                        const updatedCases = [...(item as Decision).cases];
                        updatedCases[caseIndex].decisionDependencies = updatedDependencies;
                        onUpdate({ cases: updatedCases });
                      }}
                    >
                      {decisionCase.findingsOnExamination.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => {
                        const updatedDependencies = [...decisionCase.decisionDependencies];
                        updatedDependencies.splice(index, 1);
                        const updatedCases = [...(item as Decision).cases];
                        updatedCases[caseIndex].decisionDependencies = updatedDependencies;
                        onUpdate({ cases: updatedCases });
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const updatedDependencies = [...decisionCase.decisionDependencies, ""];
                    const updatedCases = [...(item as Decision).cases];
                    updatedCases[caseIndex].decisionDependencies = updatedDependencies;
                    onUpdate({ cases: updatedCases });
                  }}
                >
                  Add Dependency
                </button>

                <button
                  onClick={() => {
                    const updatedCases = [...(item as Decision).cases];
                    updatedCases.splice(caseIndex, 1);
                    onUpdate({ cases: updatedCases });
                  }}
                >
                  Remove Case
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const updatedCases = [
                  ...(item as Decision).cases,
                  {
                    findingsOnHistory: "",
                    findingsOnExamination: [],
                    clinicalJudgement: [],
                    actions: [],
                    decisionScore: 1,
                    decisionDependencies: [],
                  },
                ];
                onUpdate({ cases: updatedCases });
              }}
            >
              Add Case
            </button>
            <button onClick={onRemove}>Remove Decision</button>
          </div>
        );
      case "table":
        return (
          <div style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "5px", marginBottom: "10px" }}>
            <h4>Table: {(item as Table).title}</h4>
            <label>
              Title:
              <input
                type="text"
                value={(item as Table).title || ""}
                onChange={(e) => onUpdate({ title: e.target.value })}
              />
            </label>
            <label>
              Items per Page:
              <input
                type="number"
                value={(item as Table).itemsPerPage || 5}
                onChange={(e) => onUpdate({ itemsPerPage: parseInt(e.target.value, 10) || 5 })}
                min={1}
              />
            </label>
            <label>
              Column Count:
              <input
                type="number"
                value={(item as Table).columnCount || 3}
                onChange={(e) => {
                  const newColumnCount = Math.max(1, parseInt(e.target.value, 10) || 3);
                  const tableItem = item as Table;

                  // Resize headers to match the new column count without adding new rows
                  const updatedHeaders = (tableItem.headers || []).map((row) =>
                    row.length < newColumnCount
                      ? [
                          ...row,
                          ...Array(newColumnCount - row.length).fill({ type: "text", content: "" }),
                        ]
                      : row.slice(0, newColumnCount)
                  );
                  
                  const updatedRows = (tableItem.rows || []).map((row) =>
                    row.length < newColumnCount
                      ? [
                          ...row,
                          ...Array(newColumnCount - row.length).fill({ type: "text", content: "" }),
                        ]
                      : row.slice(0, newColumnCount)
                  );
                  
                  console.log({ updatedHeaders, updatedRows });

                  // Update column count, headers, and rows without adding extra rows
                  onUpdate({
                    columnCount: newColumnCount,
                    headers: updatedHeaders,
                    rows: updatedRows,
                  });
                }}
                min={1}
              />
            </label>
            <h5>Headers</h5>
            <div>
              {(item as Table).headers?.map((headerRow, rowIndex) => (
                <div key={rowIndex} style={{ display: "flex", marginBottom: "5px" }}>
                  {headerRow.map((cell, colIndex) => (
                    <div key={colIndex} style={{ marginRight: "5px" }}>
                      <input
                        type="text"
                        value={(cell as Text)?.content || ""}
                        onChange={(e) => {
                          const updatedHeaders = [...((item as Table).headers || [[]])];
                          updatedHeaders[rowIndex][colIndex] = {
                            ...cell,
                            content: e.target.value,
                          };
                          onUpdate({ headers: updatedHeaders });
                        }}
                      />
                    </div>
                  ))}
                  {/* <button
                    onClick={() => {
                      const tableItem = item as Table;
                      const updatedRows = tableItem.rows.map(row => row.slice(0, -1));
                      const updatedColumnCount = Math.max((tableItem.columnCount || 3) - 1, 1);
                      onUpdate({ rows: updatedRows, columnCount: updatedColumnCount });
                    }}
                  >
                    Remove Column
                  </button> */}
                </div>
              ))}
              <button
                onClick={() => {
                  const columnCount = (item as Table).columnCount || 3;
                  const updatedHeaders = [...((item as Table).headers || [])];
                  const newHeaderRow = Array.from({ length: columnCount }, () => ({
                    type: "text",
                    content: "",
                  } as Text));
                  updatedHeaders.push(newHeaderRow);
                  onUpdate({ headers: updatedHeaders });
                }}
              >
                Add Header Row
              </button>

              <button
                onClick={() => {
                  const updatedHeaders = [...((item as Table).headers || [])];
                  updatedHeaders.pop(); // Remove the last header row
                  onUpdate({ headers: updatedHeaders });
                }}
              >
                Remove Header Row
              </button>
            </div>
            <h5>Rows</h5>
            <div>
              {((item as Table).rows || []).map((row, rowIndex) => (
                <div key={rowIndex} style={{ display: "flex", marginBottom: "5px" }}>
                  {(row || []).map((cell, colIndex) => (
                    <div key={colIndex} style={{ marginRight: "5px" }}>
                      <input
                        type="text"
                        value={(cell as Text)?.content || ""}
                        onChange={(e) => {
                          const updatedRows = [...((item as Table).rows || [])];
                          updatedRows[rowIndex][colIndex] = {
                            ...cell,
                            content: e.target.value,
                          };
                          onUpdate({ rows: updatedRows });
                        }}
                      />
                    </div>
                  ))}
                  {/* <button
                    onClick={() => {
                      const updatedRows = [...((item as Table).rows || [])];
                      updatedRows[rowIndex] = updatedRows[rowIndex].slice(0, -1);
                      onUpdate({ rows: updatedRows });
                    }}
                  >
                    Remove Column
                  </button> */}
                </div>
              ))}
              <button
                onClick={() => {
                  const columnCount = (item as Table).columnCount || 3;
                  const updatedRows = [...((item as Table).rows || [])];
                  const newRow = Array.from({ length: columnCount }, () => ({
                    type: "text",
                    content: "",
                  } as Text));
                  updatedRows.push(newRow);
                  onUpdate({ rows: updatedRows });
                }}
              >
                Add Row
              </button>

              <button
                onClick={() => {
                  const updatedRows = [...((item as Table).rows || [])];
                  updatedRows.pop(); // Remove the last row
                  onUpdate({ rows: updatedRows });
                }}
              >
                Remove Row
              </button>
            </div>
            <button onClick={onRemove}>Remove Table</button>
          </div>
        );

      default:
        return <p>Unsupported Content Item</p>;
    }
  };


  const renderPreview = () => {
    if (!book) return <p>No book data to preview.</p>;

    const renderContentItems = (items: ContentItem[]) => {
      return items.map((item, itemIndex) => (
        <div key={itemIndex}>
          {item.type === "text" && <p>{(item as Text).content}</p>}
          {item.type.startsWith("heading") && <h6>{(item as Heading).content}</h6>}
          {item.type === "space" && <div style={{ height: "20px" }} />}
          {item.type === "orderedList" && (
            <ol>
              {((item as OrderedList).items || []).map((listItem, listIndex) => (
                <li key={listIndex}>{String(listItem)}</li>
              ))}
            </ol>
          )}
          {item.type === "decision" && (
            <div style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "5px" }}>
              <h4>Decision: {(item as Decision).name}</h4>

              <h5>History</h5>
              <ul>
                {(item as Decision).history.map((historyItem, index) => (
                  <li key={index}>{historyItem}</li>
                ))}
              </ul>

              <h5>Examinations Actions</h5>
              <ul>
                {(item as Decision).examinationsActions.map((action, index) => (
                  <li key={index}>{action}</li>
                ))}
              </ul>

              <h5>Findings on Examination</h5>
              <ul>
                {(item as Decision).findingsOnExamination.map((finding, index) => (
                  <li key={index}>{finding}</li>
                ))}
              </ul>

              <h5>Health Education</h5>
              <ul>
                {(item as Decision).healthEducation.map((educationItem, index) => (
                  <li key={index}>{educationItem}</li>
                ))}
              </ul>

              <h5>Cases</h5>
              {(item as Decision).cases.map((decisionCase, caseIndex) => (
                <div key={caseIndex} style={{ marginTop: "10px", border: "1px solid #ddd", padding: "10px" }}>
                  <h6>Case {caseIndex + 1}</h6>
                  <p><strong>Findings on History:</strong> {decisionCase.findingsOnHistory}</p>

                  <h6>Findings on Examination</h6>
                  <ul>
                    {decisionCase.findingsOnExamination.map((finding, index) => (
                      <li key={index}>{finding}</li>
                    ))}
                  </ul>

                  <h6>Clinical Judgement</h6>
                  <ul>
                    {decisionCase.clinicalJudgement.map((judgement, index) => (
                      <li key={index}>{judgement}</li>
                    ))}
                  </ul>

                  <h6>Actions</h6>
                  <ul>
                    {decisionCase.actions.map((action, index) => (
                      <li key={index}>{action}</li>
                    ))}
                  </ul>

                  <h6>Decision Score</h6>
                  <p>{decisionCase.decisionScore}</p>

                  <h6>Decision Dependencies</h6>
                  <ul>
                    {decisionCase.decisionDependencies.map((dependency, index) => (
                      <li key={index}>{dependency}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
          {item.type === "table" && (
            <div style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "5px" }}>
              <h4>Table: {(item as Table).title || "Untitled Table"}</h4>
              <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "10px" }}>
                <thead>
                  {((item as Table).headers || []).map((headerRow, rowIndex) => (
                    <tr key={rowIndex}>
                      {headerRow.map((header, colIndex) => (
                        <th key={colIndex} style={{ border: "1px solid #ccc", padding: "5px" }}>
                          {(header as Text)?.content || ""}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {(item as Table).rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, colIndex) => (
                        <td key={colIndex} style={{ border: "1px solid #ccc", padding: "5px" }}>
                          {(cell as Text)?.content || ""}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ));
    };

    const renderPages = (pages: Page[]) => {
      return pages.map((page, pageIndex) => (
        <div key={pageIndex} style={{ marginLeft: "20px", marginTop: "10px" }}>
          <h5>{page.pageTitle || `Page ${pageIndex + 1}`}</h5>
          {renderContentItems(page.items)}
        </div>
      ));
    };

    const renderSubSubChapters = (subSubChapters: SubSubChapter[]) => {
      return subSubChapters.map((subSubChapter, subSubChapterIndex) => (
        <div key={subSubChapterIndex} style={{ marginLeft: "40px", marginTop: "10px" }}>
          <h4>{subSubChapter.subSubChapterTitle || `SubSubChapter ${subSubChapterIndex + 1}`}</h4>
          {renderPages(subSubChapter.pages || [])}
        </div>
      ));
    };

    const renderSubChapters = (subChapters: SubChapter[]) => {
      return subChapters.map((subChapter, subChapterIndex) => (
        <div key={subChapterIndex} style={{ marginLeft: "30px", marginTop: "10px" }}>
          <h3>{subChapter.subChapterTitle || `SubChapter ${subChapterIndex + 1}`}</h3>
          {renderSubSubChapters(subChapter.subSubChapters || [])}
          {renderPages(subChapter.pages || [])}
        </div>
      ));
    };

    return (
      <div style={{ border: "1px solid #ccc", padding: "10px", marginTop: "20px" }}>
        <h2>Preview</h2>
        <h3>{book.bookTitle || "Untitled Book"}</h3>
        {book.content.map((chapter, chapterIndex) => (
          <div key={chapterIndex} style={{ marginBottom: "20px" }}>
            <h2>{chapter.chapter || `Chapter ${chapterIndex + 1}`}</h2>
            {renderSubChapters(chapter.subChapters || [])}
            {renderPages(chapter.pages || [])}
          </div>
        ))}
      </div>
    );
  };


  const renderPages = (
    pages: Page[],
    onAddPage: () => void,
    indentLevel: number = 20 // Dynamic indentation level
  ) => {
    return (
      <div>
        {pages.map((page, pageIndex) => (
          <div
            key={pageIndex}
            style={{
              marginLeft: `${indentLevel}px`, // Indent dynamically
              marginTop: "10px",
            }}
          >
            <label>
              Page Title:
              <input
                type="text"
                value={page.pageTitle}
                onChange={(e) => {
                  page.pageTitle = e.target.value;
                  setBook({ ...book } as Book);
                }}
              />
            </label>
            <label>
              Content Type:
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="text">Text</option>
                <option value="heading1">Heading 1</option>
                <option value="heading2">Heading 2</option>
                <option value="heading3">Heading 3</option>
                <option value="space">Space</option>
                <option value="image">Image</option>
                <option value="horizontalLine">Horizontal Line</option>
                <option value="quiz">Quiz</option>
                <option value="orderedList">Ordered List</option>
                <option value="decision">Decision</option>
                <option value="table">Table</option>
              </select>
            </label>
            <button onClick={() => addContentItem(page, selectedType as ContentItem["type"])}>
              Add Content Item
            </button>
            <button onClick={() => removePage(pages, pageIndex)}>Remove Page</button>
            <div style={{ marginLeft: "20px" }}>
              {page.items.map((item, itemIndex) => (
                <div key={itemIndex}>
                  {renderEditableContentItem(
                    item,
                    (newValue) => {
                      page.items[itemIndex] = { ...item, ...newValue } as ContentItem;
                      setBook({ ...book } as Book);
                    },
                    () => removeContentItem(page, itemIndex)
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        <button onClick={onAddPage}>Add Page</button>
      </div>
    );
  };



  return (
    <DashboardLayout>
      <h1>Book Editor</h1>
      {!book ? (
        <div>
          <input type="file" accept="application/json" onChange={handleFileUpload} />
          <button
            onClick={() =>
              setBook({
                bookTitle: "",
                subTitle: "",
                heading: "",
                coverUrl: "",
                content: [],
                cpd_enabled: false,
                content_keystrokes_threshold: 0,
                topbar_search_threshold: 0,
                cpd_minimum_threshold: 0,
                learning_hours_threshold: 0,
                points_multiplier_increment: 0,
                courseName: "",
                trainingProvider: "",
                utils: {},
                pointsConfig: {
                  video_watched: 0,
                  top_search_made: 0,
                  content_search_made: 0,
                  refresh_made: 0,
                  page_visited: 0,
                  download_made: 0,
                  image_clicked: 0,
                  quizMultiplier: 0,
                  retriesMultiplier: 0,
                },
              } as Book)
            }
          >
            Start from Scratch
          </button>
        </div>
      ) : (
        <div>
          <div>
            <input type="file" accept="application/json" onChange={handleFileUpload} />
            <p>Upload Json file</p>
          </div>
          <label>
            Book Title:
            <input
              type="text"
              value={book.bookTitle}
              onChange={(e) => setBook({ ...book, bookTitle: e.target.value })}
            />
          </label>
          <button onClick={addChapter}>Add Chapter</button>
          <button onClick={handleDownload}>Download JSON</button>

          {book.content.map((chapter, chapterIndex) => (
            <div key={chapterIndex}>
              <label>
                Chapter Title:
                <input
                  type="text"
                  value={chapter.chapter}
                  onChange={(e) => {
                    const updatedChapters = [...book.content];
                    updatedChapters[chapterIndex].chapter = e.target.value;
                    setBook({ ...book, content: updatedChapters } as Book);
                  }}
                />
              </label>
              <button onClick={() => addSubChapter(chapterIndex)}>Add SubChapter</button>
              <button onClick={() => removeChapter(chapterIndex)}>Remove Chapter</button>
              {renderPages(
                chapter.pages || [],
                () => {
                  const updatedChapters = [...book.content];
                  updatedChapters[chapterIndex].pages = [
                    ...(updatedChapters[chapterIndex].pages || []),
                    { pageTitle: "New Page", items: [] },
                  ];
                  setBook({ ...book, content: updatedChapters } as Book);
                },
                20 // Chapter-level indentation
              )}
              {chapter.subChapters?.map((subChapter, subChapterIndex) => (
                <div key={subChapterIndex} style={{ marginLeft: "20px" }}>
                  <label>
                    SubChapter Title:
                    <input
                      type="text"
                      value={subChapter.subChapterTitle}
                      onChange={(e) => {
                        const updatedChapters = [...book.content];
                        updatedChapters[chapterIndex].subChapters![
                          subChapterIndex
                        ].subChapterTitle = e.target.value;
                        setBook({ ...book, content: updatedChapters } as Book);
                      }}
                    />
                  </label>
                  <button onClick={() => addSubSubChapter(chapterIndex, subChapterIndex)}>
                    Add SubSubChapter
                  </button>
                  <button
                    onClick={() => removeSubChapter(chapter.subChapters!, subChapterIndex)}
                  >
                    Remove SubChapter
                  </button>
                  {renderPages(
                    subChapter.pages || [],
                    () => addPageToSubChapter(chapterIndex, subChapterIndex),
                    40
                  )}
                  {subChapter.subSubChapters?.map((subSubChapter, subSubChapterIndex) => (
                    <div key={subSubChapterIndex} style={{ marginLeft: "40px" }}>
                      <label>
                        SubSubChapter Title:
                        <input
                          type="text"
                          value={subSubChapter.subSubChapterTitle}
                          onChange={(e) => {
                            const updatedChapters = [...book.content];
                            updatedChapters[chapterIndex].subChapters![
                              subChapterIndex
                            ].subSubChapters![subSubChapterIndex].subSubChapterTitle =
                              e.target.value;
                            setBook({ ...book, content: updatedChapters } as Book);
                          }}
                        />
                      </label>
                      <button
                        onClick={() =>
                          removeSubSubChapter(
                            subChapter.subSubChapters!,
                            subSubChapterIndex
                          )
                        }
                      >
                        Remove SubSubChapter
                      </button>

                      {renderPages(
                        subSubChapter.pages || [],
                        () => addPageToSubSubChapter(chapterIndex, subChapterIndex, subSubChapterIndex),
                        60 // Sub-subchapter-level indentation
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
      <div style={{ flex: "1", backgroundColor: "#f9f9f9", padding: "10px" }}>
        {renderPreview()}
      </div>
    </DashboardLayout>
  );
};

export default Editor;
