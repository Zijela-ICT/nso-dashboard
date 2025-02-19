"use client";
import React, { useMemo, useState } from "react";
import useEBooks, { IChprbnBook } from "../hooks/useEBooks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  approveEbook,
  getDifferenceFromLastApproved,
  getEbookVersion,
  getFile,
  unApproveEbook,
} from "@/utils/book.services";
import {
  Data,
  FlattenedObj,
  iContent,
  IDecisionTree,
  Item,
  Linkable,
} from "../booktypes";
import RenderBook from "../components/RenderBook";
import { flattenArrayOfObjects } from "../helpers";
import { Badge, Button } from "@/components/ui";
import { Loader2 } from "lucide-react";
import { showToast } from "@/utils/toast";
import { useFetchProfile } from "@/hooks/api/queries/settings";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

export interface VersionData {
  id: number;
  version: number;
  status: "PUBLISHED" | "DRAFT";
  fileUrl: string;
  difference: {
    index: number;
    item: {
      kind: string;
      lhs?: Item | iContent | Linkable | IDecisionTree | string[] | string;
      rhs?: Item | iContent | Linkable | IDecisionTree | string[] | string;
    };
    rhs: string;
    lhs: Item | string;
    kind: string;
    path: string[];
  }[];
  approvedAt: string;
  createdAt: string;
}

type PathArray = (string | number)[];
type DiffKind = "D" | "N" | "E" | "A";
type DiffItem = {
  kind: DiffKind;
  lhs?: Item;
  rhs?: Item;
};

type DiffObject = {
  kind: DiffKind;
  path: PathArray;
  index: number;
  item: DiffItem;
  lhs: string | DiffItem;
};

function ApprovalPage() {
  const { data: ebooks } = useEBooks();
  const { data: user } = useFetchProfile();
  const [currentBookID, setCurrentBookID] = useState<string | null>(null);
  const [currentVersion, setCurrentVersion] = useState<string | null>(null);
  const [currentVersionDetails, setCurrentVersionDetails] =
    useState<VersionData | null>(null);
  const [loadingBook, setLoadingBook] = useState(false);
  const [approving, setApproving] = useState(false);
  const [unApproving, setUnApproving] = useState(false);
  const [data, setData] = useState<Data | null>(null);
  const [cummulativeDiff, setCummulativeDiff] = useState([]);

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
        setCurrentVersionDetails(res.data);
        downloadBook(res.data.fileUrl);
      } catch (error) {
        console.log(error);
        setLoadingBook(false);
      }
    }
  };

  const getCurrentBookVersionDifferences = async (
    id: string,
    version: string | null
  ) => {
    const versionID = currentBook.versions.find(
      (v) => v.version.toString() === version
    )?.id;

    if (id && versionID) {
      try {
        const res = await getDifferenceFromLastApproved(
          id,
          versionID.toString()
        );
        setCummulativeDiff(res.data.difference);
      } catch (error) {
        console.log(error);
      }
    }
  };

  function isItem(
    obj: Item | iContent | Linkable | IDecisionTree | string[] | string
  ): obj is Item {
    return obj && typeof obj === "object" && "id" in obj;
  }

  // Function to access id from lhs when it's an Item
  function getItemId(difference: DiffObject): string | null {
    let ID = null;
    if (difference?.kind === "E") {
      ID = difference.lhs as string;
    }
    if (
      difference &&
      difference.item &&
      (isItem(difference?.item?.lhs) || isItem(difference?.item?.rhs))
    ) {
      ID = difference?.item?.lhs?.id || difference?.item?.rhs?.id;
    }
    return ID;
  }

  const downloadBook = async (url) => {
    try {
      const bookData = (await getFile(url)) as Data;
      setData(bookData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingBook(false);
    }
  };

  const flattenBookData: FlattenedObj[] = useMemo(() => {
    return flattenArrayOfObjects(data ? data?.book?.content : []);
  }, [data]);

  const currentVersionID: number | null = useMemo(() => {
    const whichBook = ebooks?.find((b) => b.id === Number(currentBookID));
    const whichID = whichBook
      ? whichBook?.versions.find((v) => v.version === Number(currentVersion))
          ?.id
      : null;
    return whichID;
  }, [ebooks, currentBookID, currentVersion]);

  const approveVersion = async () => {
    setApproving(true);
    try {
      await approveEbook(currentVersionID);
      showToast("Approval successful");
      getCurrentBookVersion(currentBookID, null);
    } catch (error) {
      console.log(error);
    } finally {
      setApproving(false);
    }
  };

  const unApproveVersion = async () => {
    setUnApproving(true);
    try {
      await unApproveEbook(currentVersionID);
      showToast("Un approval successful");
      getCurrentBookVersion(currentBookID, null);
    } catch (error) {
      console.log(error);
    } finally {
      setUnApproving(false);
    }
  };

  function generatePathString(pathArray) {
    const pathMap = {
      book: "Chapter",
      subChapters: "Sub Chapter",
      subSubChapters: "Sub Sub Chapter",
      pages: "Page",
      items: "Item",
    };

    let pathString = "";

    for (let i = 0; i < pathArray.length; i++) {
      const current = pathArray[i];
      const next = pathArray[i + 1]; // Peek at the next value

      if (typeof current === "string" && pathMap[current]) {
        pathString += `${pathMap[current]} `;
      }

      if (typeof current === "string" && typeof next === "number") {
        pathString += `${next + 1}, `;
      }
    }
    // Remove trailing comma and space
    return pathString.trim().replace(/,$/, "");
  }

  const bookDifferences = useMemo(() => {
    return cummulativeDiff?.filter((n) => typeof n.lhs !== "string") || [];
  }, [cummulativeDiff]);

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
              getCurrentBookVersionDifferences(currentBookID, e);
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
        <div className="flex relative">
          <div className="mr-[20px]">
            <RenderBook
              flattenBookData={flattenBookData}
              data={data}
              currentBook={data?.book}
              canEdit={false}
              foldBook={false}
            />
          </div>
          <div className="w-[280px] mt-[40px] fixed right-4 top-8 overflow-hidden h-[80vh]">
            {currentBookID && (
              <div className="flex justify-end gap-2">
                {currentVersionDetails?.status === "PUBLISHED" ? (
                  <Button
                    className="w-fit h-[40px]"
                    onClick={unApproveVersion}
                    disabled={
                      !currentVersion || !hasApprovalAccess || approving
                    }
                    isLoading={unApproving}
                    variant="outline"
                  >
                    {hasApprovalAccess
                      ? "Un-approve"
                      : "You do not have access to approve this book"}
                  </Button>
                ) : (
                  <Button
                    className="w-fit h-[40px]"
                    onClick={approveVersion}
                    disabled={
                      !currentVersion || !hasApprovalAccess || unApproving
                    }
                    isLoading={approving}
                  >
                    {hasApprovalAccess
                      ? "Approve"
                      : "You do not have access to approve this book"}
                  </Button>
                )}
              </div>
            )}

            {!bookDifferences?.length ? (
              <div className="bg-white p-4 shadow-md rounded-sm">
                <p>No difference to show</p>
              </div>
            ) : (
              <>
                <div className="shadow-md rounded-sm absolute top-12 left-0 w-full bg-white p-4 text-[20px] font-semibold">
                  Changes
                </div>
                <div className="h-[70vh] overflow-y-auto w-full mt-[70px]">
                  <Accordion type="single" collapsible className="w-full">
                    {bookDifferences?.map((diff, i) => {
                      return (
                        <AccordionItem key={i} value={`item-${i}`}>
                          <AccordionTrigger className="border border-[#fafafa] bg-white p-3 text-[14px]">
                            <div className="flex justify-between w-full">
                              <div key={i} className="text-left">
                                {generatePathString(diff.path)}
                              </div>

                              <div>
                                <Badge
                                  variant={
                                    diff.kind === "A"
                                      ? "success"
                                      : diff.kind === "E"
                                      ? "pending"
                                      : "failed"
                                  }
                                >
                                  {diff.kind === "A"
                                    ? "Add"
                                    : diff.kind === "E"
                                    ? "Edit"
                                    : "Delete"}
                                </Badge>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="p-2 bg-[#ffffff]">
                            <div>
                              {getItemId(diff) && (
                                <Link href={`?hashId=${getItemId(diff)}`}>
                                  <Button size="sm">Visit element</Button>
                                </Link>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ApprovalPage;
