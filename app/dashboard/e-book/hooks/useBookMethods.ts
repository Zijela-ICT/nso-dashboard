import { InfographicData } from "../components/AddInfographicModal";
import {
  createNewItem,
  createNewPageData,
  flattenArrayOfObjects,
  generateTablesFromDecisionTree,
  handleCreateNewElement,
  unflattenArrayOfObjects,
} from "../helpers";
import {
  Data,
  iPosition,
  iTargetElements,
  Chapter,
  Page,
  SubChapter,
  SubSubChapter,
  FlattenedObj,
  PageItemType,
  TableData,
  Linkable,
  IDecisionTree,
  Space,
  ItemTypes,
  Item,
} from "../booktypes";
import axios from "axios";
import dayjs from "dayjs";
import { saveAs } from "file-saver";
import { useEffect, useMemo, useState } from "react";
import { getEbookVersion, getFile, updateEbooks } from "@/utils/book.services";
import useEBooks from "./useEBooks";
import { useParams } from "next/navigation";
import { showToast } from "@/utils/toast";
import { useBookContext } from "../context/bookContext";

function isChapter(
  item: Chapter | Page | SubChapter | SubSubChapter
): item is Chapter {
  return "chapter" in item && "subChapters" in item;
}

function isSubChapter(
  item: Chapter | Page | SubChapter | SubSubChapter
): item is SubChapter {
  return "subChapterTitle" in item && "subSubChapters" in item;
}

function isSubSubChapter(
  item: Chapter | Page | SubChapter | SubSubChapter
): item is SubSubChapter {
  return "subSubChapterTitle" in item && "pages" in item;
}

function isPage(
  item: Chapter | Page | SubChapter | SubSubChapter
): item is Page {
  return "pageTitle" in item && "items" in item;
}

const useBookMethods = () => {
  const { setSavingBook, setIsEditting } = useBookContext();
  const { data: ebooks, mutation, refetch: getEbooks, isLoading } = useEBooks();
  const params = useParams<{ id: string }>();
  const filename = "/sample-book.json";
  const [bookVersion, setBookVersion] = useState<string>("");
  const [data, setData] = useState<Data | null>(null);
  const [tableHasHeader, setTableHasHeader] = useState<boolean>(true);
  const [selectedLocale, setSelectedLocale] = useState<string>("en");
  const [showTableModal, setShowTableModal] = useState<boolean>(false);
  const [showPageDropdown, setShowPageDropdown] = useState<boolean>(false);
  const [fetchingVersion, setFetchingVersion] = useState<boolean>(false);
  const [edittingStack, setEdittingStack] = useState<Array<iTargetElements>>(
    []
  );
  const [showDecisionTreeModal, setShowDecisionTreeModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [hoverElement, setHoverElement] = useState<HTMLElement | null>(null);
  const [plusPosition, setPlusPosition] = useState<iPosition | null>(null);
  const [showInfographicModal, setShowInfographicModal] =
    useState<boolean>(false);
  const [showLinkableModal, setShowLinkableModal] = useState<boolean>(false);

  const handleFileUpload = async (file: File | undefined) => {
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const jsonData = JSON.parse(event.target?.result as string);
      setData(jsonData); // Set the uploaded data
    };
    reader.readAsText(file);
  };

  const getBook = async () => {
    try {
      const response = await axios.get(filename);
      const fetchedData = response.data;
      setData(fetchedData);
    } catch (err) {
      console.log(err);
      showToast(
        "Failed to load the book. Please check the console for more details.",
        "error"
      );
    }
  };

  const handleLocaleChange = (locale: string) => {
    setSelectedLocale(locale);
  };

  const setBookTitle = (e: string) => {
    setData({
      ...data,
      book: {
        ...data.book,
        bookTitle: e,
      },
    });
  };

  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    setHoverElement(target);
    setPlusPosition({
      x: rect.right + window.scrollX,
      y: rect.top + window.scrollY,
    });
    // timeout && clearTimeout(timeout);
  };

  const handleTableModalClose = () => {
    setShowTableModal(false);
  };

  const handleEditStart = (event: React.MouseEvent<iTargetElements>) => {
    const target = event.target as iTargetElements;
    const newStack = [...edittingStack, target];
    setEdittingStack(newStack);
  };

  const handleEditSave = async () => {
    let blob: Blob;
    edittingStack.map(async (element) => {
      if (element) {
        const updatedData = { ...data };
        const text_path = element.getAttribute("data-text_path");

        if (text_path && data) {
          data.locales[selectedLocale][text_path] = element.textContent;

          const jsonData = JSON.stringify(updatedData, null, 2);
          blob = new Blob([jsonData], { type: "application/json" });
        }
      }
      saveAs(blob, "public/childhood-illness-default-rtdb-export-updated.json");
    });
  };

  const addNewPageElement = (
    type: PageItemType,
    pageToBeUpdatedIndices: number[]
  ) => {
    if (!data) return;

    const updatedData = { ...data };
    const [chapterIndex, subChapterIndex, subSubIndex, pageIndex] =
      pageToBeUpdatedIndices || [];
    // const newItemKey = `${type}_${Date.now()}`;
    let keys: string[] = [];

    if (type === PageItemType.Chapter) {
      keys = [
        "chapter title",
        "sub chapter title",
        "sub sub chapter title",
        "new page title",
      ];
      const newElement = createNewPageData(type, keys);
      if (isChapter(newElement) && pageToBeUpdatedIndices.length) {
        updatedData.book.content.splice(chapterIndex + 1, 0, newElement);
      }
      if (isChapter(newElement) && !pageToBeUpdatedIndices.length) {
        updatedData.book.content.push(newElement);
      }
    } else if (type === PageItemType.SubChapter) {
      keys = ["sub chapter title", "sub sub chapter title", "new page title"];
      const newElement = createNewPageData(type, keys);

      if (isSubChapter(newElement)) {
        updatedData.book.content[chapterIndex].subChapters.splice(
          subChapterIndex + 1,
          0,
          newElement
        );
      }
    } else if (type === PageItemType.SubSubChapter) {
      keys = ["sub sub title", "new page title"];
      const newElement = createNewPageData(type, keys);

      if (
        !updatedData.book.content[chapterIndex].subChapters[subChapterIndex] &&
        !updatedData.book.content[chapterIndex].subChapters[subChapterIndex]
          ?.subSubChapters
      ) {
        // updatedData.book.content[chapterIndex].subChapters[subChapterIndex] = {
        //   subChapterTitle: "",
        //   pages: [],
        //   subSubChapters: [],
        // };
        updatedData.book.content[chapterIndex].subChapters[
          subChapterIndex
        ].subSubChapters = [];
      }
      if (isSubSubChapter(newElement)) {
        updatedData.book.content[chapterIndex].subChapters[
          subChapterIndex
        ].subSubChapters.push(newElement);
      }
    } else if (type === PageItemType.Page) {
      keys = ["new page title"];
      const newElement = createNewPageData(type, keys);

      if (isPage(newElement)) {
        if (typeof subSubIndex !== "undefined") {
          // Add page to subSubChapter
          updatedData.book.content[chapterIndex]?.subChapters[
            subChapterIndex
          ]?.subSubChapters[subSubIndex]?.pages.splice(
            pageIndex + 1 || 1,
            0,
            newElement
          );
        }
      }
    }

    setData(updatedData);
    setShowPageDropdown(false);
  };

  const addNewElement = (
    type: ItemTypes,
    createData?: InfographicData | TableData | Linkable | IDecisionTree | Space,
    element_Index?: number,
    isHeader?: boolean,
    returnData?: boolean
  ) => {
    const updatedData = { ...data };
    const unflattendContent = handleCreateNewElement(
      type,
      createData,
      element_Index,
      isHeader,
      updatedData,
      "un_flat"
    );

    if (returnData) {
      return unflattendContent;
    }
    updatedData.book.content = unflattendContent as Chapter[];
    setData(updatedData);
    setShowDropdown(false);
    setShowInfographicModal(false);
    setShowLinkableModal(false);
    setShowInfographicModal(false);
    setShowTableModal(false);
  };

  const updateElementAtPath = (payload, elementPosition) => {
    const updatedData = { ...data };
    const flattenedArr = flattenArrayOfObjects(updatedData.book.content);
    const updatedFlattenedArr = [...flattenedArr];

    updatedFlattenedArr[elementPosition] = {
      ...updatedFlattenedArr[elementPosition],
      data: payload,
    };
    if (typeof payload === "object" && payload?.type === "decision") {
      const { upperTable, lowerTable } = generateTablesFromDecisionTree(
        payload as IDecisionTree
      );
      updatedFlattenedArr[elementPosition + 1] = {
        ...updatedFlattenedArr[elementPosition + 1],
        data: upperTable,
        forDecisionTree: true,
      };

      updatedFlattenedArr[elementPosition + 2] = {
        ...updatedFlattenedArr[elementPosition + 2],
        data: lowerTable,
        forDecisionTree: true,
      };
      updatedFlattenedArr[elementPosition + 3] = {
        ...updatedFlattenedArr[elementPosition + 3],
        data: {
          type: "heading2",
          content: "Health Education",
          forDecisionTree: true,
        },
        forDecisionTree: true,
      };
      updatedFlattenedArr[elementPosition + 4] = {
        ...updatedFlattenedArr[elementPosition + 4],
        data: {
          type: "orderedList",
          items: payload?.healthEducation,
          forDecisionTree: true,
        },
      };
    }
    const unflattendContent = unflattenArrayOfObjects([...updatedFlattenedArr]);
    updatedData.book.content = unflattendContent;
    setData(updatedData);
  };

  const fixDecisionTree = (createData: IDecisionTree, elementIndex: number) => {
    const updatedData = { ...data };
    let updatedFlattenedArr: FlattenedObj[] = flattenArrayOfObjects(
      updatedData.book.content
    );
    const itemAtIndex = updatedFlattenedArr[elementIndex];
    const path = itemAtIndex.parentIndex;

    updatedFlattenedArr = updatedFlattenedArr.map((item) => {
      const currentPath = item.parentIndex;
      if (
        currentPath.length === path.length &&
        currentPath.slice(0, -1).every((val, i) => val === path[i]) &&
        currentPath[currentPath.length - 1] > path[path.length - 1] &&
        typeof item.data !== "string"
      ) {
        return {
          ...item,
          parentIndex: [
            ...currentPath.slice(0, -1),
            currentPath[currentPath.length - 1] + 4,
          ],
        };
      }
      return item;
    });

    const newPath2 = [...path.slice(0, -1), path[path.length - 1] + 1];
    const newPath3 = [...path.slice(0, -1), path[path.length - 1] + 2];
    const newPath4 = [...path.slice(0, -1), path[path.length - 1] + 3];
    const newPath5 = [...path.slice(0, -1), path[path.length - 1] + 4];
    const { upperTable, lowerTable } = generateTablesFromDecisionTree(
      createData as IDecisionTree
    );

    updatedFlattenedArr.splice(elementIndex + 1, 0, {
      data: createNewItem("table", "new table", upperTable),
      parentIndex: newPath2,
    });
    updatedFlattenedArr.splice(elementIndex + 2, 0, {
      data: createNewItem("table", "new table", lowerTable),
      parentIndex: newPath3,
    });
    updatedFlattenedArr.splice(elementIndex + 3, 0, {
      data: {
        type: "heading2",
        content: "Health Education",
        forDecisionTree: true,
      },
      parentIndex: newPath4,
    });
    updatedFlattenedArr.splice(elementIndex + 4, 0, {
      data: createNewItem("orderedList", "", createData.healthEducation, true),
      parentIndex: newPath5,
    });

    const unflattenArray = unflattenArrayOfObjects(updatedFlattenedArr);
    updatedData.book.content = unflattenArray;
    setData(updatedData);
  };

  const removeElement = (element_index?: number) => {
    const updatedData = { ...data };
    const flattenedArr = flattenArrayOfObjects(updatedData.book.content);
    const elementIndex = element_index;
    const elementAtIndex = flattenedArr[element_index].data as Item;
    if (elementIndex < 0) return;

    const path =
      elementAtIndex.type === "decision"
        ? []
        : flattenedArr[elementIndex].parentIndex;

    const [chapterIndex, ...rest] = path;

    switch (path.length) {
      case 0:
        flattenedArr.splice(elementIndex, 5);
        updatedData.book.content = unflattenArrayOfObjects(flattenedArr);
        break;
      case 1:
        updatedData.book.content.splice(chapterIndex, 1);
        break;

      case 2:
        if (typeof flattenedArr[elementIndex].data === "string") {
          updatedData.book.content[chapterIndex].subChapters.splice(rest[0], 1);
        } else {
          // updatedData.book.content[chapterIndex].pages.splice(rest[0], 1);
          updatedData.book.content = unflattenArrayOfObjects(
            flattenedArr.filter((_, n) => n !== elementIndex)
          );
        }
        break;

      case 3:
        {
          // Remove subChapter or its page
          // const subChapter =
          //   updatedData.book.content[chapterIndex].subChapters[rest[0]];
          if (typeof flattenedArr[elementIndex].data === "string") {
            // Remove entire subChapter
            updatedData.book.content[chapterIndex].subChapters[
              rest[0]
            ].subSubChapters.splice(rest[1], 1);
          } else {
            // Remove subChapter page
            // subChapter.pages.splice(rest[2], 1);
            updatedData.book.content = unflattenArrayOfObjects(
              flattenedArr.filter((_, n) => n !== elementIndex)
            );
          }
        }
        break;

      case 4:
        {
          // Remove subSubChapter page title or entire page
          const targetSubChapter =
            updatedData.book.content[chapterIndex].subChapters[rest[0]];
          targetSubChapter.subSubChapters[rest[1]].pages.splice(rest[2], 1);
        }
        break;

      case 5:
        {
          // Remove page item
          const subSubChapter =
            updatedData.book.content[chapterIndex].subChapters[rest[0]]
              .subSubChapters[rest[1]];
          const page = subSubChapter.pages[rest[2]];
          page.items.splice(rest[3], 1);

          // Remove page if it has no more items
          if (page.items.length === 0) {
            subSubChapter.pages.splice(rest[2], 1);
          }
        }
        break;
    }

    setData(updatedData);
    setShowDropdown(false);
    setHoverElement(null);
  };

  const handleInfographicModalClose = () => {
    setShowInfographicModal(false);
  };

  const { book, locales } = useMemo(() => data, [data]) || {};

  const flattenBookData: FlattenedObj[] = useMemo(() => {
    return flattenArrayOfObjects(data ? book?.content : [])?.filter(
      (n) => n.data
    );
  }, [book?.content, data]);

  const exportToJson = () => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.book.bookTitle} - ${dayjs().format(
      "DD MMM YYYY: mm:a h"
    )}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  function convertBlobToFile(blob, fileName) {
    const file = new File([blob], fileName, { type: "application/json" }); // Create a File object
    return file;
  }

  const saveBookUpdates = async (fileName, id) => {
    setSavingBook(true);
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const file = convertBlobToFile(blob, fileName);
    const form = new FormData();
    form.append("file", file);
    try {
      await updateEbooks(form, id);
      getEbooks();
      showToast("book updated successfully");
      setIsEditting(false);
    } catch (error) {
      console.log(error);
    } finally {
      setSavingBook(false);
    }
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
      completeCreation(jsonFile as File);
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

  const completeCreation = async (file: File) => {
    const form = new FormData();
    form.append("bookType", params.id.toUpperCase());
    form.append("file", file);
    mutation.mutate(form, {
      onSuccess: () => {
        showToast("Book created successfully", "success");
      },
    });
  };

  const currentBook = useMemo(() => {
    return ebooks?.find(
      (book) => book.bookType.toUpperCase() === params.id.toUpperCase()
    );
  }, [params.id, ebooks]);

  const getCurrentBookVersion = async (version: string = "") => {
    try {
      setFetchingVersion(true);
      const res = await getEbookVersion(currentBook.id, version);
      downloadBook(res.data.fileUrl);
      setBookVersion(
        version ||
          currentBook.versions[
            currentBook.versions.length - 1
          ].version.toString()
      );
    } catch (error) {
      console.log(error);
    } finally {
      setFetchingVersion(false);
    }
  };

  const downloadBook = async (url) => {
    try {
      const bookData = (await getFile(url)) as Data;
      setData(bookData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (currentBook?.versions?.length) {
      getCurrentBookVersion();
    }
  }, [currentBook, currentBook?.versions?.length]);

  return {
    handleFileUpload,
    handleLocaleChange,
    handleMouseEnter,
    handleTableModalClose,
    handleEditStart,
    addNewPageElement,
    addNewElement,
    removeElement,
    handleInfographicModalClose,
    flattenBookData,
    locales,
    setTableHasHeader,
    showTableModal,
    plusPosition,
    showInfographicModal,
    data,
    setShowDropdown,
    setShowInfographicModal,
    showLinkableModal,
    setShowLinkableModal,
    selectedLocale,
    book,
    showDropdown,
    showPageDropdown,
    hoverElement,
    tableHasHeader,
    handleEditSave,
    setShowTableModal,
    setShowPageDropdown,
    exportToJson,
    showDecisionTreeModal,
    setShowDecisionTreeModal,
    setHoverElement,
    getBook,
    updateElementAtPath,
    createNewItem,
    setBookTitle,
    saveBookUpdates,
    createNewBook,
    createJsonFile,
    completeCreation,
    currentBook,
    loadingBook: isLoading || fetchingVersion,
    getCurrentBookVersion,
    ebooks,
    bookVersion,
    fixDecisionTree,
  };
};

export default useBookMethods;
