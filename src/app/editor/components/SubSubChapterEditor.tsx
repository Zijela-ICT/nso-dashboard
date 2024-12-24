import { Book, SubSubChapter, Page } from "@src/types/book.types";
import PageList from "./PageList";
import Accordion from "./common/Accordion";

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

  const subSubChapterTitle = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
    </div>
  );

  const subSubChapterControls = (
    <button onClick={removeSubSubChapter}>Remove SubSubChapter</button>
  );

  return (
    <div style={{ marginBottom: '10px' }}>
      <Accordion
        title={subSubChapterTitle}
        controls={subSubChapterControls}
        defaultOpen={false}
      >
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
      </Accordion>
    </div>
  );
};

export default SubSubChapterEditor; 