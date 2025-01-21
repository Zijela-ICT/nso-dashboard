import { InfographicData } from "../components/AddInfographicModal";
import {
  Chapter,
  Data,
  FlattenedObj,
  IDecisionTree,
  Item,
  ItemTypes,
  Linkable,
  Page,
  PageItemType,
  Space,
  SubChapter,
  SubSubChapter,
  TableData,
} from "../booktypes";

function isItem(obj: unknown): obj is Item {
  return obj !== null && typeof obj === "object" && "type" in obj;
}

export function addItemAtIndex<T>(arr: T[], item: T, index: number): T[] {
  const newArr = [...arr];
  newArr.splice(index, 0, item);
  return newArr;
}

export function flattenObject(obj: object, prefix: string = ""): object {
  return Object.keys(obj).reduce((acc: object, key: string) => {
    const prefixedKey = prefix ? `${prefix}.${key}` : key;

    if (
      typeof obj[key] === "object" &&
      obj[key] !== null &&
      !Array.isArray(obj[key])
    ) {
      Object.assign(acc, flattenObject(obj[key], prefixedKey));
    } else {
      acc[prefixedKey] = obj[key];
    }

    return acc;
  }, {});
}

export function flattenArrayOfObjects(
  arr: (object | string | number | boolean | null)[],
  parentIndex: number[] = []
): FlattenedObj[] {
  return arr?.flatMap((item, index) => {
    const currentParentIndex = [...parentIndex, index];

    if (Array.isArray(item)) {
      return flattenArrayOfObjects(item, currentParentIndex);
    } else if (
      typeof item === "object" &&
      item !== null &&
      !isItem(item) &&
      !Array.isArray(item)
    ) {
      const typedItem = item as Record<
        string,
        | string
        | number
        | boolean
        | null
        | Record<string, unknown>[]
        | Record<string, unknown>
      >;

      // Add the chapter title
      const results: FlattenedObj[] = [];
      if (typedItem.chapter) {
        results.push({
          data: typedItem.chapter as string,
          parentIndex: currentParentIndex,
        });
      }
      if (typedItem.type === "table" && typedItem.forDecisionTree) {
        return;
      }
      // Add chapter pages
      if (Array.isArray(typedItem.pages && typedItem.pages[0].items)) {
        results.push(
          ...flattenArrayOfObjects(typedItem.pages[0].items, currentParentIndex)
        );
      }

      // Handle subChapters
      if (Array.isArray(typedItem.subChapters)) {
        typedItem.subChapters.forEach((subChapter, subIndex) => {
          // Add subChapter title
          if (subChapter?.subChapterTitle !== undefined) {
            results.push({
              data: subChapter?.subChapterTitle as string,
              parentIndex: [...currentParentIndex, subIndex],
            });
          }

          // Add subChapter pages
          if (Array.isArray(subChapter?.pages)) {
            results.push(
              ...flattenArrayOfObjects(subChapter?.pages[0].items, [
                ...currentParentIndex,
                subIndex,
              ])
            );
          }

          // Handle subSubChapters
          if (Array.isArray(subChapter?.subSubChapters)) {
            subChapter?.subSubChapters.forEach((subSubChapter, subSubIndex) => {
              // Add subSubChapter title if it exists
              if (subSubChapter?.subSubChapterTitle !== undefined) {
                results.push({
                  data: subSubChapter?.subSubChapterTitle,
                  parentIndex: [...currentParentIndex, subIndex, subSubIndex],
                });
              }

              // Handle pages with pageTitle and items array
              if (Array.isArray(subSubChapter?.pages)) {
                subSubChapter.pages.forEach((page, pageIndex) => {
                  // Add page title
                  if (page.pageTitle) {
                    results.push({
                      data: page.pageTitle,
                      parentIndex: [
                        ...currentParentIndex,
                        subIndex,
                        subSubIndex,
                        pageIndex,
                      ],
                    });
                  }

                  // Add page items
                  if (Array.isArray(page.items)) {
                    page.items.forEach((item, itemIndex) => {
                      const path =
                        (item?.data as string) ||
                        (item?.content as string) ||
                        (item?.data?.content as string) ||
                        (item?.src as string) ||
                        (item?.title as string);
                      results.push({
                        data: item,
                        dataPath: path,
                        parentIndex: [
                          ...currentParentIndex,
                          subIndex,
                          subSubIndex,
                          pageIndex,
                          itemIndex,
                        ],
                      });
                    });
                  }
                });
              }
            });
          }
        });
      }

      return results;
    } else {
      return [
        {
          data: item as string | number | boolean | null | Item,
          parentIndex: currentParentIndex,
        },
      ];
    }
  });
}

export function unflattenArrayOfObjects(
  flattenedArray: FlattenedObj[]
): Chapter[] {
  const result: Chapter[] = [];

  flattenedArray.forEach(({ data, parentIndex }) => {
    const [chapterIndex, ...rest] = parentIndex;

    // Initialize chapter if needed
    if (!result[chapterIndex]) {
      result[chapterIndex] = {
        chapter: "",
        pages: [],
        subChapters: [],
      };
    }

    const chapter = result[chapterIndex];

    switch (parentIndex.length) {
      case 1: // Chapter title
        chapter.chapter = data as string;
        chapter.pages = [{ items: [], pageTitle: "" }];
        chapter.subChapters = [];
        break;

      case 2: // Chapter pages or SubChapter title
        if (typeof data === "string") {
          // SubChapter title
          if (!chapter.subChapters[rest[0]]) {
            chapter.subChapters[rest[0]] = {
              subChapterTitle: data,
              pages: [{ items: [], pageTitle: "" }],
              subSubChapters: [],
            };
          }
          chapter.subChapters[rest[0]].subChapterTitle = data;
        } else {
          // Chapter page
          chapter.pages[0].items[rest[0]] = data as Item;
        }
        break;

      case 3:
        let subChapter = chapter.subChapters[rest[0]];
        if (!subChapter) {
          const newSubChapter = {
            subChapterTitle: "",
            pages: [
              {
                pageTitle: "",
                items: [],
              },
            ],
            subSubChapters: [],
          };
          chapter.subChapters[rest[0]] = newSubChapter;
          subChapter = newSubChapter;
        }

        if (typeof data === "string") {
          if (!subChapter?.subSubChapters[rest[1]]) {
            subChapter.subSubChapters[rest[1]] = {
              subSubChapterTitle: data,
              pages: [
                {
                  pageTitle: "",
                  items: [],
                },
              ],
            };
          } else {
            subChapter.subSubChapters[rest[1]].subSubChapterTitle = data;
          }
        } else {
          subChapter.pages[0].items[rest[1]] = data as Item;
        }
        break;

      case 4:
        {
          const targetSubChapter = chapter.subChapters[rest[0]];
          if (
            !targetSubChapter.subSubChapters[rest[1]] ||
            !targetSubChapter.subSubChapters[rest[1]].pages
          ) {
            targetSubChapter.subSubChapters[rest[1]] = {
              subSubChapterTitle: "",
              pages: [],
            };
          }
          if (
            !targetSubChapter.subSubChapters?.[rest[1]].pages ||
            !targetSubChapter.subSubChapters[rest[1]].pages[rest[2]]
          ) {
            targetSubChapter.subSubChapters[rest[1]].pages[rest[2]] = {
              pageTitle: data as string,
              items: [],
            };
          }

          targetSubChapter.subSubChapters[rest[1]].pages[rest[2]].pageTitle =
            data as string;
        }
        break;

      case 5:
        {
          // SubSubChapter page items
          const targetSubSubChapter =
            chapter.subChapters[rest[0]].subSubChapters[rest[1]];
          if (!targetSubSubChapter.pages[rest[2]]) {
            targetSubSubChapter.pages[rest[2]] = {
              pageTitle: "",
              items: [],
            };
          }
          targetSubSubChapter.pages[rest[2]].items[rest[3]] = data as Item;
        }
        break;
    }
  });

  return result;
}

export const getLocalizedText = (data: Data, key: string): string => {
  if (!key || typeof key !== "string") {
    return "";
  } else if (!data?.locales) {
    return key;
  } else {
    return "";
  }
};

export const createNewItem = (
  type: ItemTypes,
  newItemKey: string,
  createData?:
    | TableData
    | IDecisionTree
    | Linkable
    | InfographicData
    | Space
    | string[],
  forDecisionTree?: boolean
): Item | null => {
  let newItem: Item | null;
  switch (type) {
    case "text":
      newItem = {
        type,
        content: newItemKey || "New text item",
      };
      break;
    case "unorderedList": {
      const items =
        (createData as string[]) ||
        Array.from({ length: 1 }, (_, i) => `list Item ${i + 1}`);
      newItem = {
        type,
        items,
        forDecisionTree: forDecisionTree || false,
      };
      break;
    }
    case "orderedList": {
      const items =
        (createData as string[]) ||
        Array.from({ length: 1 }, (_, i) => `list Item ${i + 1}`);
      newItem = {
        type,
        items,
      };
      break;
    }
    case "infographic": {
      const data = createData as InfographicData;
      newItem = {
        type,
        src: data.image as string,
        alt: `${newItemKey}_alt`,
      };
      break;
    }
    case "heading2":
    case "heading3":
    case "heading4":
      newItem = {
        type: type,
        content: newItemKey,
      };
      break;
    case "table": {
      newItem = createData as Item;
      break;
    }
    case "decision": {
      newItem = createData as IDecisionTree;
      break;
    }
    case "linkable": {
      newItem = createData as Linkable;
      break;
    }
    case "space": {
      newItem = createData as Space;
      break;
    }
    default:
      return null;
  }
  return newItem;
};

export const createNewPageData = (
  type: PageItemType,
  newItemKeys: string[]
): Chapter | SubChapter | SubSubChapter | Page => {
  let newItem: Chapter | SubChapter | SubSubChapter | Page;
  switch (type) {
    case PageItemType.Chapter:
      newItem = {
        chapter: newItemKeys[0],
        subChapters: [],
        pages: [
          {
            pageTitle: "",
            items: [],
          },
        ],
      };
      break;
    case PageItemType.SubChapter:
      newItem = {
        subSubChapters: [],
        subChapterTitle: `${newItemKeys[0]}`,
        pages: [
          {
            pageTitle: "",
            items: [],
          },
        ],
      };
      break;
    case PageItemType.SubSubChapter:
      newItem = {
        pages: [
          {
            pageTitle: "",
            items: [],
          },
        ],
        subSubChapterTitle: newItemKeys[0],
      };
      break;
    case PageItemType.Page:
      newItem = {
        pageTitle: newItemKeys[0],
        items: [],
      };
      break;
    default:
      break;
  }

  return newItem;
};

export function generateRandomString(length: number = 8): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// eslint-disable-next-line
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>): void => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export const handleCreateNewElement = (
  type: ItemTypes,
  createData,
  element_Index,
  isHeader,
  data,
  whatType
) => {
  if (!data && element_Index === undefined) return;
  const updatedData = { ...data };

  if (element_Index === undefined) return;

  let flattenedArr: FlattenedObj[] = flattenArrayOfObjects(
    updatedData.book.content
  );
  const elementIndex = element_Index;
  if (elementIndex < 0) return;

  const itemAtIndex = flattenedArr[elementIndex];
  const path = isHeader
    ? [...itemAtIndex.parentIndex, -1]
    : itemAtIndex.parentIndex;
  const newItemKey = `here is some new text content`;
  let unflattendContent: Chapter[] = null;
  if (
    type === "listitem" &&
    typeof flattenedArr[elementIndex].data === "object" &&
    "items" in flattenedArr[elementIndex].data &&
    Array.isArray(flattenedArr[elementIndex].data.items)
  ) {
    const newElementData = {
      ...flattenedArr[elementIndex],
      data: {
        ...flattenedArr[elementIndex].data,
        items: [...flattenedArr[elementIndex].data.items, "New list item"],
      },
    };
    flattenedArr[elementIndex] = newElementData;
    unflattendContent = unflattenArrayOfObjects([...flattenedArr]);
  } else {
    let newItem: Item | null;
    if (
      type === "table" ||
      type === "linkable" ||
      type === "decision" ||
      type === "infographic" ||
      type === "space"
    ) {
      newItem = createNewItem(type, newItemKey, createData);
    } else {
      newItem = createNewItem(type, newItemKey);
    }

    // Create the new path for insertion
    const newPath = [...path.slice(0, -1), path[path.length - 1] + 1];

    // Increment indices of all existing elements at or after the insertion point
    const updatedFlattenedArr = flattenedArr.map((item) => {
      const currentPath = item.parentIndex;
      // Only adjust elements at the same level and after the insertion point
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
            type === "decision"
              ? currentPath[currentPath.length - 1] + 3
              : currentPath[currentPath.length - 1] + 1, // move 3 places for decision trees else just 1
          ],
        };
      }
      return item;
    });

    // Insert the new element
    updatedFlattenedArr.splice(elementIndex + 1, 0, {
      data: newItem,
      parentIndex: newPath, // Use the new path here
    });

    // add a table to every decision tree
    if (type === "decision") {
      const newPath2 = [...path.slice(0, -1), path[path.length - 1] + 2];
      const newPath3 = [...path.slice(0, -1), path[path.length - 1] + 3];
      const newPath4 = [...path.slice(0, -1), path[path.length - 1] + 4];
      const { upperTable, lowerTable } = generateTablesFromDecisionTree(
        createData as IDecisionTree
      );
      updatedFlattenedArr.splice(elementIndex + 2, 0, {
        data: createNewItem("table", newItemKey, upperTable),
        parentIndex: newPath2,
      });
      updatedFlattenedArr.splice(elementIndex + 3, 0, {
        data: createNewItem("table", newItemKey, lowerTable),
        parentIndex: newPath3,
      });
      updatedFlattenedArr.splice(elementIndex + 4, 0, {
        data: {
          type: "heading2",
          content: "Health Education",
        },
        parentIndex: newPath3,
      });
      updatedFlattenedArr.splice(elementIndex + 5, 0, {
        data: createNewItem(
          "orderedList",
          newItemKey,
          createData.healthEducation,
          true
        ),
        parentIndex: newPath4,
      });
    }

    // Reconstruct the book content
    unflattendContent = unflattenArrayOfObjects([...updatedFlattenedArr]);
    flattenedArr = updatedFlattenedArr;
  }
  return whatType === "flat" ? flattenedArr : unflattendContent;
};

export const generateTablesFromDecisionTree = (
  decisionTree: IDecisionTree
): { upperTable: TableData; lowerTable: TableData } => {
  const { history, examinationsActions, cases } = decisionTree;

  // Upper table
  const upperTable: TableData = {
    type: "table",
    headers: [
      [
        {
          content: "HISTORY",
          type: "text",
          cellStyle: { backgroundColor: "#0CA554", color: "white" },
        },
        {
          content: "EXAMINATIONS/ACTIONS",
          type: "text",
          cellStyle: { backgroundColor: "#0CA554", color: "white" },
        },
      ],
    ],
    rows: [
      [
        {
          items: history,
          type: "orderedList",
          cellStyle: { backgroundColor: "#FFFAEB", color: "black" },
        },
        {
          items: examinationsActions,
          type: "orderedList",
          cellStyle: { backgroundColor: "#FFFAEB", color: "black" },
        },
      ],
    ],
    showCellBorders: true,
    tableStyle: {},
    columnCount: 2,
    forDecisionTree: true,
  };
  // Lower table
  const lowerTable: TableData = {
    type: "table",
    headers: [
      [
        { content: "FINDINGS ON HISTORY", type: "text" },
        { content: "FINDINGS ON EXAMINATION", type: "text" },
        { content: "CLINICAL JUDGMENT", type: "text" },
        { content: "ACTIONS", type: "text" },
      ],
    ],
    rows: cases.map((caseItem) => [
      {
        content: caseItem.findingsOnHistory,
        rowSpan: 1,
        colSpan: 1,
        type: "text",
        cellStyle: { backgroundColor: "#ECFDF3", color: "black" },
      },
      {
        items: caseItem.findingsOnExamination,
        rowSpan: 1,
        colSpan: 1,
        type: "orderedList",
        cellStyle: { backgroundColor: "#ECFDF3", color: "black" },
      },
      {
        content: caseItem.clinicalJudgement,
        rowSpan: 1,
        colSpan: 1,
        type: "text",
        cellStyle: { backgroundColor: "#ECFDF3", color: "black" },
      },
      {
        items: caseItem.actions,
        rowSpan: 1,
        colSpan: 1,
        type: "orderedList",
        cellStyle: { backgroundColor: "#ECFDF3", color: "black" },
      },
    ]),
    showCellBorders: true,
    tableStyle: {},
    columnCount: 4,
    forDecisionTree: true,
  };

  return { upperTable, lowerTable };
};
