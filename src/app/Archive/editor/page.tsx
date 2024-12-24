"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@src/components/DashboardLayout";
import { Book, ContentItem, Page } from "@src/types/book.types";
import InsertItemModal from "@src/app/components/InsertItemModal";
import EditorPanel from "./components/EditorPanel";
import PreviewPanel from "./components/PreviewPanel";
import HeaderControls from "./components/HeaderControls";

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
        newItem = { type: "text", content: "New Text Content" } as Text;
        break;
      // ... rest of your switch cases ...
    }

    if (typeof position === 'number') {
      const items = [...(target.items || [])];
      items.splice(position, 0, newItem);
      target.items = items;
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

