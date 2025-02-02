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
  getEbookVersion,
  getFile,
  unApproveEbook,
} from "@/utils/book.services";
import {
  Data,
  FlattenedObj,
  iContent,
  IDecisionTree,
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
      lhs: iContent | Linkable | IDecisionTree | string[] | string;
    };
    rhs: string;
    kind: string;
    path: string[];
  }[];
  approvedAt: string;
  createdAt: string;
}
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
  }, [data?.book]);

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
    // console.log(
    //   'pathString.trim().replace(/,$/, "")',
    //   pathString.trim().replace(/,$/, "")
    // );

    // Remove trailing comma and space
    return pathString.trim().replace(/,$/, "");
  }
  // function generateParentIndex(differences) {
  //   const parentIndices = [];

  //   differences.forEach((diff) => {
  //     const path = diff.path;
  //     const parentIndex = [];

  //     // Skip book and content levels
  //     let contentIndex = path.indexOf("content");
  //     if (contentIndex !== -1) {
  //       // Get the chapter index
  //       if (typeof path[contentIndex + 1] === "number") {
  //         parentIndex.push(path[contentIndex + 1]);
  //       }

  //       // Get subchapter index if it exists
  //       let subChapterIndex = path.indexOf("subChapters");
  //       if (
  //         subChapterIndex !== -1 &&
  //         typeof path[subChapterIndex + 1] === "number"
  //       ) {
  //         parentIndex.push(path[subChapterIndex + 1]);
  //       }

  //       // Get page index if it exists
  //       let pageIndex = path.indexOf("pages");
  //       if (pageIndex !== -1 && typeof path[pageIndex + 1] === "number") {
  //         parentIndex.push(path[pageIndex + 1]);
  //       }

  //       // Get item index if it exists
  //       let itemIndex = path.indexOf("items");
  //       if (itemIndex !== -1) {
  //         if (diff.kind === "A") {
  //           parentIndex.push(diff.index);
  //         } else if (typeof path[itemIndex + 1] === "number") {
  //           parentIndex.push(path[itemIndex + 1]);
  //         }
  //       }
  //     }

  //     parentIndices.push({
  //       path: path,
  //       parentIndex: parentIndex,
  //     });
  //   });

  //   return parentIndices;
  // }

  // const differenceIndices = useMemo(() => {
  //   if (currentVersionDetails?.difference) {
  //     return generateParentIndex(currentVersionDetails?.difference);
  //   }
  //   return [];
  // }, [currentVersionDetails?.difference]);
  // console.log(
  //   "currentVersionDetails?.difference",
  //   currentVersionDetails?.difference
  // );
  // console.log("differenceIndices", differenceIndices);

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

            {!currentVersionDetails?.difference?.length ? (
              <div className="bg-white p-4 shadow-md rounded-sm">
                <p>No difference to show</p>
              </div>
            ) : (
              <>
                <div className="shadow-md rounded-sm absolute top-12 left-0 w-full bg-white p-4 text-[20px] font-semibold">
                  Changes
                </div>
                <div className="h-full overflow-y-auto w-full mt-[70px]">
                  <Accordion type="single" collapsible className="w-full">
                    {currentVersionDetails?.difference?.map((diff, i) => {
                      let pathEnding = "";
                      if (diff.kind === "A") {
                        pathEnding += `-${diff.index}`;
                      }
                      const path = [];
                      for (let index = 0; index < diff.path.length; index++) {
                        if (typeof diff.path[index] === "number") {
                          path.push(diff.path[index]);
                        }
                      }

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
                              {/* <PageItems
                            items={[
                              {
                                data: diff?.item?.lhs,
                                parentIndex: [], //path,
                              },
                            ]}
                            data={data}
                            updateElementAtPath={null}
                            elementIndex={null}
                            addNewElement={null}
                            removeElement={null}
                            createNewItem={null}
                          /> */}
                              <Link
                                href={`?hashId=item-${path.join(
                                  "-"
                                )}${pathEnding}`}
                              >
                                <Button size="sm">Visit element</Button>
                              </Link>
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
