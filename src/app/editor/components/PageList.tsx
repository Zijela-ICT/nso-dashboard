import { Book, Page } from "@src/types/book.types";
import ContentItemEditor from "./ContentItemEditor";
import Accordion from "./common/Accordion";

interface PageListProps {
  pages: Page[];
  onAddPage: () => void;
  book: Book;
  setBook: (book: Book) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  openModal: (page: Page) => void;
  indentLevel: number;
}

const PageList = ({
  pages,
  onAddPage,
  book,
  setBook,
  selectedType,
  setSelectedType,
  openModal,
  indentLevel,
}: PageListProps) => {
  const removePage = (pageIndex: number) => {
    pages.splice(pageIndex, 1);
    setBook({ ...book } as Book);
  };

  return (
    <div>
      {pages.map((page, pageIndex) => {
        const pageTitle = (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="text"
              value={page.pageTitle}
              onChange={(e) => {
                page.pageTitle = e.target.value;
                setBook({ ...book } as Book);
              }}
            />
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
                <option value="image">Image</option>
                <option value="horizontalLine">Horizontal Line</option>
                <option value="quiz">Quiz</option>
                <option value="orderedList">Ordered List</option>
                <option value="decision">Decision</option>
                <option value="table">Table</option>
              </select>
            </label>
          </div>
        );

        const pageControls = (
          <>
            <button onClick={() => openModal(page)}>Insert at Position</button>
            <button onClick={() => removePage(pageIndex)}>Remove Page</button>
          </>
        );

        return (
          <div
            key={pageIndex}
            style={{
              marginLeft: `${indentLevel}px`,
              marginTop: "10px",
            }}
          >
            <Accordion
              title={pageTitle}
              controls={pageControls}
              defaultOpen={false}
            >
              <ContentItemEditor
                page={page}
                book={book}
                setBook={setBook}
              />
            </Accordion>
          </div>
        );
      })}
      <button onClick={onAddPage}>Add Page</button>
    </div>
  );
};

export default PageList; 