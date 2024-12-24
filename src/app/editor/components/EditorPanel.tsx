import { Book, Page } from "@src/types/book.types";
import ChapterEditor from "./ChapterEditor";

interface EditorPanelProps {
  book: Book;
  setBook: (book: Book) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  openModal: (page: Page) => void;
}

const EditorPanel = ({ book, setBook, selectedType, setSelectedType, openModal }: EditorPanelProps) => {
  const addChapter = () => {
    setBook({
      ...book,
      content: [...(book?.content || []), { chapter: "New Chapter", pages: [], subChapters: [] }],
    } as Book);
  };

  return (
    <div style={{ 
      flex: 1,
      overflowY: "auto",
      padding: "20px",
      border: "1px solid #ccc",
      borderRadius: "4px"
    }}>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={addChapter}>Add Chapter</button>
      </div>
      
      {book.content.map((chapter, chapterIndex) => (
        <ChapterEditor
          key={chapterIndex}
          chapter={chapter}
          chapterIndex={chapterIndex}
          book={book}
          setBook={setBook}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          openModal={openModal}
        />
      ))}
    </div>
  );
};

export default EditorPanel; 