"use client";
import React, { useEffect, useMemo, useState } from "react";
import useEBooks, { IChprbnBook } from "../hooks/useEBooks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { approveEbook, getEbookVersion, getFile } from "@/utils/book.services";
import { Data, FlattenedObj } from "../booktypes";
import RenderBook from "../components/RenderBook";
import { flattenArrayOfObjects } from "../helpers";
import { Button } from "@/components/ui";
import { Loader2 } from "lucide-react";
import { showToast } from "@/utils/toast";
import { useFetchProfile } from "@/hooks/api/queries/settings";

function ApprovalPage(props) {
  const { data: ebooks } = useEBooks();
  const { data: user } = useFetchProfile();
  const [currentBookID, setCurrentBookID] = useState<string | null>(null);
  const [currentVersion, setCurrentVersion] = useState<string | null>(null);
  const [loadingBook, setLoadingBook] = useState(false);
  const [data, setData] = useState<Data | null>(null);

  const currentBook: IChprbnBook | undefined = useMemo(() => {
    return ebooks?.find((b) => b.id.toString() === currentBookID) || undefined;
  }, [currentBookID]);

  const hasApprovalAccess = useMemo(() => {
    return !!currentBook?.approvers.find((u) => u.id === user?.data?.id);
  }, [currentBook, user]);

  const getCurrentBookVersion = async (id: string, version: string | null) => {
    if (id) {
      setLoadingBook(true);
      try {
        const res = await getEbookVersion(Number(id), version);
        downloadBook(res.data.fileUrl);
      } catch (error) {
        setLoadingBook(false);
      }
    }
  };

  const downloadBook = async (url) => {
    try {
      const bookData = (await getFile(url)) as Data;
      setData(bookData);
    } catch (error) {
    } finally {
      setLoadingBook(false);
    }
  };

  const flattenBookData: FlattenedObj[] = useMemo(() => {
    return flattenArrayOfObjects(data ? data?.book?.content : []);
  }, [data?.book]);

  const approveVersion = async () => {
    try {
      await approveEbook(currentVersion);
      showToast("Approval successful");
    } catch (error) {}
  };

  return (
    <div className="py-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Select
            value={currentBookID}
            onValueChange={(e) => {
              setCurrentBookID(e);
            }}
          >
            <SelectTrigger value={null} className="w-[180px]">
              <SelectValue placeholder="Select book" />
            </SelectTrigger>
            <SelectContent>
              {ebooks?.map((version, i) => (
                <SelectItem value={version.id.toString()} key={i}>
                  {version.bookType}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={currentVersion}
            onValueChange={(e) => {
              setCurrentVersion(e);
              getCurrentBookVersion(currentBookID, e);
            }}
            disabled={!currentBookID}
          >
            <SelectTrigger value={null} className="w-[180px]">
              <SelectValue placeholder="Select book" />
            </SelectTrigger>
            <SelectContent>
              {currentBook?.versions?.map((version, i) => (
                <SelectItem value={version.version.toString()} key={i}>
                  version {version.version}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {currentBookID && (
          <Button
            className="w-fit h-[40px]"
            onClick={approveVersion}
            disabled={!currentVersion || !hasApprovalAccess}
          >
            {hasApprovalAccess
              ? "Approve"
              : "You do not have access to approve this book"}
          </Button>
        )}
      </div>
      {!currentBookID || !currentVersion ? (
        <div className="mt-[50px] p-6 text-center">
          <p>Select a book and version</p>
        </div>
      ) : loadingBook ? (
        <div className="w-full flex items-center justify-center py-10">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <div>
          <RenderBook
            flattenBookData={flattenBookData}
            data={data}
            currentBook={data?.book}
            canEdit={false}
          />
        </div>
      )}
    </div>
  );
}

export default ApprovalPage;
