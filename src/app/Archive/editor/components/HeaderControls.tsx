import { Book } from "@src/types/book.types";

interface HeaderControlsProps {
  book: Book;
  setBook: (book: Book) => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDownload: () => void;
}

const HeaderControls = ({ book, setBook, handleFileUpload, handleDownload }: HeaderControlsProps) => {
  return (
    <div style={{ marginBottom: "20px" }}>
      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
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
            style={{ marginLeft: "10px" }}
          />
        </label>
        <button onClick={handleDownload}>Download JSON</button>
      </div>
    </div>
  );
};

export default HeaderControls; 