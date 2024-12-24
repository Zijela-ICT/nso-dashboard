import { Book, SubSubChapter, Page } from "@src/types/book.types";
import PageList from "./PageList";

interface SubSubChapterEditorProps {
  subSubChapter: SubSubChapter;
  chapterIndex: number;
  subChapterIndex: number;
  subSubChapterIndex: number;
  book: Book;
  setBook: (book: Book) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  openModal: (page: Page) => void;
}

const SubSubChapterEditor = ({
  subSubChapter,
  chapterIndex,
  subChapterIndex,
  subSubChapterIndex,
  book,
  setBook,
  selectedType,
  setSelectedType,
  openModal,
}: SubSubChapterEditorProps) => {
  const removeSubSubChapter = () => {
    const updatedChapters = [...book.content];
    updatedChapters[chapterIndex].subChapters![subChapterIndex].subSubChapters?.splice(
      subSubChapterIndex,
      1
    );
    setBook({ ...book, content: updatedChapters } as Book);
  };

  return (
    <div style={{ marginLeft: "40px" }}>
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
      <button onClick={removeSubSubChapter}>
        Remove SubSubChapter
      </button>

      <PageList
        pages={subSubChapter.pages || []}
        onAddPage={() => {
          const updatedChapters = [...book.content];
          const subChapters = updatedChapters[chapterIndex].subChapters || [];
          const subSubChapters = subChapters[subChapterIndex].subSubChapters || [];
          subSubChapters[subSubChapterIndex].pages = [
            ...(subSubChapters[subSubChapterIndex].pages || []),
            { pageTitle: "New Page", items: [] },
          ];
          subChapters[subChapterIndex].subSubChapters = subSubChapters;
          updatedChapters[chapterIndex].subChapters = subChapters;
          setBook({ ...book, content: updatedChapters } as Book);
        }}
        book={book}
        setBook={setBook}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        openModal={openModal}
        indentLevel={60}
      />
    </div>
  );
};

export default SubSubChapterEditor; 