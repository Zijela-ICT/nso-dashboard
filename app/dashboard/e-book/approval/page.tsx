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

type Difference = {
  lhs?: unknown;
  rhs?: unknown;
  kind: string;
  path: (string | number)[];
  index?: number;
  item?: Difference;
};

type EnhancedFlattenedObj = FlattenedObj & {
  variant?: "same" | "addition" | "deletion" | "editted";
  oldValue?: FlattenedObj;
};

function ApprovalPage() {
  const { data: ebooks } = useEBooks();
  const { data: user } = useFetchProfile();
  const [currentBookID, setCurrentBookID] = useState<string | null>(null);
  const [currentVersion, setCurrentVersion] = useState<string | null>(null);
  const [oldContent, setOldContent] = useState<Data | null>(null);
  const [currentVersionDetails, setCurrentVersionDetails] =
    useState<VersionData | null>(null);
  const [loadingBook, setLoadingBook] = useState(false);
  const [approving, setApproving] = useState(false);
  const [unApproving, setUnApproving] = useState(false);
  const [data, setData] = useState<Data | null>(null);
  const [cummulativeDiff, setCummulativeDiff] = useState([]);

  const currentBook: IChprbnBook | undefined = useMemo(() => {
    return ebooks?.find((b) => b.id.toString() === currentBookID) || undefined;
  }, [currentBookID, ebooks]);

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
        // console.log(error);
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
        setOldContent(res.data.oldContent);
      } catch (error) {
        // console.log(error);
      }
    }
  };

  function getItemIdFromPath(
    data: Data,
    path: (string | number)[]
  ): string | null {
    if (!data || !path.length) return null;

    let current: unknown = data;
    let lastObjectWithId: { id: string } | null = null;

    // Traverse the path to find the deepest object with an ID
    for (let i = 0; i < path.length; i++) {
      const key = path[i];
      if (current && typeof current === "object" && current !== null) {
        current = (current as Record<string | number, unknown>)[key];

        // Keep track of objects that have an ID
        if (
          current &&
          typeof current === "object" &&
          current !== null &&
          "id" in current &&
          typeof current.id === "string"
        ) {
          lastObjectWithId = current as { id: string };
        }
      } else {
        break;
      }
    }

    // Return the ID of the last object that had one
    return lastObjectWithId && typeof lastObjectWithId.id === "string"
      ? lastObjectWithId.id
      : null;
  }

  const downloadBook = async (url) => {
    try {
      const bookData = (await getFile(url)) as Data;
      setData(bookData);
    } catch (error) {
      // console.log(error);
    } finally {
      setLoadingBook(false);
    }
  };

  const oldBookData = useMemo(() => {
    return flattenArrayOfObjects(oldContent?.book?.content || []);
  }, [oldContent]);

  const flattenBookData: FlattenedObj[] = useMemo(() => {
    return flattenArrayOfObjects(data ? data?.book?.content : []);
  }, [data]);

  const { repackedItems: compareBooks } = useMemo(() => {
    const currentObj = flattenBookData;
    const oldObj = oldBookData;
    const currentIDs = new Set(currentObj.map((item) => item.id));
    const repackedItems: EnhancedFlattenedObj[] = [];

    // Add all current items with variants
    for (const currentItem of currentObj) {
      const oldItem = oldObj.find((item) => item.id === currentItem.id);
      if (!oldItem) {
        // New item
        repackedItems.push({
          ...currentItem,
          variant: "addition",
        } as EnhancedFlattenedObj);
      } else {
        // Existing item, check if changed
        const hasChanged =
          JSON.stringify(currentItem) !== JSON.stringify(oldItem);
        repackedItems.push({
          ...currentItem,
          variant: hasChanged ? "editted" : "same",
          oldValue: hasChanged ? oldItem : undefined,
        } as EnhancedFlattenedObj);
      }
    }

    // Add deleted items
    for (const oldItem of oldObj) {
      if (!currentIDs.has(oldItem.id)) {
        repackedItems.push({
          ...oldItem,
          variant: "deletion",
        } as EnhancedFlattenedObj);
      }
    }

    // Sort by some order? For now, keep the order from current, then add deletions at end
    // But perhaps sort by id or position
    // For simplicity, keep as is

    return {
      repackedItems,
    };
  }, [flattenBookData, oldBookData]);

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
      // console.log(error);
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
      // console.log(error);
    } finally {
      setUnApproving(false);
    }
  };

  const handleVisit = (id: string, changeText?: string, diff?: Difference) => {
    const element = document.getElementById(id);
    if (element) {
      // Add scroll margin to account for fixed elements
      element.style.scrollMarginTop = "120px";
      element.style.scrollMarginBottom = "20px";

      let targetElement = element;
      let foundSpecificText = false;
      let highlightedTextNode: Text | null = null;

      // If we have specific change text, try to find and highlight the exact text
      if (changeText && typeof changeText === "string" && changeText.trim()) {
        const searchText = changeText.trim();

        // Helper function to highlight text in a text node
        const highlightTextInNode = (
          textNode: Text,
          searchText: string
        ): boolean => {
          const textContent = textNode.textContent || "";
          const index = textContent
            .toLowerCase()
            .indexOf(searchText.toLowerCase());

          if (index !== -1) {
            // Create a span to wrap the highlighted text
            const span = document.createElement("span");
            span.className =
              "bg-red-200 animate-pulse ring-2 ring-red-400 rounded px-1";
            span.style.transition = "all 0.3s ease";

            // Split the text and wrap the matching part
            const beforeText = textContent.substring(0, index);
            const matchText = textContent.substring(
              index,
              index + searchText.length
            );
            const afterText = textContent.substring(index + searchText.length);

            // Create text nodes
            const beforeNode = document.createTextNode(beforeText);
            const afterNode = document.createTextNode(afterText);
            span.textContent = matchText;

            // Replace the original text node
            const parentNode = textNode.parentNode;
            if (parentNode) {
              parentNode.insertBefore(beforeNode, textNode);
              parentNode.insertBefore(span, textNode);
              parentNode.insertBefore(afterNode, textNode);
              parentNode.removeChild(textNode);

              // Store reference for cleanup
              highlightedTextNode = span as unknown as Text;
              targetElement = span;
              return true;
            }
          }
          return false;
        };

        // Walk through all text nodes to find the exact text match
        const walker = document.createTreeWalker(
          element,
          NodeFilter.SHOW_TEXT,
          null
        );

        let node;
        while ((node = walker.nextNode()) && !foundSpecificText) {
          const textNode = node as Text;
          if (textNode.textContent && textNode.textContent.trim()) {
            if (highlightTextInNode(textNode, searchText)) {
              foundSpecificText = true;
              break;
            }
          }
        }

        // Fallback: If no exact text match, try to find the most specific element containing the text
        if (!foundSpecificText) {
          const allElements = element.querySelectorAll("*");
          const elementsWithText = Array.from(allElements).filter((el) => {
            const textContent = el.textContent?.trim();
            return (
              textContent &&
              textContent.toLowerCase().includes(searchText.toLowerCase())
            );
          });

          // Find the most specific element (smallest one containing the text)
          let bestMatch = null;
          let shortestLength = Infinity;

          elementsWithText.forEach((el) => {
            const textContent = el.textContent?.trim() || "";
            if (
              textContent.length < shortestLength &&
              textContent.toLowerCase().includes(searchText.toLowerCase())
            ) {
              bestMatch = el;
              shortestLength = textContent.length;
            }
          });

          if (bestMatch) {
            targetElement = bestMatch as HTMLElement;
            foundSpecificText = true;
          }
        }

        // Method 3: If still no specific match, try to find elements by attribute matching
        if (!foundSpecificText && diff) {
          const pathParts = diff.path;
          const lastPathPart = pathParts[pathParts.length - 1];

          // Build selector safely - avoid using numbers as class names
          const selectors = [
            `[data-field="${lastPathPart}"]`,
            `[data-key="${lastPathPart}"]`,
          ];

          // Only add class selector if lastPathPart is a valid CSS identifier (not starting with number)
          if (typeof lastPathPart === "string" && !/^\d/.test(lastPathPart)) {
            selectors.push(`.${lastPathPart}`);
          }

          const candidates = element.querySelectorAll(selectors.join(", "));
          if (candidates.length > 0) {
            targetElement = candidates[0] as HTMLElement;
            foundSpecificText = true;
          }
        }
      }

      // Scroll to the target element
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });

      // Only add highlighting if we didn't already highlight specific text
      if (!highlightedTextNode && !foundSpecificText) {
        const highlightClasses = [
          "bg-yellow-200",
          "animate-pulse",
          "ring-2",
          "ring-yellow-400",
        ];
        targetElement.classList.add(...highlightClasses);

        // Remove highlight after animation
        setTimeout(() => {
          targetElement.classList.remove(...highlightClasses);
          element.style.scrollMarginTop = "";
          element.style.scrollMarginBottom = "";
        }, 3000);
      } else if (highlightedTextNode) {
        // Remove text highlight after animation
        setTimeout(() => {
          if (highlightedTextNode && highlightedTextNode.parentNode) {
            const parent = highlightedTextNode.parentNode;
            const textContent = highlightedTextNode.textContent || "";
            const textNode = document.createTextNode(textContent);
            parent.replaceChild(textNode, highlightedTextNode);
            parent.normalize(); // Merge adjacent text nodes
          }
          element.style.scrollMarginTop = "";
          element.style.scrollMarginBottom = "";
        }, 3000);
      }

      // Log for debugging
      // console.log("Visited element:", {
      //   id,
      //   changeText,
      //   foundSpecificText,
      //   highlightedText: !!highlightedTextNode,
      //   targetElement: targetElement.tagName,
      //   targetContent: targetElement.textContent?.substring(0, 100),
      // });
    } else {
      console.warn(`Element with id ${id} not found`);
    }
  };

  function generatePathString(
    pathArray: (string | number)[],
    primaryData?: Data | null,
    fallbackData?: Data | null
  ) {
    const labelMap: Record<string, string> = {
      // common keys
      book: "Section",
      section: "Section",
      sections: "Section",
      chapter: "Chapter",
      chapters: "Chapter",
      content: "Section",
      references: "References",
      appendices: "Appendices",
      subChapters: "Sub Chapter",
      subChapter: "Sub Chapter",
      subSections: "Sub Section",
      subsections: "Sub Section",
      subSubChapters: "Sub Sub Chapter",
      pages: "Page",
      page: "Page",
      items: "Item",
      item: "Item",
      title: "Title",
      heading: "Heading",
    };

    const titleKeys = [
      "title",
      "name",
      "sectionTitle",
      "heading",
      "label",
      // From booktypes
      "chapter",
      "subChapterTitle",
      "subSubChapterTitle",
      "pageTitle",
      "bookTitle",
    ] as const;
    const titleKeySet = new Set<string>(titleKeys as unknown as string[]);

    // Debug logging to understand the paths

    // Helper to safely get nested value by key on unknown object
    const getKey = (obj: unknown, key: string | number): unknown => {
      if (obj && typeof obj === "object" && obj !== null) {
        return (obj as Record<string | number, unknown>)[key];
      }
      return undefined;
    };

    // Try to find a human label (title/name/...) for the current location from one or two data sources
    const findTitleForIndex = (
      container: unknown,
      index: number
    ): string | null => {
      const candidate: unknown = Array.isArray(container)
        ? container[index]
        : undefined;
      for (const dataSource of [candidate]) {
        if (dataSource && typeof dataSource === "object") {
          for (const k of titleKeys) {
            const v = (dataSource as Record<string, unknown>)[k];
            if (typeof v === "string" && v.trim()) return v.trim();
          }
        }
      }
      return null;
    };

    const tryGetFromData = (dataObj: Data | null | undefined): string[] => {
      const parts: string[] = [];
      let cursor: unknown = dataObj as unknown;
      for (let i = 0; i < pathArray.length; i++) {
        const seg = pathArray[i];
        const next = pathArray[i + 1];

        if (typeof seg === "string") {
          // advance cursor
          const label =
            labelMap[seg] || seg.charAt(0).toUpperCase() + seg.slice(1);
          const container = getKey(cursor, seg);

          if (typeof next === "number") {
            // try to read the item at index and use its title if available
            const title = findTitleForIndex(container, next);
            if (title) {
              parts.push(title);
            } else {
              parts.push(`${label} ${next + 1}`);
            }
            // move cursor to that indexed child and skip the index in the loop
            cursor = Array.isArray(container) ? container[next] : undefined;
            i++;
          } else {
            // If seg itself is a title-bearing key, prefer its string value
            if (titleKeySet.has(seg) && typeof container === "string") {
              const str = (container as string).trim();
              if (str) parts.push(str);
              else parts.push(label);
            } else {
              // no index follows, just add the label
              parts.push(label);
            }
            // move into that child/container when it is object-like; otherwise keep cursor
            cursor = container;
          }
        } else if (typeof seg === "number") {
          // standalone number without preceding key
          const title = findTitleForIndex(cursor, seg);
          parts.push(title || `#${seg + 1}`);
          cursor = Array.isArray(cursor) ? cursor[seg] : undefined;
        }
      }
      return parts;
    };

    // Build from primary data first
    let parts = tryGetFromData(primaryData);
    // If result is too generic (only labels, no titles), try fallback data
    const hasSpecificTitles = parts.some(
      (p) =>
        !/^(Section|Chapter|Sub Chapter|Sub Section|Sub Sub Chapter|Content|Page|Item|Heading|Title)(\s+\d+)?$/.test(
          p
        )
    );
    if (!hasSpecificTitles && fallbackData) {
      const fallbackParts = tryGetFromData(fallbackData);
      const fallbackHasTitles = fallbackParts.some(
        (p) =>
          !/^(Section|Chapter|Sub Chapter|Sub Section|Sub Sub Chapter|Content|Page|Item|Heading|Title)(\s+\d+)?$/.test(
            p
          )
      );
      if (fallbackHasTitles) parts = fallbackParts;
    }

    const result = (parts.length ? parts : ["Unknown Section"]).join(" > ");
    return result;
  }

  const bookDifferences = useMemo(() => {
    const filtered =
      cummulativeDiff?.filter((n) => {
        const path = n.path;
        const shouldInclude = path[path.length - 1] !== "id";

        if (!shouldInclude) {
        }

        return shouldInclude;
      }) || [];

    return filtered;
  }, [cummulativeDiff]);

  const currentVersions = useMemo(() => {
    return (
      currentBook?.versions?.sort((a, b) => {
        return a.version === b.version ? 0 : a.version > b.version ? -1 : 1;
      }) || []
    );
  }, [currentBook]);

  // Note: To match the exact display of ebook/[id], we render the plain
  // flattenBookData (without diff variants). Keeping the diff data only for
  // the sidebar list.

  function getChangeDescription(diff: Difference): string {
    // The diff library compares old vs new, so:
    // lhs = new value, rhs = old value
    // "D" means deleted (exists in old, not in new)
    // "N" means new (exists in new, not in old)
    // For array changes, the logic is inverted:
    // item.kind "D" means added to array, "N" means removed from array

    switch (diff.kind) {
      case "E":
        return "edit";
      case "D":
        return "deletion"; // D means deleted from old version
      case "N":
        return "addition"; // N means added to new version
      case "A":
        if (diff.item) {
          // For array changes, logic is inverted
          const itemKind = diff.item.kind;
          if (itemKind === "D") return "addition"; // D in array means added
          if (itemKind === "N") return "deletion"; // N in array means removed
          if (itemKind === "E") return "edit";
        }
        return "modification";
      default:
        return "unknown";
    }
  }

  // Pretty-print a value for diff display
  const formatValue = (val: unknown): string => {
    try {
      if (val === null || val === undefined) return String(val);
      if (typeof val === "string") return val;
      return JSON.stringify(val, null, 2);
    } catch {
      return String(val);
    }
  };

  // Helper function to extract meaningful text from any value
  const extractTextFromValue = (value: unknown): string => {
    if (typeof value === "string") {
      return value;
    }
    if (value && typeof value === "object" && value !== null) {
      const obj = value as Record<string, unknown>;

      // Try common text properties first
      for (const key of [
        "chapter", // Add chapter first for chapter objects
        "text",
        "content",
        "title",
        "value",
        "name",
        "label",
      ]) {
        if (key in obj && typeof obj[key] === "string") {
          return obj[key] as string;
        }
      }

      // For chapter objects, try to get text from pages
      if ("pages" in obj && Array.isArray(obj.pages)) {
        for (const page of obj.pages) {
          if (
            page &&
            typeof page === "object" &&
            "items" in page &&
            Array.isArray(page.items)
          ) {
            for (const item of page.items) {
              if (item && typeof item === "object") {
                // Try to get text from page items
                for (const textKey of ["content", "text", "value"]) {
                  if (textKey in item && typeof item[textKey] === "string") {
                    return item[textKey] as string;
                  }
                }
              }
            }
          }
        }
      }
    }
    return String(value);
  };

  const renderChangeDetails = (diff: Difference) => {
    switch (diff.kind) {
      case "E":
        return (
          <>
            <p className="p-2 mb-0">
              Old:{" "}
              <span className="font-semibold">{formatValue(diff.rhs)}</span>
            </p>
            <p className="p-2">
              New:{" "}
              <span className="font-semibold">{formatValue(diff.lhs)}</span>
            </p>
          </>
        );
      case "N":
        // Check if this is an array removal (has rhs but no lhs) or regular addition (has lhs)
        if (diff.rhs !== undefined && diff.lhs === undefined) {
          return (
            <>
              <p className="p-2 mb-0">
                Removed from array:{" "}
                <span className="font-semibold">{formatValue(diff.rhs)}</span>
              </p>
            </>
          );
        } else {
          return (
            <>
              <p className="p-2 mb-0">
                Added Value:{" "}
                <span className="font-semibold">{formatValue(diff.lhs)}</span>
              </p>
            </>
          );
        }
      case "D":
        // Check if this is an array addition (has lhs but no rhs) or regular deletion (has rhs)
        if (diff.lhs !== undefined && diff.rhs === undefined) {
          return (
            <>
              <p className="p-2 mb-0">
                Added to array:{" "}
                <span className="font-semibold">{formatValue(diff.lhs)}</span>
              </p>
            </>
          );
        } else {
          return (
            <>
              <p className="p-2 mb-0">
                Removed Value:{" "}
                <span className="font-semibold">{formatValue(diff.rhs)}</span>
              </p>
            </>
          );
        }
      case "A":
        // Array change: show nested item info if available
        return (
          <>
            <p className="p-2 mb-0">Array modification</p>
            {diff.item && (
              <div className="p-2">
                <p className="mb-1 text-xs text-gray-500">Nested change:</p>
                {renderChangeDetails(diff.item)}
              </div>
            )}
          </>
        );
      default:
        return null;
    }
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
              getCurrentBookVersionDifferences(currentBookID, e);
            }}
            disabled={!currentBookID}
          >
            <SelectTrigger value={null} className="w-[180px]">
              <SelectValue placeholder="Select version" />
            </SelectTrigger>
            <SelectContent>
              {currentVersions.map((version, i) => (
                <SelectItem value={version.version.toString()} key={i}>
                  version {version.version}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {!currentBookID || !currentVersion ? (
        <div className="mt-[50px] p-6 text-center bg-white rounded-lg">
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
              bookInfo={currentBook}
              foldBook={false}
            />
          </div>
          <div className="w-[280px] mt-[40px] fixed right-4 top-8 overflow-hidden h-[80vh]">
            {currentBookID && (
              <div className="flex justify-end gap-2 mb-4">
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
              <div className="bg-white p-4 shadow-md rounded-sm w-full">
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
                      const diffText = getChangeDescription(diff);

                      // For array changes, get the ID from the nested item
                      let id = null;
                      if (diff.kind === "A" && diff.item) {
                        // Array addition/deletion - get ID from the item itself
                        const item = diff.item.lhs || diff.item.rhs;
                        if (item && typeof item === "object" && "id" in item) {
                          // For chapters, try to get the first content item ID instead of chapter ID
                          if ("pages" in item && Array.isArray(item.pages)) {
                            const firstPage = item.pages[0];
                            if (
                              firstPage &&
                              "items" in firstPage &&
                              Array.isArray(firstPage.items)
                            ) {
                              const firstItem = firstPage.items[0];
                              if (
                                firstItem &&
                                typeof firstItem === "object" &&
                                "id" in firstItem
                              ) {
                                // Use the content item ID for better navigation
                                id = firstItem.id;
                              } else {
                                // Fallback to chapter ID
                                id = item.id;
                              }
                            } else {
                              id = item.id;
                            }
                          } else {
                            id = item.id;
                          }
                        }
                      } else {
                        // Regular changes - get ID from path
                        id = getItemIdFromPath(data, diff.path);
                      }

                      const href = id ? `#${id}` : "";
                      return (
                        <AccordionItem
                          key={i}
                          value={`item-${i}`}
                          className="w-full"
                        >
                          <AccordionTrigger className="border border-[#fafafa] bg-white p-3 text-[14px] w-full hover:no-underline">
                            <div className="flex justify-between w-full items-start">
                              <div className="text-left flex-1 min-w-0 pr-2">
                                <div className="truncate">
                                  {(() => {
                                    // For array changes, show the actual item title instead of generic path
                                    if (diff.kind === "A" && diff.item) {
                                      const item =
                                        diff.item.lhs || diff.item.rhs;
                                      if (item && typeof item === "object") {
                                        // Try to get a meaningful title from the item
                                        const titleKeys = [
                                          "chapter",
                                          "title",
                                          "name",
                                          "sectionTitle",
                                          "heading",
                                          "label",
                                        ];
                                        for (const key of titleKeys) {
                                          if (
                                            key in item &&
                                            typeof item[key] === "string" &&
                                            item[key].trim()
                                          ) {
                                            return item[key];
                                          }
                                        }
                                      }
                                    }
                                    // Fallback to path string
                                    return generatePathString(
                                      diff.path,
                                      data,
                                      oldContent
                                    );
                                  })()}
                                </div>
                                <div className="text-xs text-gray-500 mt-1 truncate">
                                  {diff.kind === "E"
                                    ? `Changed to "${formatValue(diff.lhs)}"`
                                    : diff.kind === "N"
                                    ? diff.rhs !== undefined &&
                                      diff.lhs === undefined
                                      ? `Removed from array "${formatValue(
                                          diff.rhs
                                        )}"`
                                      : `Added "${formatValue(diff.lhs)}"`
                                    : diff.kind === "D"
                                    ? diff.lhs !== undefined &&
                                      diff.rhs === undefined
                                      ? `Added to array "${formatValue(
                                          diff.lhs
                                        )}"`
                                      : `Removed "${formatValue(diff.rhs)}"`
                                    : diff.kind === "A" && diff.item
                                    ? (() => {
                                        const changeType =
                                          getChangeDescription(diff);
                                        const item =
                                          diff.item.lhs || diff.item.rhs;
                                        if (item && typeof item === "object") {
                                          const titleKeys = [
                                            "chapter",
                                            "title",
                                            "name",
                                            "content",
                                            "text",
                                          ];
                                          for (const key of titleKeys) {
                                            if (
                                              key in item &&
                                              typeof item[key] === "string" &&
                                              item[key].trim()
                                            ) {
                                              return `${
                                                changeType === "addition"
                                                  ? "Added"
                                                  : changeType === "deletion"
                                                  ? "Removed"
                                                  : "Modified"
                                              } "${item[key].substring(0, 50)}${
                                                item[key].length > 50
                                                  ? "..."
                                                  : ""
                                              }"`;
                                            }
                                          }
                                        }
                                        return `Array ${changeType}`;
                                      })()
                                    : "Modified"}
                                </div>
                              </div>
                              <div className="flex-shrink-0">
                                <Badge
                                  variant={
                                    diffText === "addition"
                                      ? "success"
                                      : diffText === "edit"
                                      ? "pending"
                                      : "failed"
                                  }
                                  className="uppercase text-xs"
                                >
                                  {diffText}
                                </Badge>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="p-2 bg-[#ffffff] w-full">
                            <div className="w-full">
                              {renderChangeDetails(diff)}
                              {href && (
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    // Get the text content based on the type of change
                                    let changeText = "";
                                    let searchInCurrentBook = true;

                                    if (diff.kind === "E") {
                                      // For edits, use the new value (lhs) - this is what was changed TO
                                      changeText = extractTextFromValue(
                                        diff.lhs
                                      );
                                      searchInCurrentBook = true; // Search in current book
                                    } else if (diff.kind === "N") {
                                      // For additions, use the new value (lhs) - this is what was added
                                      changeText = extractTextFromValue(
                                        diff.lhs
                                      );
                                      searchInCurrentBook = true; // Search in current book
                                    } else if (diff.kind === "D") {
                                      // For deletions, use the old value (rhs) - this is what was removed
                                      changeText = extractTextFromValue(
                                        diff.rhs
                                      );
                                      searchInCurrentBook = false; // Search in old book (but since it's deleted, we'll search current)
                                    } else if (diff.kind === "A" && diff.item) {
                                      // For array changes, determine based on nested item
                                      if (diff.item.kind === "N") {
                                        // Array removal: use the removed value (rhs)
                                        changeText = extractTextFromValue(
                                          diff.item.rhs
                                        );
                                        searchInCurrentBook = false;
                                      } else if (diff.item.kind === "D") {
                                        // Array addition: use the added value (lhs)
                                        changeText = extractTextFromValue(
                                          diff.item.lhs
                                        );
                                        searchInCurrentBook = true;
                                      } else if (diff.item.kind === "E") {
                                        // Array edit: use the new value (lhs)
                                        changeText = extractTextFromValue(
                                          diff.item.lhs
                                        );
                                        searchInCurrentBook = true;
                                      }
                                    }

                                    // Clean up the change text
                                    changeText = changeText
                                      .replace(/^["']|["']$/g, "")
                                      .trim();

                                    // console.log("Navigating to change:", {
                                    //   kind: diff.kind,
                                    //   path: diff.path,
                                    //   changeText,
                                    //   searchInCurrentBook,
                                    //   id,
                                    // });

                                    handleVisit(id, changeText, diff);
                                  }}
                                  className="mt-2"
                                >
                                  Visit element
                                </Button>
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
