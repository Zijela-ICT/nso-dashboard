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
  Item,
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
} from "../booktypes";
import axios from "axios";
import dayjs from "dayjs";
import { saveAs } from "file-saver";
import { useEffect, useMemo, useState } from "react";
import { useUpload } from "@/hooks/upload";
import { getEbookVersion, getFile, updateEbooks } from "@/utils/book.services";
import useEBooks from "./useEBooks";
import { useParams } from "next/navigation";
import { showToast } from "@/utils/toast";

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
  const { data: ebooks, mutation, refetch: getEbooks, isLoading } = useEBooks();
  const params = useParams<{ id: string }>();
  const getUploadFileUrl = useUpload();
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

  useEffect(() => {
    const a = [
      {
        chapter: "chapter title",
        subChapters: [
          {
            subSubChapters: [
              {
                pages: [
                  {
                    pageTitle: "new page title",
                    items: [
                      {
                        type: "text",
                        content: "this is the text content in the page page!",
                      },
                    ],
                  },
                ],
                subSubChapterTitle: "sub sub title",
              },
            ],
            subChapterTitle: "sub chapter title",
            pages: [
              {
                pageTitle: "",
                items: [
                  {
                    type: "text",
                    content:
                      "this is the text content in the sub chapter level",
                  },
                ],
              },
            ],
          },
        ],
        pages: [
          {
            pageTitle: "new page title",
            items: [
              {
                type: "text",
                content: "this is the text content in the chapter level",
              },
            ],
          },
        ],
      },
    ];
    console.log("tester", flattenArrayOfObjects(a));
  }, []);
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
      console.log("isPage(newElement)", isPage(newElement));

      if (isPage(newElement)) {
        console.log("subSubIndex", subSubIndex);
        console.log("pageToBeUpdatedIndices", pageToBeUpdatedIndices);
        console.log({ chapterIndex, subChapterIndex, subSubIndex });

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
    console.log("updatedData", updatedData);

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
    console.log("payload", payload);

    const updatedData = { ...data };
    const flattenedArr = flattenArrayOfObjects(updatedData.book.content);
    const updatedFlattenedArr = [...flattenedArr];

    updatedFlattenedArr[elementPosition] = {
      ...updatedFlattenedArr[elementPosition],
      data: payload,
    };
    if (typeof payload === "object" && payload?.type === "decision") {
      console.log("payload", payload);

      const { upperTable, lowerTable } = generateTablesFromDecisionTree(
        payload as IDecisionTree
      );
      updatedFlattenedArr[elementPosition + 1] = {
        ...updatedFlattenedArr[elementPosition + 1],
        data: upperTable,
      };

      updatedFlattenedArr[elementPosition + 2] = {
        ...updatedFlattenedArr[elementPosition + 2],
        data: lowerTable,
      };

      updatedFlattenedArr[elementPosition + 3] = {
        ...updatedFlattenedArr[elementPosition + 3],
        data: {
          type: "orderedList",
          items: payload?.healthEducation,
          fromDecisionTree: true,
        },
      };
    }
    const unflattendContent = unflattenArrayOfObjects([...updatedFlattenedArr]);
    updatedData.book.content = unflattendContent;
    setData(updatedData);
  };

  const removeElement = (element_index?: number) => {
    const updatedData = { ...data };
    const flattenedArr = flattenArrayOfObjects(updatedData.book.content);
    const elementIndex = element_index;

    if (elementIndex < 0) return;

    const path = flattenedArr[elementIndex].parentIndex;

    const [chapterIndex, ...rest] = path;

    switch (path.length) {
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
          const subChapter =
            updatedData.book.content[chapterIndex].subChapters[rest[0]];
          if (typeof flattenedArr[elementIndex].data === "string") {
            // Remove entire subChapter
            updatedData.book.content[chapterIndex].subChapters[
              rest[1]
            ].subSubChapters.splice(rest[2], 1);
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
    return flattenArrayOfObjects(data ? book?.content : []);
  }, [book?.content, data]);

  const exportToJson = () => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.book.bookTitle} - ${dayjs().format(
      "DD MMM YYYY: mm:a h"
    )}`;
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
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const file = convertBlobToFile(blob, fileName);
    try {
      const url = await getUploadFileUrl(file);
      handleUpdate({ newFileUrl: url }, id);
    } catch (error) {}
  };

  const handleUpdate = async (data, id) => {
    try {
      await updateEbooks(data, id);
      getEbooks();
      showToast("book updated successfully");
    } catch (error) {}
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
    const form = new FormData();
    form.append("file", file);
    try {
      const fileUrl = await getUploadFileUrl(file);
      completeCreation(fileUrl);
    } catch (error) {
      console.log(error.response);
    }
  };

  const completeCreation = async (fileUrl: string) => {
    mutation.mutate(
      {
        bookType: params.id.toUpperCase(),
        fileUrl,
      },
      {
        onSuccess: () => {
          showToast("Book created successfully", "success");
        },
      }
    );
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
    } finally {
      setFetchingVersion(false);
    }
  };

  const downloadBook = async (url) => {
    try {
      const bookData = (await getFile(url)) as Data;
      setData(bookData);
    } catch (error) {}
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
    uploadBlankBook,
    completeCreation,
    currentBook,
    loadingBook: isLoading || fetchingVersion,
    getCurrentBookVersion,
    ebooks,
    bookVersion,
  };
};

export default useBookMethods;
