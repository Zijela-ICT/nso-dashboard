import React, { useEffect, useState } from "react";
import PageItems from "./PageItems";
import { Book, Data, FlattenedObj } from "../booktypes";
import SectionHeader from "./SectionHeader";
import { ChevronDown } from "lucide-react";
import BookHeader from "./BookHeader";
import { useParams } from "next/navigation";
import { IChprbnBook } from "../hooks/useEBooks";
import { useBookContext } from "../context/bookContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui";

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
  foldBook = true,
  fixDecisionTree,
}: {
  flattenBookData: FlattenedObj[];
  data: Data;
  currentBook: Book;
  updateElementAtPath?: (e, f) => void;
  addNewElement?: (e, f, g) => void;
  removeElement?: (e) => void;
  createNewItem?: (e, f) => void;
  addNewPageElement?: (e, f) => void;
  setBookTitle?: (e) => void;
  saveBookUpdates?: (e, f) => void;
  canEdit?: boolean;
  bookInfo?: IChprbnBook;
  foldBook?: boolean;
  fixDecisionTree?: (e, f) => void;
}) {
  const { isEditting } = useBookContext();
  const params = useParams();
  const [foldedSection, setFoldedSection] = useState<Array<number[]>>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [headerToDelete, setHeaderToDelete] = useState<number | null>(null);

  useEffect(() => {
    if (!foldBook) {
      return;
    }
    const indices = flattenBookData.map((b) => b.parentIndex);
    if (!isEditting) {
      setFoldedSection(indices);
    }
  }, [flattenBookData]);

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

  const iconText = (length) => {
    switch (length) {
      case 1:
        return "📘";
      case 2:
        return "📖";
      case 3:
        return "🔖";
      case 4:
        return "📄";
      default:
        return "📄";
    }
  };

  // Handler for header deletion confirmation
  const handleHeaderDelete = (e: number) => {
    setHeaderToDelete(e);
    setShowDeleteConfirm(true);
  };

  const confirmHeaderDelete = () => {
    if (headerToDelete) {
      removeElement(headerToDelete);
      setHeaderToDelete(null);
    }
    setShowDeleteConfirm(false);
  };

  const cancelHeaderDelete = () => {
    setHeaderToDelete(null);
    setShowDeleteConfirm(false);
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

      <div className="parent-wrapper w-full md:w-[900px] min-h-[90vh] bg-white py-[40px] px-0 md:px-[40px] mb-[50px] border-[#EAEDFF] border mx-auto relative rounded-lg">
        {flattenBookData.map((chapter, index) => {
          const isHeader = typeof chapter.data === "string";
          const indices = [...chapter.parentIndex];
          indices.pop();

          if (parentFolded(indices)) {
            return null;
          }

          return (
            <div key={index} className="container mx-auto overflow-x-auto">
              {isHeader ? (
                <div
                  style={{
                    marginLeft: chapter.parentIndex.length * 20,
                  }}
                >
                  <div className="flex items-center mb-2">
                    <ChevronDown
                      size={18}
                      color="#0CA554"
                      onClick={() => toggleItem(chapter.parentIndex)}
                      className={`${
                        !containsSubArray(chapter.parentIndex)
                          ? "rotate-180"
                          : "rotate-0"
                      } cursor-pointer`}
                    />
                    <span className="mr-2 text-[20px]">
                      {iconText(chapter.parentIndex.length)}
                    </span>
                    <SectionHeader
                      updateElementAtPath={updateElementAtPath}
                      index={index}
                      chapter={chapter}
                      flattenBookData={flattenBookData}
                      removeElement={handleHeaderDelete}
                      addNewPageElement={addNewPageElement}
                      addNewElement={addNewElement}
                    />
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    marginLeft: chapter.parentIndex.length * 20,
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
                    fixDecisionTree={fixDecisionTree}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Header Deletion Confirmation Modal */}
      <AlertDialog open={showDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Header</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this header ? This action will
              also remove all content within this section and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelHeaderDelete}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmHeaderDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default RenderBook;
