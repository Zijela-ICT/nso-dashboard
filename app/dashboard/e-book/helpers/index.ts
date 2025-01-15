import { InfographicData } from "../components/AddInfographicModal";
import {
  Chapter,
  Data,
  FlattenedObj,
  IDecisionTree,
  Item,
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
  return arr.flatMap((item, index) => {
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
      if (typedItem.type === "table" && typedItem.fromDecisionTree) {
        return;
      }
      // Add chapter pages
      if (Array.isArray(typedItem.pages)) {
        results.push(
          ...flattenArrayOfObjects(typedItem.pages, currentParentIndex)
        );
      }

      // Handle subChapters
      if (Array.isArray(typedItem.subChapters)) {
        typedItem.subChapters.forEach((subChapter, subIndex) => {
          // Add subChapter title
          if (subChapter.subChapterTitle !== undefined) {
            results.push({
              data: subChapter.subChapterTitle as string,
              parentIndex: [...currentParentIndex, subIndex],
            });
          }

          // Add subChapter pages
          if (Array.isArray(subChapter.pages)) {
            results.push(
              ...flattenArrayOfObjects(subChapter.pages, [
                ...currentParentIndex,
                subIndex,
              ])
            );
          }

          // Handle subSubChapters
          if (Array.isArray(subChapter.subSubChapters)) {
            subChapter.subSubChapters.forEach((subSubChapter, subSubIndex) => {
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
        break;

      case 2: // Chapter pages or SubChapter title
        if (typeof data === "string") {
          // SubChapter title
          if (!chapter.subChapters[rest[0]]) {
            chapter.subChapters[rest[0]] = {
              subChapterTitle: data,
              pages: [],
              subSubChapters: [],
            };
          } else {
            chapter.subChapters[rest[0]].subChapterTitle = data;
          }
        } else {
          // Chapter page
          chapter.pages[rest[0]] = data as Item;
        }
        break;

      case 3:
        const subChapter = chapter.subChapters[rest[0]];
        if (!subChapter) {
          chapter.subChapters[rest[0]] = {
            subChapterTitle: "",
            pages: [],
            subSubChapters: [],
          };
        }

        if (typeof data === "string") {
          if (!subChapter.subSubChapters[rest[1]]) {
            subChapter.subSubChapters[rest[1]] = {
              subSubChapterTitle: data,
              pages: [],
            };
          } else {
            subChapter.subSubChapters[rest[1]].subSubChapterTitle = data;
          }
        } else {
          subChapter.pages[rest[1]] = data as Item;
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

const flattenForExporting = (data: Data) => {
  const originalContent = data.book.content;
  let flattendData = flattenArrayOfObjects(originalContent);
  flattendData.forEach((item, index) => {
    if (
      typeof item.data === "object" &&
      item.data !== null && // Ensure it's not null
      "content" in item.data && // Check if 'content' exists in item.data
      (item.data as Record<string, any>).content.type === "decision"
    ) {
      const { upperTable, lowerTable } = generateTablesFromDecisionTree(
        item.data.content as IDecisionTree
      );
      flattendData.splice(index, 0, upperTable);
      flattendData.splice(index + 1, 0, upperTable);
    }
  });
};

const generateTablesFromDecisionTree = (
  decisionTree: IDecisionTree
): { upperTable: TableData; lowerTable: TableData } => {
  const { history, examinationsActions, cases } = decisionTree;
  console.log("decisionTree", decisionTree);

  // Upper table
  const upperTable: TableData = {
    type: "table",
    headers: [
      [
        { content: "HISTORY", type: "text" },
        { content: "EXAMINATIONS/ACTIONS", type: "text" },
      ],
    ],
    rows: [
      [
        {
          content: history,
          type: "orderedList",
        },
        {
          content: examinationsActions,
          type: "orderedList",
        },
      ],
    ],
    showCellBorders: true,
    tableStyle: {},
    columnCount: 2,
    fromDecisionTree: true,
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
      },
      {
        content: caseItem.findingsOnExamination,
        rowSpan: 1,
        colSpan: 1,
        type: "orderedList",
      },
      {
        content: caseItem.clinicalJudgement,
        rowSpan: 1,
        colSpan: 1,
        type: "text",
      },
      {
        content: caseItem.actions,
        rowSpan: 1,
        colSpan: 1,
        type: "orderedList",
      },
    ]),
    showCellBorders: true,
    tableStyle: {},
    columnCount: 4,
    fromDecisionTree: true,
  };

  return { upperTable, lowerTable };
};

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
  type: string,
  newItemKey: string,
  createData?: TableData | IDecisionTree | Linkable | InfographicData | Space
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
      const items = Array.from({ length: 1 }, (_, i) => `list Item ${i + 1}`);
      newItem = {
        type,
        items,
      };
      break;
    }
    case "orderedList": {
      const items = Array.from({ length: 1 }, (_, i) => `list Item ${i + 1}`);
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
        pages: [],
      };
      break;
    case PageItemType.SubChapter:
      newItem = {
        subSubChapters: [],
        subChapterTitle: `${newItemKeys[0]}`,
        pages: [],
      };
      break;
    case PageItemType.SubSubChapter:
      newItem = {
        pages: [],
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
