import { Book, ContentItem, Text, Quiz, Table, OrderedList } from "@src/types/book.types";

export const renderPreview = (book: Book) => {
  const renderContentItems = (items: ContentItem[]) => {
    return items.map((item, index) => {
      switch (item.type) {
        case "text":
          return <p key={index}>{(item as Text).content}</p>;

        case "heading1":
          return <h1 key={index}>{item.content}</h1>;

        case "heading2":
          return <h2 key={index}>{item.content}</h2>;

        case "heading3":
          return <h3 key={index}>{item.content}</h3>;

        case "space":
          return <div key={index} style={{ height: "20px" }} />;

        case "image":
          return (
            <img
              key={index}
              src={item.src}
              alt={item.alt || ""}
              style={{ maxWidth: "100%" }}
            />
          );

        case "horizontalLine":
          return <hr key={index} />;

        case "orderedList":
          return (
            <ol key={index}>
              {((item as OrderedList).items || []).map((listItem, listIndex) => (
                <li key={listIndex}>{String(listItem)}</li>
              ))}
            </ol>
          );

        case "quiz":
          return (
            <div key={index}>
              <h4>Quiz: {(item as Quiz).title}</h4>
              {/* Add quiz preview rendering */}
            </div>
          );

        case "table":
          const tableItem = item as Table;
          return (
            <table key={index} style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                {(tableItem.headers || []).map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <th key={cellIndex} style={{ border: "1px solid #ccc", padding: "5px" }}>
                        {(cell as Text).content}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {(tableItem.rows || []).map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} style={{ border: "1px solid #ccc", padding: "5px" }}>
                        {(cell as Text).content}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          );

        default:
          return <p key={index}>[Unsupported content type: {item.type}]</p>;
      }
    });
  };

  const renderPages = (pages: any[]) => {
    return pages.map((page, pageIndex) => (
      <div key={pageIndex} style={{ marginLeft: "20px", marginTop: "10px" }}>
        <h5>{page.pageTitle || `Page ${pageIndex + 1}`}</h5>
        {renderContentItems(page.items)}
      </div>
    ));
  };

  const renderSubSubChapters = (subSubChapters: any[]) => {
    return subSubChapters.map((subSubChapter, subSubChapterIndex) => (
      <div key={subSubChapterIndex} style={{ marginLeft: "40px", marginTop: "10px" }}>
        <h4>{subSubChapter.subSubChapterTitle || `SubSubChapter ${subSubChapterIndex + 1}`}</h4>
        {renderPages(subSubChapter.pages || [])}
      </div>
    ));
  };

  const renderSubChapters = (subChapters: any[]) => {
    return subChapters.map((subChapter, subChapterIndex) => (
      <div key={subChapterIndex} style={{ marginLeft: "30px", marginTop: "10px" }}>
        <h3>{subChapter.subChapterTitle || `SubChapter ${subChapterIndex + 1}`}</h3>
        {renderSubSubChapters(subChapter.subSubChapters || [])}
        {renderPages(subChapter.pages || [])}
      </div>
    ));
  };

  return (
    <div>
      <h1>{book.bookTitle}</h1>
      {book.content.map((chapter, chapterIndex) => (
        <div key={chapterIndex} style={{ marginBottom: "20px" }}>
          <h2>{chapter.chapter || `Chapter ${chapterIndex + 1}`}</h2>
          {renderSubChapters(chapter.subChapters || [])}
          {renderPages(chapter.pages || [])}
        </div>
      ))}
    </div>
  );
}; 