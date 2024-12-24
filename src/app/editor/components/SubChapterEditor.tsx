import { Book, SubChapter, Page } from "@src/types/book.types";
import SubSubChapterEditor from "./SubSubChapterEditor";
import PageList from "./PageList";
import Accordion from "./common/Accordion";

interface SubChapterEditorProps {
  subChapter: SubChapter;
  chapterIndex: number;
  subChapterIndex: number;
  book: Book;
  setBook: (book: Book) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  openModal: (page: Page) => void;
}

const SubChapterEditor = ({
  subChapter,
  chapterIndex,
  subChapterIndex,
  book,
  setBook,
  selectedType,
  setSelectedType,
  openModal,
}: SubChapterEditorProps) => {
  const addSubSubChapter = () => {
    const updatedChapters = [...book.content];
    const subChapters = updatedChapters[chapterIndex].subChapters || [];
    subChapters[subChapterIndex].subSubChapters = [
      ...(subChapters[subChapterIndex].subSubChapters || []),
      { subSubChapterTitle: "New SubSubChapter", pages: [] },
    ];
    updatedChapters[chapterIndex].subChapters = subChapters;
    setBook({ ...book, content: updatedChapters } as Book);
  };

  const removeSubChapter = () => {
    const updatedChapters = [...book.content];
    updatedChapters[chapterIndex].subChapters?.splice(subChapterIndex, 1);
    setBook({ ...book, content: updatedChapters } as Book);
  };

  const subChapterTitle = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <input
        type="text"
        value={subChapter.subChapterTitle}
        onChange={(e) => {
          const updatedChapters = [...book.content];
          updatedChapters[chapterIndex].subChapters![subChapterIndex].subChapterTitle = e.target.value;
          setBook({ ...book, content: updatedChapters } as Book);
        }}
      />
    </div>
  );

  const subChapterControls = (
    <>
      <button onClick={addSubSubChapter}>Add SubSubChapter</button>
      <button onClick={removeSubChapter}>Remove SubChapter</button>
    </>
  );

  return (
    <div style={{ marginBottom: '10px' }}>
      <Accordion
        title={subChapterTitle}
        controls={subChapterControls}
        defaultOpen={false}
      >
        <PageList
          pages={subChapter.pages || []}
          onAddPage={() => {
            const updatedChapters = [...book.content];
            const subChapters = updatedChapters[chapterIndex].subChapters || [];
            subChapters[subChapterIndex].pages = [
              ...(subChapters[subChapterIndex].pages || []),
              { pageTitle: "New Page", items: [] },
            ];
            updatedChapters[chapterIndex].subChapters = subChapters;
            setBook({ ...book, content: updatedChapters } as Book);
          }}
          book={book}
          setBook={setBook}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          openModal={openModal}
          indentLevel={40}
        />

        {subChapter.subSubChapters?.map((subSubChapter, subSubChapterIndex) => (
          <SubSubChapterEditor
            key={subSubChapterIndex}
            subSubChapter={subSubChapter}
            chapterIndex={chapterIndex}
            subChapterIndex={subChapterIndex}
            subSubChapterIndex={subSubChapterIndex}
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

export default SubChapterEditor; 