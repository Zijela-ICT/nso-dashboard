import { Book, Chapter, Page } from "@src/types/book.types";
import PageList from "./PageList";
import SubChapterEditor from "./SubChapterEditor";
import Accordion from "./common/Accordion";

interface ChapterEditorProps {
  chapter: Chapter;
  chapterIndex: number;
  book: Book;
  setBook: (book: Book) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  openModal: (page: Page) => void;
}

const ChapterEditor = ({ 
  chapter, 
  chapterIndex, 
  book, 
  setBook, 
  selectedType, 
  setSelectedType, 
  openModal 
}: ChapterEditorProps) => {
  const addSubChapter = () => {
    const updatedChapters = [...book.content];
    updatedChapters[chapterIndex].subChapters = [
      ...(updatedChapters[chapterIndex].subChapters || []),
      { subChapterTitle: "New SubChapter", pages: [], subSubChapters: [] },
    ];
    setBook({ ...book, content: updatedChapters } as Book);
  };

  const removeChapter = () => {
    const updatedChapters = [...book.content];
    updatedChapters.splice(chapterIndex, 1);
    setBook({ ...book, content: updatedChapters } as Book);
  };

  const chapterTitle = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <input
        type="text"
        value={chapter.chapter}
        onChange={(e) => {
          const updatedChapters = [...book.content];
          updatedChapters[chapterIndex].chapter = e.target.value;
          setBook({ ...book, content: updatedChapters } as Book);
        }}
      />
    </div>
  );

  const chapterControls = (
    <>
      <button onClick={addSubChapter}>Add SubChapter</button>
      <button onClick={removeChapter}>Remove Chapter</button>
    </>
  );

  return (
    <div style={{ marginBottom: '10px' }}>
      <Accordion 
        title={chapterTitle}
        controls={chapterControls}
        defaultOpen={false}
      >
        <PageList
          pages={chapter.pages || []}
          onAddPage={() => {
            const updatedChapters = [...book.content];
            updatedChapters[chapterIndex].pages = [
              ...(updatedChapters[chapterIndex].pages || []),
              { pageTitle: "New Page", items: [] },
            ];
            setBook({ ...book, content: updatedChapters } as Book);
          }}
          book={book}
          setBook={setBook}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          openModal={openModal}
          indentLevel={20}
        />

        {chapter.subChapters?.map((subChapter, subChapterIndex) => (
          <SubChapterEditor
            key={subChapterIndex}
            subChapter={subChapter}
            chapterIndex={chapterIndex}
            subChapterIndex={subChapterIndex}
            book={book}
            setBook={setBook}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            openModal={openModal}
          />
        ))}
      </Accordion>
    </div>
  );
};

export default ChapterEditor; 