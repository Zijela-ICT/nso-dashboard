"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@src/components/DashboardLayout";
import { Book, ContentItem, Page, Text, Space, BookImage, horizontalLine, OrderedList, Quiz, Table, Decision } from "@src/types/book.types";
import EditorPanel from "./components/EditorPanel";
import PreviewPanel from "./components/PreviewPanel";
import HeaderControls from "./components/HeaderControls";
import InsertItemModal from "./components/InsertItemModal";
import { ensureDefaults } from "./utils/tableUtils";

const Editor = () => {
  const [book, setBook] = useState<Book | null>(null);
  const [selectedType, setSelectedType] = useState<string>("text");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);

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
        console.error(error);
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

  const openModal = (page: Page) => {
    setSelectedPage(page);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPage(null);
  };

  const addContentItem = (target: Page, type: ContentItem["type"], position?: number) => {
    let newItem: ContentItem;

    switch (type) {
      case "text":
        newItem = { type: "text", content: "New Text Content" };
        break;
      case "heading1":
        newItem = { type: "heading1", content: "New Heading 1" };
        break;
      case "heading2":
        newItem = { type: "heading2", content: "New Heading 2" };
        break;
      case "heading3":
        newItem = { type: "heading3", content: "New Heading 3" };
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

    if (typeof position === 'number') {
      target.items.splice(position, 0, newItem);
    } else {
      target.items = [...(target.items || []), newItem];
    }
    setBook({ ...book } as Book);
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
          <HeaderControls
            book={book}
            setBook={setBook}
            handleFileUpload={handleFileUpload}
            handleDownload={handleDownload}
          />

          <div style={{
            display: "flex",
            gap: "20px",
            height: "calc(100vh - 200px)",
          }}>
            <EditorPanel
              book={book}
              setBook={setBook}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              openModal={openModal}
            />
            <PreviewPanel book={book} />
          </div>
        </div>
      )}
      <InsertItemModal
        isOpen={isModalOpen}
        items={selectedPage?.items || []}
        onClose={closeModal}
        onInsert={(position, type, insertAfter) => {
          if (selectedPage) {
            const newPosition = insertAfter ? position + 1 : position;
            addContentItem(selectedPage, type as ContentItem["type"], newPosition);
          }
          closeModal();
        }}
        selectedType={selectedType}
      />
    </DashboardLayout>
  );
};

export default Editor;

