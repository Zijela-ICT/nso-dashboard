import { Book, Page, ContentItem, Text, Quiz, Table, Decision, OrderedList } from "@src/types/book.types";
import { ensureDefaults } from "../utils/tableUtils";
import Accordion from "./common/Accordion";

interface ContentItemEditorProps {
  page: Page;
  book: Book;
  setBook: (book: Book) => void;
}

const ContentItemEditor = ({ page, book, setBook }: ContentItemEditorProps) => {
  const removeContentItem = (itemIndex: number) => {
    page.items.splice(itemIndex, 1);
    setBook({ ...book } as Book);
  };

  const renderEditableContentItem = (
    item: ContentItem,
    itemIndex: number,
    onUpdate: (newValue: Partial<ContentItem>) => void,
    onRemove: () => void
  ) => {
    const itemTitle = `${item.type} ${itemIndex + 1}`;
    const controls = <button onClick={onRemove}>Remove</button>;

    const renderContent = () => {
      switch (item.type) {
        case "text":
          return (
            <label>
              Text Content:
              <input
                type="text"
                value={(item as Text).content}
                onChange={(e) => onUpdate({ content: e.target.value })}
              />
            </label>
          );

        case "heading1":
        case "heading2":
        case "heading3":
          return (
            <label>
              Heading Content:
              <input
                type="text"
                value={item.content || ''}
                onChange={(e) => onUpdate({ content: e.target.value })}
              />
            </label>
          );

        case "space":
          return <p>[Space]</p>;

        case "image":
          return (
            <>
              <label>
                Image Source:
                <input
                  type="text"
                  value={item.src || ""}
                  onChange={(e) => onUpdate({ src: e.target.value })}
                />
              </label>
              <label>
                Alt Text:
                <input
                  type="text"
                  value={item.alt || ""}
                  onChange={(e) => onUpdate({ alt: e.target.value })}
                />
              </label>
            </>
          );

        case "horizontalLine":
          return <p>[Horizontal Line]</p>;

        case "orderedList":
          return (
            <div>
              <h4>Ordered List</h4>
              {(item as OrderedList).items.map((listItem, listIndex) => (
                <div key={listIndex} style={{ marginLeft: "20px" }}>
                  <input
                    type="text"
                    value={String(listItem)}
                    onChange={(e) => {
                      const updatedItems = [...(item as OrderedList).items];
                      updatedItems[listIndex] = e.target.value;
                      onUpdate({ items: updatedItems });
                    }}
                  />
                  <button onClick={() => {
                    const updatedItems = [...(item as OrderedList).items];
                    updatedItems.splice(listIndex, 1);
                    onUpdate({ items: updatedItems });
                  }}>
                    Remove Item
                  </button>
                </div>
              ))}
              <button onClick={() => {
                const updatedItems = [...(item as OrderedList).items, `List Item ${Date.now()}`];
                onUpdate({ items: updatedItems });
              }}>
                Add List Item
              </button>
              <button onClick={onRemove}>Remove List</button>
            </div>
          );

        case "quiz":
          const quizItem = item as Quiz;
          return (
            <div>
              <label>
                Quiz Title:
                <input
                  type="text"
                  value={quizItem.title}
                  onChange={(e) => onUpdate({ title: e.target.value })}
                />
              </label>
              {/* Add more quiz editing fields as needed */}
              <button onClick={onRemove}>Remove Quiz</button>
            </div>
          );

        case "table":
          const tableItem = item as Table;
          return (
            <div>
              <h4>Table Editor</h4>
              <label>
                Column Count:
                <input
                  type="number"
                  min="1"
                  value={tableItem.columnCount || 3}
                  onChange={(e) => {
                    const newColumnCount = Math.max(1, parseInt(e.target.value, 10) || 3);
                    const updatedHeaders = (tableItem.headers || []).map((row) =>
                      row.length < newColumnCount
                        ? [...row, ...Array(newColumnCount - row.length).fill({ type: "text", content: "" })]
                        : row.slice(0, newColumnCount)
                    );
                    const updatedRows = (tableItem.rows || []).map((row) =>
                      row.length < newColumnCount
                        ? [...row, ...Array(newColumnCount - row.length).fill({ type: "text", content: "" })]
                        : row.slice(0, newColumnCount)
                    );
                    onUpdate({
                      columnCount: newColumnCount,
                      headers: updatedHeaders,
                      rows: updatedRows,
                    });
                  }}
                />
              </label>
              {/* Add table cell editors */}
              <button onClick={onRemove}>Remove Table</button>
            </div>
          );

        case "decision":
          const decisionItem = item as Decision;
          return (
            <div>
              <label>
                Decision Name:
                <input
                  type="text"
                  value={decisionItem.name}
                  onChange={(e) => onUpdate({ name: e.target.value })}
                />
              </label>
              {/* Add more decision editing fields as needed */}
              <button onClick={onRemove}>Remove Decision</button>
            </div>
          );

        default:
          return <p>Unsupported content type: {item.type}</p>;
      }
    };

    return (
      <Accordion
        title={itemTitle}
        controls={controls}
        defaultOpen={false}
      >
        {renderContent()}
      </Accordion>
    );
  };

  return (
    <div>
      {page.items.map((item, itemIndex) => (
        <div key={itemIndex} style={{ marginBottom: '10px' }}>
          {renderEditableContentItem(
            item,
            itemIndex,
            (newValue) => {
              page.items[itemIndex] = { ...item, ...newValue } as ContentItem;
              setBook({ ...book } as Book);
            },
            () => removeContentItem(itemIndex)
          )}
        </div>
      ))}
    </div>
  );
};

export default ContentItemEditor; 