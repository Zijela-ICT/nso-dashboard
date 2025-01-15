import React, { useState } from "react";
import PageItems from "./PageItems";
import { Book, Data, FlattenedObj } from "../booktypes";
import SectionHeader from "./SectionHeader";
import { ChevronDown } from "lucide-react";
import BookHeader from "./BookHeader";
import { useBookContext } from "../context/bookContext";
import { useParams } from "next/navigation";
import { IChprbnBook } from "../hooks/useEBooks";

function RenderBook({
  flattenBookData,
  data,
  updateElementAtPath,
  addNewElement,
  removeElement,
  createNewItem,
  addNewPageElement,
  setBookTitle,
  saveBookUpdates,
  currentBook,
  canEdit = true,
  bookInfo,
}: {
  flattenBookData: FlattenedObj[];
  data: Data;
  currentBook: Book;
  updateElementAtPath?: (e, f) => void;
  addNewElement?: (e, f, g) => void;
  removeElement?: () => void;
  createNewItem?: (e, f) => void;
  addNewPageElement?: (e, f) => void;
  setBookTitle?: (e) => void;
  saveBookUpdates?: (e, f) => void;
  canEdit?: boolean;
  bookInfo?: IChprbnBook;
}) {
  const params = useParams();
  const { isEditting } = useBookContext();
  const [foldedSection, setFoldedSection] = useState<Array<number[]>>([]);

  function containsSubArray(subArray) {
    return foldedSection.some(
      (arr) =>
        arr.length === subArray.length &&
        arr.every((num, index) => num === subArray[index])
    );
  }

  const toggleItem = (indices: number[]) => {
    if (containsSubArray(indices)) {
      setFoldedSection((prev) =>
        prev.filter((n) => JSON.stringify(n) !== JSON.stringify(indices))
      );
    } else {
      setFoldedSection([...foldedSection, indices]);
    }
  };

  const parentFolded = (indices: number[]) => {
    const present = false;
    const currentIndexStep = [];
    for (let index = 0; index < indices.length; index++) {
      currentIndexStep.push(indices[index]);
      if (containsSubArray(currentIndexStep) && containsSubArray.length) {
        return true;
      }
    }
    return present;
  };

  return (
    <>
      <BookHeader
        book={currentBook}
        setBookTitle={setBookTitle}
        addNewPageElement={addNewPageElement}
        saveBookUpdates={() =>
          saveBookUpdates(
            currentBook.bookTitle || `New ${params.id} BOOK`,
            bookInfo.id
          )
        }
        canEdit={canEdit}
        bookInfo={bookInfo}
      />

      <div className="w-full md:w-[800px] min-h-[90vh] bg-white py-[40px] px-[40px] mb-[50px] border-[#EAEDFF] border mx-auto relative rounded-lg">
        {flattenBookData.map((chapter, index) => {
          const isHeader = typeof chapter.data === "string";
          const indices = [...chapter.parentIndex];
          indices.pop();
          if (parentFolded(indices)) {
            return null;
          }
          return (
            <div key={index} className="container mx-auto">
              {isHeader ? (
                <div
                  style={{
                    marginLeft: chapter.parentIndex.length * 25,
                    // isEditting
                    //   ? chapter.parentIndex.length * 20
                    //   : 0,
                  }}
                >
                  <div className="flex items-center mb-2">
                    <ChevronDown
                      size={18}
                      color="#0CA554"
                      onClick={() => toggleItem(chapter.parentIndex)}
                      className={`${
                        containsSubArray(chapter.parentIndex)
                          ? "rotate-180"
                          : "rotate-0"
                      } cursor-pointer`}
                    />
                    <SectionHeader
                      updateElementAtPath={updateElementAtPath}
                      index={index}
                      chapter={chapter}
                      flattenBookData={flattenBookData}
                      removeElement={removeElement}
                      addNewPageElement={addNewPageElement}
                      addNewElement={addNewElement}
                    />
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    marginLeft: chapter.parentIndex.length * 20,
                    // isEditting
                    //   ? chapter.parentIndex.length * 20
                    //   : 0,
                  }}
                >
                  <PageItems
                    items={[chapter as FlattenedObj]}
                    data={data}
                    updateElementAtPath={(e, f) => updateElementAtPath(e, f)}
                    key={index}
                    elementIndex={index}
                    addNewElement={addNewElement}
                    removeElement={removeElement}
                    createNewItem={createNewItem}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

export default RenderBook;
