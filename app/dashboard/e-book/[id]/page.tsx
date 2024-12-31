"use client";
import React, { useState } from "react";
import "./page.css";

import { FlattenedObj } from "../booktypes/index";
import PageItems from "../components/PageItems";
import { ChevronDown, SaveIcon, Upload } from "lucide-react";
import useBookMethods from "../hooks/useBookMethods";

import { UploadFileModal } from "../components/UploadFileModal";
import { MyProvider } from "../context/bookContext";
import BookHeader from "../components/BookHeader";
import SectionHeader from "../components/SectionHeader";
import useEBooks from "../hooks/useEBooks";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { uploadFile } from "@/services/apis";
import { createEbooks } from "@/services/book.services";
import { showToast } from "@/utils/toast";

export const groupClass =
  "hover:border-[#bcbcbc] border-[1px] border-dashed border-transparent rounded-[4px] cursor-pointer text-left";

function page() {
  const {
    handleMouseEnter,
    setBookTitle,
    addNewPageElement,
    removeElement,
    addNewElement,
    flattenBookData,
    updateElementAtPath,
    data,
    setShowDropdown,
    book,
    handleFileUpload,
    exportToJson,
    createNewItem,
  } = useBookMethods();
  const params = useParams<{ id: string }>();
  const { data: ebooks, refetch } = useEBooks();

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

  async function createNewBook() {
    const fileUrl = "/sample-book.json";

    try {
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }

      const jsonData = await response.json();
      const jsonFile = createJsonFile(jsonData);
      console.log("jsonFile", jsonFile);
      uploadBlankBook(jsonFile as File);
    } catch (error) {
      console.error("Error fetching file:", error.message);
    }
  }

  function createJsonFile(jsonData, fileName = "data.json") {
    const jsonString = JSON.stringify(jsonData); // Convert JSON object to string
    const blob = new Blob([jsonString], { type: "application/json" }); // Create a Blob
    const file = new File([blob], fileName, { type: "application/json" }); // Create a File object
    return file;
  }

  const uploadBlankBook = async (file: File) => {
    console.log(file);

    const form = new FormData();
    form.append("file", file);
    try {
      const res = await uploadFile(form);
      completeCreation(res.data.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  const completeCreation = async (fileUrl: string) => {
    try {
      await createEbooks({
        bookType: params.id,
        fileUrl,
      });
      refetch();
      showToast("Book created successfully", "success");
    } catch (error) {
      console.log(error.response);
    }
  };

  console.log("ebooks", ebooks);

  return (
    <MyProvider>
      <div
        className="App bg-[#F8FAFC] min-h-screen w-[800px] mx-auto text-left relative py-[40px] overflow-hidden transition-all duration-300 ease-in-out"
        onClick={() => {
          setShowDropdown(false);
        }}
      >
        {ebooks?.length &&
        !!ebooks.find((book) => book.bookType === params.id) ? (
          <>
            <BookHeader
              book={book}
              setBookTitle={setBookTitle}
              addNewPageElement={addNewPageElement}
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
                    ) : (
                      <div className="">
                        <PageItems
                          items={[chapter as FlattenedObj]}
                          handleMouseEnter={handleMouseEnter}
                          data={data}
                          updateElementAtPath={(e, f) =>
                            updateElementAtPath(e, f)
                          }
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
            <UploadFileModal onChange={handleFileUpload}>
              <button className="fixed bottom-[120px] right-12 bg-[#136c2a] text-white px-4 h-[60px] w-[60px] rounded-full flex items-center justify-center shadow-md hover:shadow-lg">
                <Upload />
              </button>
            </UploadFileModal>
            <button
              onClick={exportToJson}
              className="fixed bottom-10 right-10 bg-[#8a260c] text-white px-4 h-[70px] w-[70px] rounded-full flex items-center justify-center shadow-md hover:shadow-lg"
            >
              <SaveIcon className="text-lg" />
            </button>
          </>
        ) : (
          <>
            <div className="p-10 flex flex-col items-center justify-center">
              <h2 className="mb-4">This book does not exist yet</h2>
              <Button onClick={createNewBook}>Create {params.id} book</Button>
            </div>
          </>
        )}
      </div>
    </MyProvider>
  );
}

export default page;
