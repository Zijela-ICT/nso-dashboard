"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@src/components/DashboardLayout";
import { Book, Chapter, SubChapter, SubSubChapter, Page, ContentItem, Text, Heading, Space } from "@src/types/book.types";

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

  const addContentItem = (target: Page, type: string) => {
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
      default:
        throw new Error("Unsupported content type.");
    }

    target.items = [...(target.items || []), newItem];
    setBook({
      ...book,
    } as Book);
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
                value={item.content}
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
                value={item.content}
                onChange={(e) => onUpdate({ content: e.target.value })}
              />
            </label>
            <button onClick={onRemove}>Remove</button>
          </div>
        );
      default:
        return null;
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


  const renderPages = (pages: Page[], onAddPage: () => void) => {
    return (
      <div>
        {pages.map((page, pageIndex) => (
          <div key={pageIndex} style={{ marginLeft: "40px", marginTop: "10px" }}>
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
              </select>
            </label>
            <button onClick={() => addContentItem(page, selectedType)}>Add Content Item</button>
            <button onClick={() => removePage(pages, pageIndex)}>Remove Page</button>
            <div style={{ marginLeft: "20px" }}>
              {page.items.map((item, itemIndex) => (
                <div key={itemIndex}>
                  {renderEditableContentItem(
                    item,
                    (newValue) => {
                      page.items[itemIndex] = { ...item, ...newValue };
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
                          addPageToSubSubChapter(
                            chapterIndex,
                            subChapterIndex,
                            subSubChapterIndex
                          )
                        }
                      >
                        Add Page
                      </button>
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
                        () =>
                          addPageToSubSubChapter(
                            chapterIndex,
                            subChapterIndex,
                            subSubChapterIndex
                          )
                      )}
                    </div>
                  ))}
                </div>
              ))}

              {renderPages(
                chapter.pages || [],
                () => {
                  const updatedChapters = [...book.content];
                  updatedChapters[chapterIndex].pages = [
                    ...(updatedChapters[chapterIndex].pages || []),
                    { pageTitle: "New Page", items: [] },
                  ];
                  setBook({ ...book, content: updatedChapters } as Book);
                }
              )}
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
