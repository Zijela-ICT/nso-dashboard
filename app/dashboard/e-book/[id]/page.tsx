"use client";
import React, { useEffect, useMemo, useState } from "react";
import { FileJson2Icon, Loader2, Upload } from "lucide-react";
import useBookMethods from "../hooks/useBookMethods";

import { UploadFileModal } from "../components/UploadFileModal";
import { useBookContext } from "../context/bookContext";
import { useParams, useRouter } from "next/navigation";
import { Button, Spinner } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RenderBook from "../components/RenderBook";
import { useFetchProfile } from "@/hooks/api/queries/settings";
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
import { unflattenArrayOfObjects } from "../helpers";

function Ebook() {
  const {
    setBookTitle,
    addNewPageElement,
    removeElement,
    addNewElement,
    flattenBookData,
    updateElementAtPath,
    data,
    setShowDropdown,
    handleFileUpload,
    exportToJson,
    createNewItem,
    saveBookUpdates,
    createNewBook,
    currentBook,
    loadingBook,
    getCurrentBookVersion,
    bookVersion,
    fixDecisionTree,
  } = useBookMethods();
  const { data: user } = useFetchProfile();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { isEditting, setIsEditting } = useBookContext();
  const [pickedversion, setPickedVersion] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const hasEditAccess = useMemo(() => {
    return !!currentBook?.editors.find((u) => u.id === user?.data?.id);
  }, [currentBook, user]);

  useEffect(() => {
    if (!isEditting) {
      return;
    }

    // Override router.push and router.replace
    const originalPush = router.push;
    const originalReplace = router.replace;

    router.push = (href) => {
      handleRouteChange(href);
    };

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };

    const confirmNavigation = (callback) => {
      const confirmLeave = confirm(
        "You have unsaved changes, are you sure you want to proceed?"
      );
      if (confirmLeave) {
        setIsEditting(false);
        callback();
      }
    };

    const handleRouteChange = (href) => {
      confirmNavigation(() => originalPush(href));
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);

      // Restore original router methods
      router.push = originalPush;
      router.replace = originalReplace;
    };
  }, [router, isEditting]);

  console.log("unflattend", unflattenArrayOfObjects(flattenBookData));

  const bookVersions = useMemo(() => {
    return (
      currentBook?.versions?.sort((a, b) => {
        return a.version === b.version ? 0 : a.version > b.version ? -1 : 1;
      }) || []
    );
  }, [currentBook]);

  if (loadingBook) {
    return (
      <div className="w-full flex items-center justify-center py-10">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!currentBook) {
    return (
      <>
        <div className="py-[200px] flex flex-col items-center justify-center">
          <h2 className="mb-4">This book does not exist yet</h2>
          <Button
            className="w-[200px] mx-auto"
            onClick={createNewBook}
          >{`Create ${params.id} book`}</Button>
        </div>
      </>
    );
  }

  return (
    <div
      className="App bg-[#F8FAFC] min-h-screen w-full md:w-[900px] mx-auto text-left relative py-[40px] overflow-hidden transition-all duration-300 ease-in-out"
      onClick={() => {
        setShowDropdown(false);
      }}
    >
      {loadingBook || !data?.book ? (
        <div className="w-full py-[100px] flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <>
          <Select
            value={bookVersion}
            onValueChange={(e) => {
              if (!isEditting) {
                getCurrentBookVersion(e);
              } else {
                setPickedVersion(e);
                setShowAlert(true);
              }
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select book version" />
            </SelectTrigger>
            <SelectContent>
              {bookVersions.map((version, i) => (
                <SelectItem value={version.version.toString()} key={i}>
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
            currentBook={data?.book}
            bookInfo={currentBook}
            canEdit={true}
            fixDecisionTree={fixDecisionTree}
          />

          {hasEditAccess && isEditting && (
            <>
              <UploadFileModal onChange={handleFileUpload}>
                <button className="fixed bottom-[120px] right-12 bg-[#136c2a] text-white px-4 h-[60px] w-[60px] rounded-full flex items-center justify-center shadow-md hover:shadow-lg">
                  <Upload />
                </button>
              </UploadFileModal>
              <button
                onClick={exportToJson}
                className="fixed bottom-10 right-10 bg-[#8a260c] text-white px-4 h-[70px] w-[70px] rounded-full flex items-center justify-center shadow-md hover:shadow-lg"
              >
                <FileJson2Icon />
              </button>
            </>
          )}
        </>
      )}
      <AlertDialog open={showAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved updates. Are you sure you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowAlert(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                getCurrentBookVersion(pickedversion);
                setShowAlert(false);
                setIsEditting(false);
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default Ebook;
