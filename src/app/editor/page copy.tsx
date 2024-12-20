"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@src/components/DashboardLayout";
import { Book, Chapter, Page, ContentItem, Text, Heading, WithBase, Space } from "@src/types/book.types";

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
      content: [...(book?.content || []), { chapter: "New Chapter", pages: [] }],
    } as Book);
  };

  const addPage = (chapterIndex: number) => {
    const updatedChapters = [...(book?.content || [])];
    updatedChapters[chapterIndex].pages = [
      ...(updatedChapters[chapterIndex].pages || []),
      { pageTitle: "New Page", items: [] },
    ];
    setBook({ ...book, content: updatedChapters } as Book);
  };

  const addContentItem = (chapterIndex: number, pageIndex: number) => {
    const updatedChapters = [...(book?.content || [])];
    const pages = updatedChapters[chapterIndex].pages || [];

    let newItem: ContentItem;
    switch (selectedType) {
      case "text":
        newItem = { type: "text", content: "New Text Content" } as WithBase<Text>;
        break;
      case "heading1":
      case "heading2":
      case "heading3":
        newItem = { type: selectedType, content: "New Heading" } as WithBase<Heading>;
        break;
      case "space":
        newItem = { type: "space" } as WithBase<Space>;
        break;
      // Add other cases for additional types (unorderedList, orderedList, etc.)
      default:
        throw new Error("Unsupported content type.");
    }

    pages[pageIndex].items = [...(pages[pageIndex].items || []), newItem];
    updatedChapters[chapterIndex].pages = pages;
    setBook({ ...book, content: updatedChapters } as Book);
  };

  const renderPreview = () => {
    if (!book) return null;
  
    return (
      <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc" }}>
        <h2>Preview</h2>
        <h3>{book.bookTitle}</h3>
        {book.content.map((chapter, chapterIndex) => (
          <div key={chapterIndex} style={{ marginTop: "10px" }}>
            <h4>{chapter.chapter}</h4>
            {chapter.pages?.map((page, pageIndex) => (
              <div key={pageIndex}>
                <h5>{page.pageTitle}</h5>
                {page.items.map((item, itemIndex) => (
                  <div key={itemIndex} style={{ marginBottom: "10px" }}>
                    {renderEditableContentItem(item, chapterIndex, pageIndex, itemIndex)}
                    <button
                      onClick={() =>
                        updateContentItem(chapterIndex, pageIndex, itemIndex, {
                          onlyBook: !item.onlyBook,
                        })
                      }
                    >
                      Toggle OnlyBook
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };
  

  const updateContentItem = (
    chapterIndex: number,
    pageIndex: number,
    itemIndex: number,
    newValue: Partial<ContentItem>
  ) => {
    const updatedChapters = [...(book?.content || [])];
    const pages = updatedChapters[chapterIndex].pages || [];
    const currentItem = pages[pageIndex].items[itemIndex];
  
    // Ensure type consistency
    if (newValue.type && newValue.type !== currentItem.type) {
      throw new Error("Type mismatch: Cannot change the type of a ContentItem.");
    }
  
    pages[pageIndex].items[itemIndex] = {
      ...currentItem,
      ...newValue,
    };
    updatedChapters[chapterIndex].pages = pages;
    setBook({ ...book, content: updatedChapters } as Book);
  };
  
  const renderEditableContentItem = (
    item: ContentItem,
    chapterIndex: number,
    pageIndex: number,
    itemIndex: number
  ) => {
    switch (item.type) {
      case "text":
        return (
          <div>
            <label>
              Text Content:
              <input
                type="text"
                value={(item as WithBase<Text>).content}
                onChange={(e) =>
                  updateContentItem(chapterIndex, pageIndex, itemIndex, {
                    content: e.target.value,
                  })
                }
              />
            </label>
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
                value={(item as WithBase<Heading>).content}
                onChange={(e) =>
                  updateContentItem(chapterIndex, pageIndex, itemIndex, {
                    content: e.target.value,
                  })
                }
              />
            </label>
          </div>
        );
      case "space":
        return <p>Space (Cannot edit)</p>;
      // Add cases for other content types as needed
      default:
        return <p>Unsupported Content Type</p>;
    }
  };
  

  return (
    <DashboardLayout>
      <h1>eBook Editor</h1>
      {!book ? (
        <div>
          <h2>Create or Upload a Book</h2>
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
            <label>
              Book Title:
              <input
                type="text"
                value={book.bookTitle}
                onChange={(e) => setBook({ ...book, bookTitle: e.target.value })}
              />
            </label>
          </div>
          <button onClick={addChapter}>Add Chapter</button>
          {book.content.map((chapter, chapterIndex) => (
            <div key={chapterIndex} style={{ marginTop: "20px" }}>
              <h3>{chapter.chapter}</h3>
              <button onClick={() => addPage(chapterIndex)}>Add Page</button>
              {chapter.pages?.map((page, pageIndex) => (
                <div key={pageIndex} style={{ marginTop: "10px" }}>
                  <h4>{page.pageTitle}</h4>
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
                      {/* Add options for other content types */}
                    </select>
                  </label>
                  <button onClick={() => addContentItem(chapterIndex, pageIndex)}>
                    Add Content Item
                  </button>
                </div>
              ))}
            </div>
          ))}
          {renderPreview()}
          <button onClick={handleDownload}>Download Book</button>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Editor;
