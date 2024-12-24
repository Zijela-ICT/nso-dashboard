import { Book } from "@src/types/book.types";
import { renderPreview } from "../utils/previewUtils";

interface PreviewPanelProps {
  book: Book;
}

const PreviewPanel = ({ book }: PreviewPanelProps) => {
  return (
    <div style={{ 
      flex: 1,
      overflowY: "auto",
      padding: "20px",
      backgroundColor: "#f9f9f9",
      border: "1px solid #ccc",
      borderRadius: "4px"
    }}>
      {renderPreview(book)}
    </div>
  );
};

export default PreviewPanel; 