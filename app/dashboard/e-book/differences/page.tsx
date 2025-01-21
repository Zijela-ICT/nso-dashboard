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
import { getEbookVersion, getFile } from "@/utils/book.services";
import { Data, FlattenedObj } from "../booktypes";
import RenderBook from "../components/RenderBook";
import { flattenArrayOfObjects } from "../helpers";
import { Loader2 } from "lucide-react";
import { VersionData } from "../approval/page";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge, Button } from "@/components/ui";
// import PageItems from "../components/PageItems";
import Link from "next/link";

function DifferencesPage() {
  const { data: ebooks } = useEBooks();
  const [currentBookID, setCurrentBookID] = useState<string | null>(null);
  const [currentVersion, setCurrentVersion] = useState<string | null>(null);
  const [currentVersionDetails, setCurrentVersionDetails] =
    useState<VersionData | null>(null);
  const [loadingBook, setLoadingBook] = useState(false);
  const [data, setData] = useState<Data | null>(null);
  const [count, setCount] = useState<number>(0);

  const currentBook: IChprbnBook | undefined = useMemo(() => {
    return ebooks?.find((b) => b.id.toString() === currentBookID) || undefined;
  }, [currentBookID, ebooks]);

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
    console.log(
      'pathString.trim().replace(/,$/, "")',
      pathString.trim().replace(/,$/, "")
    );

    // Remove trailing comma and space
    return pathString.trim().replace(/,$/, "");
  }

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
          <div className="mr-[20px]" key={count}>
            <RenderBook
              flattenBookData={flattenBookData}
              data={data}
              currentBook={data?.book}
              canEdit={false}
              foldBook={false}
            />
          </div>
          <div className="w-[280px] mt-[110px] fixed right-4 top-3 overflow-hidden h-[80vh]">
            <div className="absolute top-0 left-0 w-full bg-white p-4">
              Changes
            </div>
            <div className="h-full overflow-y-auto w-full mt-[50px]">
              <Accordion type="single" collapsible className="w-full">
                {currentVersionDetails?.difference.map((diff, i) => {
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
                            href={`?hashId=item-${path.join("-")}${pathEnding}`}
                          >
                            <Button
                              size="sm"
                              onClick={() => setCount(count + 1)}
                            >
                              Visit element
                            </Button>
                          </Link>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DifferencesPage;
