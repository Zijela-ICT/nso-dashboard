"use client";
import React, { useMemo, useState } from "react";
import "./page.css";

import { FlattenedObj } from "../booktypes/index";
import PageItems from "../components/PageItems";
import {
  ChevronDown,
  FileJson,
  FileJson2Icon,
  Loader,
  Loader2,
  SaveIcon,
  Upload,
} from "lucide-react";
import useBookMethods from "../hooks/useBookMethods";

import { UploadFileModal } from "../components/UploadFileModal";
import { BookProvider, useBookContext } from "../context/bookContext";
import BookHeader from "../components/BookHeader";
import SectionHeader from "../components/SectionHeader";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RenderBook from "../components/RenderBook";



function Ebook() {
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
    saveBookUpdates,
    createNewBook,
    currentBook,
    loadingBook,
    getCurrentBookVersion,
    bookVersion,
  } = useBookMethods();

  const params = useParams<{ id: string }>();

  if (loadingBook) {
    return (
      <div className="w-full flex items-center justify-center py-10">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <BookProvider>
      <div
        className="App bg-[#F8FAFC] min-h-screen w-[800px] mx-auto text-left relative py-[40px] overflow-hidden transition-all duration-300 ease-in-out"
        onClick={() => {
          setShowDropdown(false);
        }}
      >
        {!!currentBook ? (
          loadingBook ? (
            <Loader />
          ) : (
            <>
              <Select
                value={bookVersion}
                onValueChange={(e) => getCurrentBookVersion(e)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select book version" />
                </SelectTrigger>
                <SelectContent>
                  {currentBook.versions.map((version, i) => (
                    <SelectItem value={version.id.toString()} key={i}>
                      version {version.version}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <RenderBook
                flattenBookData={flattenBookData}
                data={data}
                updateElementAtPath={updateElementAtPath}
                addNewElement={addNewElement}
                removeElement={removeElement}
                createNewItem={createNewItem}
                addNewPageElement={addNewPageElement}
                setBookTitle={setBookTitle}
                saveBookUpdates={saveBookUpdates}
                currentBook={currentBook}
                canEdit={true}
              />

              <UploadFileModal onChange={handleFileUpload}>
                <button className="fixed bottom-[120px] right-12 bg-[#136c2a] text-white px-4 h-[60px] w-[60px] rounded-full flex items-center justify-center shadow-md hover:shadow-lg">
                  <Upload />
                </button>
              </UploadFileModal>
              <button
                onClick={exportToJson}
                className="fixed bottom-10 right-10 bg-[#8a260c] text-white px-4 h-[70px] w-[70px] rounded-full flex items-center justify-center shadow-md hover:shadow-lg"
              >
                {/* <SaveIcon className="text-lg" /> */}
                <FileJson2Icon />
              </button>
            </>
          )
        ) : (
          <>
            <div className="p-10 flex flex-col items-center justify-center">
              <h2 className="mb-4">This book does not exist yet</h2>
              <Button onClick={createNewBook}>Create {params.id} book</Button>
            </div>
          </>
        )}
      </div>
    </BookProvider>
  );
}

export default Ebook;
