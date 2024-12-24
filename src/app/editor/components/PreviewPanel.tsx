import { Book } from "@src/types/book.types";
import Accordion from "./common/Accordion";

interface PreviewPanelProps {
  book: Book;
}

const PreviewPanel = ({ book }: PreviewPanelProps) => {
  const renderContentItems = (items: any[]) => {
    return items.map((item, index) => {
      switch (item.type) {
        case "text":
          return <p key={index}>{item.content}</p>;
        case "heading1":
          return <h1 key={index}>{item.content}</h1>;
        case "heading2":
          return <h2 key={index}>{item.content}</h2>;
        case "heading3":
          return <h3 key={index}>{item.content}</h3>;
        // ... other cases remain the same
        default:
          return <p key={index}>[Unsupported content type: {item.type}]</p>;
      }
    });
  };

  const renderPages = (pages: any[]) => {
    return pages.map((page, pageIndex) => (
      <Accordion
        key={pageIndex}
        title={<h5>{page.pageTitle || `Page ${pageIndex + 1}`}</h5>}
        defaultOpen={false}
      >
        {renderContentItems(page.items || [])}
      </Accordion>
    ));
  };

  const renderSubSubChapters = (subSubChapters: any[]) => {
    return subSubChapters.map((subSubChapter, subSubChapterIndex) => (
      <Accordion
        key={subSubChapterIndex}
        title={<h4>{subSubChapter.subSubChapterTitle || `SubSubChapter ${subSubChapterIndex + 1}`}</h4>}
        defaultOpen={false}
      >
        {renderPages(subSubChapter.pages || [])}
      </Accordion>
    ));
  };

  const renderSubChapters = (subChapters: any[]) => {
    return subChapters.map((subChapter, subChapterIndex) => (
      <Accordion
        key={subChapterIndex}
        title={<h3>{subChapter.subChapterTitle || `SubChapter ${subChapterIndex + 1}`}</h3>}
        defaultOpen={false}
      >
        {renderSubSubChapters(subChapter.subSubChapters || [])}
        {renderPages(subChapter.pages || [])}
      </Accordion>
    ));
  };

  return (
    <div style={{ 
      flex: 1,
      overflowY: "auto",
      padding: "20px",
      backgroundColor: "#f9f9f9",
      border: "1px solid #ccc",
      borderRadius: "4px"
    }}>
      <h1>{book.bookTitle}</h1>
      {book.content.map((chapter, chapterIndex) => (
        <Accordion
          key={chapterIndex}
          title={<h2>{chapter.chapter || `Chapter ${chapterIndex + 1}`}</h2>}
          defaultOpen={false}
        >
          {renderSubChapters(chapter.subChapters || [])}
          {renderPages(chapter.pages || [])}
        </Accordion>
      ))}
    </div>
  );
};

export default PreviewPanel; 